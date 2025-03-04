import { AddTaskRounded, DoNotDisturbAltRounded, DoneRounded, LinkOff, PushPinRounded } from '@mui/icons-material'
import { Alert, AlertTitle, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from '@mui/material'
import { Emoji, EmojiStyle } from 'emoji-picker-react'
import { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  DescriptionLink,
  EmojiContainer,
  Pinned,
  RingAlarm,
  TaskContainer,
  TaskDate,
  TaskDescription,
  TaskHeader,
  TaskInfo,
  TaskName,
  TimeLeft
} from '../components/tasks/tasks.styled'
import { URL_REGEX, USER_NAME_MAX_LENGTH } from '../constants'
import { UserContext } from '../contexts/UserContext'
import { DialogBtn } from '../styles'
import type { Task } from '../types/user'
import { calculateDateDifference, formatDate, getFontColor, showToast, systemInfo } from '../utils'
import Home from './Home'
import { CategoryBadge } from '../components/CategoryBadge/CategoryBadge'

//FIXME: make everything type-safe
const SharePage = () => {
  const { user, setUser } = useContext(UserContext)
  const n = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const taskParam = queryParams.get('task')
  const userNameParam = queryParams.get('userName')

  const [taskData, setTaskData] = useState<Task | null>(null)
  const [userName, setUserName] = useState<string>('')
  const [error, setError] = useState<boolean>(false)
  const [errorDetails, setErrorDetails] = useState<string | undefined>()

  useEffect(() => {
    if (taskParam) {
      const isHexColor = (value: string): boolean => /^#[0-9A-Fa-f]{6}$/.test(value)
      try {
        const decodedTask = decodeURIComponent(taskParam)
        const task: Task = {
          ...(JSON.parse(decodedTask) as Task),
          id: crypto.randomUUID()
        }
        if (!isHexColor(task.color)) {
          setError(true)
          setErrorDetails('Formato de color de tarea inválido.')
          return
        }
        if (task.category) {
          task.category.forEach((taskCategory) => {
            if (!isHexColor(taskCategory.color)) {
              setError(true)
              setErrorDetails('Formato de color de categoría inválido.')
              return
            }
          })
        }
        setTaskData(task)
      } catch (error) {
        console.error('Error al decodificar los datos de la tarea:', error)
        setErrorDetails(`Error al decodificar los datos de la tarea.${error}`)
        setError(true)
      }
    }

    if (userNameParam) {
      const decodedUserName = decodeURIComponent(userNameParam)
      if (decodedUserName.length > USER_NAME_MAX_LENGTH) {
        setError(true)
        setErrorDetails('El nombre de usuario es demasiado largo.')
      }
      setUserName(decodedUserName)
    }
  }, [taskParam, userNameParam])

  useEffect(() => {
    document.title = `Todo App - Tarea Recibida ${taskData ? `(${taskData.name})` : ''}`
  }, [taskData])

  const handleAddTask = () => {
    if (taskData) {
      // Add missing categories to user.categories
      const updatedCategories = [...user.categories]

      if (taskData.category) {
        taskData.category.forEach((taskCategory) => {
          const existingCategoryIndex = updatedCategories.findIndex((cat) => cat.id === taskCategory.id)

          if (existingCategoryIndex !== -1) {
            // If category with the same ID exists, replace it with the new category
            updatedCategories[existingCategoryIndex] = taskCategory
          } else {
            // Otherwise, add the new category to the array
            updatedCategories.push(taskCategory)
          }
        })
      }

      setUser((prevUser) => ({
        ...prevUser,
        categories: updatedCategories,
        tasks: [
          ...prevUser.tasks.filter(Boolean),
          {
            ...taskData,
            id: crypto.randomUUID(),
            sharedBy: userName
          }
        ]
      }))

      n('/')
      showToast(
        <div>
          Tarea compartida agregada - <b translate='no'>{taskData.name}</b>
        </div>,
        {
          icon: <AddTaskRounded />
        }
      )
    }
  }

  // Renders the task description with optional hyperlink parsing and text highlighting.
  const renderTaskDescription = (task: Task): JSX.Element | null => {
    if (!task || !task.description) return null

    const { description, color } = task

    const parts = description.split(URL_REGEX)

    const descriptionWithLinks = parts.map((part, index) => {
      if (index % 2 === 0) {
        return part
      }
      const url = new URL(part)
      return (
        <Tooltip title={part} key={index}>
          <DescriptionLink clr={color} disabled>
            <div>
              <LinkOff sx={{ fontSize: '24px' }} /> {url.hostname}
            </div>
          </DescriptionLink>
        </Tooltip>
      )
    })

    return <div>{descriptionWithLinks}</div>
  }

  return (
    <div>
      <Home />
      <Dialog
        open
        PaperProps={{
          style: {
            borderRadius: '24px',
            padding: ' 10px 6px',
            width: '100% !important'
          }
        }}
      >
        {!error && taskData ? (
          <>
            <DialogTitle>Tarea Recibida</DialogTitle>
            <DialogContent>
              <p style={{ fontSize: '16px', marginLeft: '6px' }}>
                <b translate='no'>{userName}</b> te compartió una tarea.
              </p>
              <TaskContainer
                done={taskData.done}
                backgroundColor={taskData.color}
                style={{ maxWidth: '600px', opacity: 1, padding: '16px 22px' }}
              >
                {taskData.emoji || taskData.done ? (
                  <EmojiContainer clr={getFontColor(taskData.color)}>
                    {taskData.done ? (
                      <DoneRounded fontSize='large' />
                    ) : user.emojisStyle === EmojiStyle.NATIVE ? (
                      <div>
                        <Emoji
                          size={systemInfo.os === 'iOS' ? 48 : 36}
                          unified={taskData.emoji || ''}
                          emojiStyle={EmojiStyle.NATIVE}
                        />
                      </div>
                    ) : (
                      <Emoji size={48} unified={taskData.emoji || ''} emojiStyle={user.emojisStyle} />
                    )}
                  </EmojiContainer>
                ) : null}
                <TaskInfo translate='no' style={{ marginRight: '14px' }}>
                  {taskData.pinned && (
                    <Pinned translate='yes'>
                      <PushPinRounded fontSize='small' /> &nbsp; Fijada
                    </Pinned>
                  )}
                  <TaskHeader style={{ gap: '6px' }}>
                    <TaskName done={taskData.done}>{taskData.name}</TaskName>
                    <Tooltip
                      title={new Intl.DateTimeFormat(navigator.language, {
                        dateStyle: 'full',
                        timeStyle: 'medium'
                      }).format(new Date(taskData.date))}
                    >
                      <TaskDate>{formatDate(new Date(taskData.date))}</TaskDate>
                    </Tooltip>
                  </TaskHeader>
                  <TaskDescription done={taskData.done}>{renderTaskDescription(taskData)}</TaskDescription>
                  {taskData.deadline && (
                    <TimeLeft done={taskData.done}>
                      <RingAlarm
                        fontSize='small'
                        animate={new Date() > new Date(taskData.deadline) && !taskData.done}
                        sx={{
                          color: `${getFontColor(taskData.color)} !important`
                        }}
                      />
                      &nbsp;Fecha límite:&nbsp;
                      {new Date(taskData.deadline).toLocaleDateString()} {' • '}
                      {new Date(taskData.deadline).toLocaleTimeString()}
                      {!taskData.done && (
                        <>
                          {' • '}
                          {calculateDateDifference(new Date(taskData.deadline))}
                        </>
                      )}
                    </TimeLeft>
                  )}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '4px 6px',
                      justifyContent: 'left',
                      alignItems: 'center'
                    }}
                  >
                    {taskData.category?.map((category) => (
                      <div key={category.id}>
                        <CategoryBadge category={category} borderclr={getFontColor(taskData.color)} />
                      </div>
                    ))}
                  </div>
                </TaskInfo>
              </TaskContainer>
              {taskData?.description?.match(URL_REGEX) ? (
                <Alert sx={{ mt: '20px' }} severity='warning'>
                  <AlertTitle>Esta tarea contiene los siguientes enlaces:</AlertTitle> {(() => {
                    const links = taskData.description.match(URL_REGEX)?.map((link) => link)
                    if (links) {
                      const listFormatter = new Intl.ListFormat('es-ES', {
                        style: 'long',
                        type: 'conjunction'
                      })
                      return <span style={{ wordBreak: 'break-all' }}>{listFormatter.format(links)}</span>
                    }
                    return null
                  })()}
                </Alert>
              ) : null}
            </DialogContent>
            <DialogActions>
              <DialogBtn color='error' onClick={() => n('/')}>
                <DoNotDisturbAltRounded /> &nbsp; Rechazar
              </DialogBtn>
              <DialogBtn
                onClick={() => {
                  handleAddTask()
                  n('/')
                }}
              >
                <AddTaskRounded /> &nbsp; Agregar Tarea
              </DialogBtn>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle>Algo salió mal</DialogTitle>
            <DialogContent>
              <p>
                ¡Oops! Algo salió mal al procesar la tarea compartida.{' '}
                {errorDetails && (
                  <b>
                    <br /> {errorDetails}
                  </b>
                )}
              </p>
            </DialogContent>
            <DialogActions>
              <DialogBtn onClick={() => n('/')}>Cerrar</DialogBtn>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  )
}

export default SharePage
