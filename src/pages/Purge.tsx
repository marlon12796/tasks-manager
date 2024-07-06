import { DeleteForeverRounded, DeleteSweepRounded, DoneAllRounded } from '@mui/icons-material'
import { Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Tooltip, Typography } from '@mui/material'
import { Emoji } from 'emoji-picker-react'
import { useContext, useEffect, useState } from 'react'
import { TopBar } from '../components'
import { UserContext } from '../contexts/UserContext'
import { useStorageState } from '../hooks/useStorageState'
import {
  DialogBtn,
  ManagementButton,
  ManagementButtonsContainer,
  ManagementContainer,
  ManagementHeader,
  TaskManagementContainer
} from '../styles'
import type { Task, UUID } from '../types/user'
import { showToast } from '../utils'

const Purge = () => {
  const { user, setUser } = useContext(UserContext)
  const { tasks } = user

  const [selectedTasks, setSelectedTasks] = useStorageState<UUID[]>([], 'tasksToPurge', 'sessionStorage') // Array de IDs de tareas seleccionadas
  const [deleteAllDialog, setDeleteAllDialog] = useState<boolean>(false)

  useEffect(() => {
    document.title = 'Aplicación de Tareas - Limpiar tareas'
  }, [])

  const doneTasks = tasks.filter((task) => task.done)
  const notDoneTasks = tasks.filter((task) => !task.done)

  const selectedNamesList = new Intl.ListFormat('es', {
    style: 'long',
    type: 'conjunction'
  }).format(
    selectedTasks.map((taskId) => {
      const selectedTask = user.tasks.find((task) => task.id === taskId)
      return selectedTask ? selectedTask.name : ''
    })
  )

  const handleTaskClick = (taskId: UUID) => {
    setSelectedTasks((prevSelectedTasks) => {
      if (prevSelectedTasks.includes(taskId)) {
        return prevSelectedTasks.filter((id) => id !== taskId)
      }
      return [...prevSelectedTasks, taskId]
    })
  }

  const purgeTasks = (tasks: Task[]) => {
    const updatedTasks = user.tasks.filter((task) => !tasks.some((purgeTask) => purgeTask === task))
    setSelectedTasks([])
    setUser((prevUser) => ({
      ...prevUser,
      tasks: updatedTasks
    }))
  }

  const handlePurgeSelected = () => {
    const tasksToPurge = tasks.filter((task: Task) => selectedTasks.includes(task.id))
    purgeTasks(tasksToPurge)
    showToast(
      <div>
        Tareas seleccionadas eliminadas: <b translate='no'>{selectedNamesList}</b>
      </div>
    )
  }

  const handlePurgeDone = () => {
    purgeTasks(doneTasks)
    showToast('Eliminadas todas las tareas completadas.')
  }

  const handlePurgeAll = () => {
    setDeleteAllDialog(true)
  }

  const renderTasks = (tasks: Task[], title: string) => {
    return (
      <>
        <Divider sx={{ fontWeight: 500, my: '4px' }}>{title}</Divider>
        {tasks.map((task) => (
          <TaskManagementContainer
            key={task.id}
            backgroundClr={task.color}
            onClick={() => handleTaskClick(task.id)}
            selected={selectedTasks.includes(task.id)}
            translate='no'
          >
            <Checkbox size='medium' checked={selectedTasks.includes(task.id)} />
            <Typography
              variant='body1'
              component='span'
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                wordBreak: 'break-word'
              }}
            >
              <Emoji size={24} unified={task.emoji || ''} emojiStyle={user.emojisStyle} /> {task.name}
            </Typography>
          </TaskManagementContainer>
        ))}
      </>
    )
  }

  return (
    <>
      <TopBar title='Limpiar Tareas' />
      <ManagementHeader>Seleccionar Tareas para Limpiar</ManagementHeader>
      <ManagementContainer>
        {doneTasks.length > 0 && renderTasks(doneTasks, 'Tareas Completadas')}
        {notDoneTasks.length > 0 && renderTasks(notDoneTasks, 'Tareas Pendientes')}
        {tasks.length === 0 && <h3 style={{ opacity: 0.8, fontStyle: 'italic' }}>No tienes tareas para limpiar</h3>}
      </ManagementContainer>
      <ManagementButtonsContainer>
        <Tooltip
          title={
            selectedTasks.length > 0 ? (
              <div>
                <span>Tareas Seleccionadas: </span>
                <span translate='no'>{selectedNamesList}</span>
              </div>
            ) : undefined
          }
        >
          <ManagementButton onClick={handlePurgeSelected} disabled={selectedTasks.length === 0}>
            <DeleteSweepRounded /> &nbsp; Limpiar Seleccionadas {selectedTasks.length > 0 && `[${selectedTasks.length}]`}
          </ManagementButton>
        </Tooltip>
        <ManagementButton onClick={handlePurgeDone} disabled={doneTasks.length === 0}>
          <DoneAllRounded /> &nbsp; Limpiar Completadas
        </ManagementButton>
        <ManagementButton color='error' onClick={handlePurgeAll} disabled={tasks.length === 0}>
          <DeleteForeverRounded /> &nbsp; Limpiar Todas las Tareas
        </ManagementButton>
      </ManagementButtonsContainer>
      <Dialog open={deleteAllDialog} onClose={() => setDeleteAllDialog(false)}>
        <DialogTitle>¿Estás seguro de que quieres limpiar todas tus tareas?</DialogTitle>
        <DialogContent>Esta acción no se puede deshacer. ¿Estás seguro de que quieres continuar?</DialogContent>
        <DialogActions>
          <DialogBtn onClick={() => setDeleteAllDialog(false)}>Cancelar</DialogBtn>
          <DialogBtn
            color='error'
            onClick={() => {
              purgeTasks(tasks)
              setDeleteAllDialog(false)
              showToast('Todas las tareas fueron eliminadas.')
            }}
          >
            <DeleteForeverRounded /> &nbsp; Limpiar
          </DialogBtn>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Purge
