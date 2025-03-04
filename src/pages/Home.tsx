import { type ReactNode, Suspense, lazy, useContext, useEffect, useMemo, useState } from 'react'
import {
  AddButton,
  GreetingHeader,
  GreetingText,
  Offline,
  ProgressPercentageContainer,
  StyledProgress,
  TaskCompletionText,
  TaskCountHeader,
  TaskCountTextContainer,
  TasksCount,
  TasksCountContainer
} from '../styles'

import { AddRounded, TodayRounded, WifiOff } from '@mui/icons-material'
import { Box, Tooltip, Typography } from '@mui/material'
import { Emoji } from 'emoji-picker-react'
import { useNavigate } from 'react-router-dom'
import { TaskProvider } from '../contexts/TaskProvider'
import { UserContext } from '../contexts/UserContext'
import { useOnlineStatus } from '../hooks/useOnlineStatus'
import { useResponsiveDisplay } from '../hooks/useResponsiveDisplay'
import { displayGreeting, getRandomGreeting, getTaskCompletionText } from '../utils'

const TasksList = lazy(() =>
  import('../components/tasks/TasksList').then((module) => ({
    default: module.TasksList
  }))
)

const Home = () => {
  const { user } = useContext(UserContext)
  const { tasks, emojisStyle, settings, name } = user
  const [randomGreeting, setRandomGreeting] = useState<string | ReactNode>('')
  const [greetingKey, setGreetingKey] = useState<number>(0)
  const [completedTasksCount, setCompletedTasksCount] = useState<number>(0)

  const [tasksWithDeadlineTodayCount, setTasksWithDeadlineTodayCount] = useState<number>(0)
  const [tasksDueTodayNames, setTasksDueTodayNames] = useState<string[]>([])

  const completedTaskPercentage = useMemo<number>(
    () => (completedTasksCount / tasks.length) * 100,
    [completedTasksCount, tasks.length]
  )

  const isOnline = useOnlineStatus()
  const n = useNavigate()
  const isMobile = useResponsiveDisplay()

  useEffect(() => {
    setRandomGreeting(getRandomGreeting())
    document.title = 'Todo App'

    const interval = setInterval(() => {
      setRandomGreeting(getRandomGreeting())
      setGreetingKey((prevKey) => prevKey + 1) // Update the key on each interval
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const completedCount = tasks.filter((task) => task.done).length
    setCompletedTasksCount(completedCount)

    const today = new Date().setHours(0, 0, 0, 0)

    const dueTodayTasks = tasks.filter((task) => {
      if (task.deadline) {
        const taskDeadline = new Date(task.deadline).setHours(0, 0, 0, 0)
        return taskDeadline === today && !task.done
      }
      return false
    })

    setTasksWithDeadlineTodayCount(dueTodayTasks.length)

    // Use Intl to format and display task names due today
    const taskNamesDueToday = dueTodayTasks.map((task) => task.name)
    setTasksDueTodayNames(taskNamesDueToday)
  }, [tasks])

  const replaceEmojiCodes = (text: string): ReactNode[] => {
    const emojiRegex = /\*\*(.*?)\*\*/g
    const parts = text.split(emojiRegex)

    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // It's an emoji code, render Emoji component
        const emojiCode = part.trim()
        return <Emoji key={part + index} size={20} unified={emojiCode} emojiStyle={emojisStyle} />
      }
      // It's regular text
      return part
    })
  }

  const renderGreetingWithEmojis = (text: string | ReactNode) => {
    if (typeof text === 'string') return replaceEmojiCodes(text)

    return text
  }

  return (
    <>
      <GreetingHeader>
        <Emoji unified='1f44b' emojiStyle={emojisStyle} /> &nbsp; {displayGreeting()}
        {name && (
          <span translate='no'>
            , <span>{name}</span>
          </span>
        )}
      </GreetingHeader>
      <GreetingText key={greetingKey}>{renderGreetingWithEmojis(randomGreeting)}</GreetingText>
      {!isOnline && (
        <Offline>
          <WifiOff /> ¡Estás desconectado, pero puedes usar la aplicación!
        </Offline>
      )}
      {tasks.length > 0 && (
        <TasksCountContainer>
          <TasksCount glow={settings[0].enableGlow}>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <StyledProgress
                variant='determinate'
                value={completedTaskPercentage}
                size={64}
                thickness={5}
                aria-label='Progreso'
                glow={settings[0].enableGlow}
              />

              <ProgressPercentageContainer glow={settings[0].enableGlow && completedTaskPercentage > 0}>
                <Typography
                  variant='caption'
                  component='div'
                  color='white'
                  sx={{ fontSize: '16px', fontWeight: 600 }}
                >{`${Math.round(completedTaskPercentage)}%`}</Typography>
              </ProgressPercentageContainer>
            </Box>
            <TaskCountTextContainer>
              <TaskCountHeader>
                {completedTasksCount === 0
                  ? `Tienes ${tasks.length} tarea${tasks.length > 1 ? 's' : ''} por completar.`
                  : `Has completado ${completedTasksCount} de ${tasks.length} tareas.`}
              </TaskCountHeader>
              <TaskCompletionText>{getTaskCompletionText(completedTaskPercentage)}</TaskCompletionText>
              {tasksWithDeadlineTodayCount > 0 && (
                <span
                  style={{
                    opacity: 0.8,
                    display: 'inline-block'
                  }}
                >
                  <TodayRounded sx={{ fontSize: '20px', verticalAlign: 'middle' }} />
                  &nbsp;Tareas pendientes para hoy:&nbsp;
                  <span translate='no'>{new Intl.ListFormat('es', { style: 'long' }).format(tasksDueTodayNames)}</span>
                </span>
              )}
            </TaskCountTextContainer>
          </TasksCount>
        </TasksCountContainer>
      )}

      <Suspense fallback={<div>Cargando...</div>}>
        <TaskProvider>
          <TasksList />
        </TaskProvider>
      </Suspense>

      {!isMobile && (
        <Tooltip title={tasks.length > 0 ? 'Agregar nueva tarea' : 'Agregar tarea'} placement='left'>
          <AddButton
            animate={tasks.length === 0 ? 'true' : 'false'}
            glow={settings[0].enableGlow ? 'true' : 'false'}
            onClick={() => n('add')}
            aria-label='Agregar Tarea'
          >
            <AddRounded style={{ fontSize: '44px' }} />
          </AddButton>
        </Tooltip>
      )}
    </>
  )
}

export default Home
