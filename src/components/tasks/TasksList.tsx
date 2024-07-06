import { useTheme } from '@emotion/react'
import {
  CancelRounded,
  Close,
  Delete,
  DeleteRounded,
  DoneAll,
  DoneRounded,
  Link,
  MoreVert,
  PushPinRounded,
  RadioButtonChecked,
  Search
} from '@mui/icons-material'
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, Tooltip } from '@mui/material'
import { Emoji, EmojiStyle } from 'emoji-picker-react'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { EditTask, TaskIcon, TaskMenu } from '..'
import { URL_REGEX } from '../../constants'
import { TaskContext } from '../../contexts/TaskContext'
import { UserContext } from '../../contexts/UserContext'
import { useCtrlS } from '../../hooks/useCtrlS'
import { useResponsiveDisplay } from '../../hooks/useResponsiveDisplay'
import { useStorageState } from '../../hooks/useStorageState'
import { DialogBtn } from '../../styles'
import { ColorPalette } from '../../theme/themeConfig'
import type { Category, Task, UUID } from '../../types/user'
import { calculateDateDifference, formatDate, getFontColor, showToast, systemInfo } from '../../utils'
import { RenderTaskDescription } from './RenderTaskDescription'
import {
  CategoriesListContainer,
  EmojiContainer,
  NoTasks,
  Pinned,
  RadioChecked,
  RadioUnchecked,
  RingAlarm,
  SearchClear,
  SearchInput,
  SelectedTasksContainer,
  StyledRadio,
  TaskContainer,
  TaskDate,
  TaskDescription,
  TaskHeader,
  TaskInfo,
  TaskName,
  TasksContainer,
  TimeLeft
} from './tasks.styled'
import { CategoryBadge } from '../CategoryBadge/CategoryBadge'

/**
 * Component to display a list of tasks.
 */

export const TasksList: React.FC = () => {
  const { user, setUser } = useContext(UserContext)
  const {
    selectedTaskId,
    setSelectedTaskId,
    anchorEl,
    setAnchorEl,
    setAnchorPosition,
    expandedTasks,
    toggleShowMore,
    search,
    setSearch,
    highlightMatchingText,
    multipleSelectedTasks,
    setMultipleSelectedTasks,
    handleSelectTask,
    editModalOpen,
    setEditModalOpen,
    deleteDialogOpen,
    setDeleteDialogOpen
  } = useContext(TaskContext)
  const open = Boolean(anchorEl)

  const [deleteSelectedOpen, setDeleteSelectedOpen] = useState<boolean>(false)
  const [categories, setCategories] = useState<Category[] | undefined>(undefined)
  const [selectedCatId, setSelectedCatId] = useStorageState<UUID | undefined>(undefined, 'selectedCategory', 'sessionStorage')
  const [categoryCounts, setCategoryCounts] = useState<{
    [categoryId: UUID]: number
  }>({})
  const isMobile = useResponsiveDisplay()
  const theme = useTheme()
  useCtrlS()

  const listFormat = useMemo(
    () =>
      new Intl.ListFormat('en-US', {
        style: 'long',
        type: 'conjunction'
      }),
    []
  )

  const selectedTask = useMemo(() => {
    return user.tasks.find((task) => task.id === selectedTaskId) || ({} as Task)
  }, [user.tasks, selectedTaskId])

  // Handler for clicking the more options button in a task
  const handleClick = (event: React.MouseEvent<HTMLElement>, taskId: UUID) => {
    setAnchorEl(event.currentTarget)
    setSelectedTaskId(taskId)
    const target = event.target as HTMLElement
    // Position the menu where the click event occurred
    if (target.tagName !== 'BUTTON') {
      setAnchorPosition({
        top: event.clientY,
        left: event.clientX
      })
    } else {
      setAnchorPosition(null)
    }
    if (!isMobile && !expandedTasks.has(taskId)) {
      toggleShowMore(taskId)
    }
  }

  const reorderTasks = useCallback(
    (tasks: Task[]): Task[] => {
      // Separate tasks into pinned and unpinned
      let pinnedTasks = tasks.filter((task) => task.pinned)
      let unpinnedTasks = tasks.filter((task) => !task.pinned)

      // Filter tasks based on the selected category
      if (selectedCatId !== undefined) {
        const categoryFilter = (task: Task) => task.category?.some((category) => category.id === selectedCatId) ?? false
        unpinnedTasks = unpinnedTasks.filter(categoryFilter)
        pinnedTasks = pinnedTasks.filter(categoryFilter)
      }

      // Filter tasks based on the search input
      const searchLower = search.toLowerCase()
      const searchFilter = (task: Task) =>
        task.name.toLowerCase().includes(searchLower) || task.description?.toLowerCase().includes(searchLower)
      unpinnedTasks = unpinnedTasks.filter(searchFilter)
      pinnedTasks = pinnedTasks.filter(searchFilter)

      // Move done tasks to bottom if the setting is enabled
      if (user.settings[0]?.doneToBottom) {
        const doneTasks = unpinnedTasks.filter((task) => task.done)
        const notDoneTasks = unpinnedTasks.filter((task) => !task.done)
        return [...pinnedTasks, ...notDoneTasks, ...doneTasks]
      }

      return [...pinnedTasks, ...unpinnedTasks]
    },
    [search, selectedCatId, user.settings]
  )

  const confirmDeleteTask = () => {
    // Deletes the selected task

    if (selectedTaskId) {
      const updatedTasks = user.tasks.filter((task) => task.id !== selectedTaskId)
      setUser((prevUser) => ({
        ...prevUser,
        tasks: updatedTasks
      }))

      setDeleteDialogOpen(false)
      showToast(
        <div>
          Deleted Task - <b translate='no'>{user.tasks.find((task) => task.id === selectedTaskId)?.name}</b>
        </div>
      )
    }
  }
  const cancelDeleteTask = () => {
    // Cancels the delete task operation
    setDeleteDialogOpen(false)
  }

  const handleMarkSelectedAsDone = () => {
    setUser((prevUser) => ({
      ...prevUser,
      tasks: prevUser.tasks.map((task) => {
        if (multipleSelectedTasks.includes(task.id)) {
          // Mark the task as done if selected
          return { ...task, done: true }
        }
        return task
      })
    }))
    // Clear the selected task IDs after the operation
    setMultipleSelectedTasks([])
  }

  const handleDeleteSelected = () => setDeleteSelectedOpen(true)

  useEffect(() => {
    const tasks: Task[] = reorderTasks(user.tasks)
    const uniqueCategories: Category[] = []

    tasks.forEach((task) => {
      if (task.category) {
        task.category.forEach((category) => {
          if (!uniqueCategories.some((c) => c.id === category.id)) {
            uniqueCategories.push(category)
          }
        })
      }
    })

    // Calculate category counts
    const counts: { [categoryId: UUID]: number } = {}
    uniqueCategories.forEach((category) => {
      const categoryTasks = tasks.filter((task) => task.category?.some((cat) => cat.id === category.id))
      counts[category.id] = categoryTasks.length
    })

    // Sort categories based on count
    uniqueCategories.sort((a, b) => {
      const countA = counts[a.id] || 0
      const countB = counts[b.id] || 0
      return countB - countA
    })

    setCategories(uniqueCategories)
    setCategoryCounts(counts)
  }, [user.tasks, reorderTasks])

  const checkOverdueTasks = useCallback(
    (tasks: Task[]) => {
      if (location.pathname === '/share') {
        return
      }

      const overdueTasks = tasks.filter((task) => {
        return task.deadline && new Date() > new Date(task.deadline) && !task.done
      })

      if (overdueTasks.length > 0) {
        const taskNames = overdueTasks.map((task) => task.name)

        showToast(
          <div translate='no' style={{ wordBreak: 'break-word' }}>
            <b translate='yes'>Overdue task{overdueTasks.length > 1 && 's'}: </b>
            {listFormat.format(taskNames)}
          </div>,
          {
            type: 'error',
            disableVibrate: true,
            duration: 3400,
            icon: <RingAlarm animate sx={{ color: ColorPalette.red }} />,
            style: {
              borderColor: ColorPalette.red,
              boxShadow: user.settings[0].enableGlow ? `0 0 18px -8px ${ColorPalette.red}` : 'none'
            }
          }
        )
      }
    },
    [listFormat, user.settings]
  )

  useEffect(() => {
    checkOverdueTasks(user.tasks)
  }, [checkOverdueTasks, user.tasks])
  return (
    <>
      <TaskMenu />
      <TasksContainer>
        {user.tasks.length > 0 && (
          <SearchInput
            focused
            color='primary'
            placeholder='Search for task...'
            autoComplete='off'
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Search sx={{ color: 'white' }} />
                </InputAdornment>
              ),
              endAdornment: search ? (
                <InputAdornment position='end'>
                  <SearchClear
                    color={reorderTasks(user.tasks).length === 0 && user.tasks.length > 0 ? 'error' : 'default'}
                    onClick={() => setSearch('')}
                  >
                    <Close
                      sx={{
                        color:
                          reorderTasks(user.tasks).length === 0 && user.tasks.length > 0
                            ? `${ColorPalette.red} !important`
                            : 'white',
                        transition: '.3s all'
                      }}
                    />
                  </SearchClear>
                </InputAdornment>
              ) : undefined
            }}
          />
        )}
        {categories !== undefined && categories?.length > 0 && user.settings[0].enableCategories && (
          <CategoriesListContainer>
            {categories?.map((cat) => (
              <CategoryBadge
                key={cat.id}
                category={cat}
                emojiSizes={[24, 20]}
                list={'true'}
                label={
                  <div>
                    <span style={{ fontWeight: 'bold' }}>{cat.name}</span>
                    <span
                      style={{
                        fontSize: '14px',
                        opacity: 0.9,
                        marginLeft: '4px'
                      }}
                    >
                      ({categoryCounts[cat.id]})
                    </span>
                  </div>
                }
                onClick={() => (selectedCatId !== cat.id ? setSelectedCatId(cat.id) : setSelectedCatId(undefined))}
                onDelete={selectedCatId === cat.id ? () => setSelectedCatId(undefined) : undefined}
                sx={{
                  boxShadow: 'none',
                  display: selectedCatId === undefined || selectedCatId === cat.id ? 'inline-flex' : 'none',
                  p: '20px 14px',
                  fontSize: '16px'
                }}
              />
            ))}
          </CategoriesListContainer>
        )}
        {multipleSelectedTasks.length > 0 && (
          <SelectedTasksContainer>
            <div>
              <h3>
                <RadioButtonChecked /> &nbsp; Selected {multipleSelectedTasks.length} task
                {multipleSelectedTasks.length > 1 ? 's' : ''}
              </h3>
              <span translate='no' style={{ fontSize: '14px', opacity: 0.8 }}>
                {listFormat.format(
                  multipleSelectedTasks
                    .map((taskId) => user.tasks.find((task) => task.id === taskId)?.name)
                    .filter((taskName) => taskName !== undefined) as string[]
                )}
              </span>
            </div>
            {/* TODO: add more features */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Tooltip title='Marcar seleccionados como completados'>
                <IconButton sx={{ color: getFontColor(theme.secondary) }} size='large' onClick={handleMarkSelectedAsDone}>
                  <DoneAll />
                </IconButton>
              </Tooltip>
              <Tooltip title='Eliminar seleccionado'>
                <IconButton color='error' size='large' onClick={handleDeleteSelected}>
                  <Delete />
                </IconButton>
              </Tooltip>
              <Tooltip sx={{ color: getFontColor(theme.secondary) }} title='Cancel'>
                <IconButton size='large' onClick={() => setMultipleSelectedTasks([])}>
                  <CancelRounded />
                </IconButton>
              </Tooltip>
            </div>
          </SelectedTasksContainer>
        )}
        {search && reorderTasks(user.tasks).length > 1 && user.tasks.length > 0 && (
          <div
            style={{
              textAlign: 'center',
              fontSize: '18px',
              opacity: 0.9,
              marginTop: '12px'
            }}
          >
            <b>
              Found {reorderTasks(user.tasks).length} tarea
              {reorderTasks(user.tasks).length > 1 ? 's' : ''}
            </b>
          </div>
        )}
        {user.tasks.length !== 0 ? (
          reorderTasks(user.tasks).map((task) => (
            <TaskContainer
              key={task.id}
              id={task.id.toString()}
              // open the task menu on right click
              onContextMenu={(e) => {
                e.preventDefault()
                handleClick(e, task.id)
              }}
              backgroundColor={task.color}
              glow={user.settings[0].enableGlow}
              done={task.done}
              blur={selectedTaskId !== task.id && open && !isMobile}
            >
              {multipleSelectedTasks.length > 0 && (
                <StyledRadio
                  clr={getFontColor(task.color)}
                  checked={multipleSelectedTasks.includes(task.id)}
                  icon={<RadioUnchecked />}
                  checkedIcon={<RadioChecked />}
                  onChange={() => {
                    if (multipleSelectedTasks.includes(task.id)) {
                      setMultipleSelectedTasks((prevTasks) => prevTasks.filter((id) => id !== task.id))
                    } else {
                      handleSelectTask(task.id)
                    }
                  }}
                />
              )}
              {task.emoji || task.done ? (
                <EmojiContainer
                  clr={getFontColor(task.color)}
                  // onDoubleClick={() => handleSelectTask(task.id)}
                >
                  {task.done ? (
                    <DoneRounded fontSize='large' />
                  ) : (
                    <Emoji
                      size={
                        user.emojisStyle === EmojiStyle.NATIVE
                          ? systemInfo.os === 'iOS' || systemInfo.os === 'macOS'
                            ? 50
                            : 38
                          : 46
                      }
                      unified={task.emoji || ''}
                      emojiStyle={user.emojisStyle}
                      lazyLoad
                    />
                  )}
                </EmojiContainer>
              ) : null}
              <TaskInfo translate='no'>
                {task.pinned && (
                  <Pinned translate='yes'>
                    <PushPinRounded fontSize='small' /> &nbsp; Pinned
                  </Pinned>
                )}
                <TaskHeader>
                  <TaskName done={task.done}>{highlightMatchingText(task.name)}</TaskName>
                  <Tooltip
                    title={new Intl.DateTimeFormat(navigator.language, {
                      dateStyle: 'full',
                      timeStyle: 'medium'
                    }).format(new Date(task.date))}
                  >
                    <TaskDate>{formatDate(new Date(task.date))}</TaskDate>
                  </Tooltip>
                </TaskHeader>

                <TaskDescription done={task.done}>
                  <RenderTaskDescription task={task} />
                </TaskDescription>

                {task.deadline && (
                  <Tooltip
                    title={new Intl.DateTimeFormat(navigator.language, {
                      dateStyle: 'full',
                      timeStyle: 'medium'
                    }).format(new Date(task.deadline))}
                    placement='bottom-start'
                  >
                    <TimeLeft done={task.done} translate='yes'>
                      <RingAlarm
                        fontSize='small'
                        animate={new Date() > new Date(task.deadline) && !task.done}
                        sx={{
                          color: `${getFontColor(task.color)} !important`
                        }}
                      />{' '}
                      &nbsp;
                      {new Date(task.deadline).toLocaleDateString()} {' • '}
                      {new Date(task.deadline).toLocaleTimeString()}
                      {!task.done && (
                        <>
                          {' • '}
                          {calculateDateDifference(new Date(task.deadline))}
                        </>
                      )}
                    </TimeLeft>
                  </Tooltip>
                )}
                {task.sharedBy && (
                  <div
                    translate='yes'
                    style={{
                      opacity: 0.8,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Link /> Compartido por <span translate={task.sharedBy === 'User' ? 'yes' : 'no'}>{task.sharedBy}</span>
                  </div>
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
                  {task.category &&
                    user.settings[0].enableCategories &&
                    task.category.map((category) => (
                      <div key={category.id}>
                        <CategoryBadge category={category} borderclr={getFontColor(task.color)} />
                      </div>
                    ))}
                </div>
              </TaskInfo>
              <IconButton
                aria-label='Task Menu'
                aria-controls={open ? 'task-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
                onClick={(event) => handleClick(event, task.id)}
                sx={{ color: getFontColor(task.color) }}
              >
                <MoreVert />
              </IconButton>
            </TaskContainer>
          ))
        ) : (
          <NoTasks>
            <b>No tiene ninguna tarea como hecha</b>
            <br />
            Haz clic en el botón <b>+</b> para añadir uno
          </NoTasks>
        )}
        {search && reorderTasks(user.tasks).length === 0 && user.tasks.length > 0 && (
          <div
            style={{
              textAlign: 'center',
              fontSize: '20px',
              opacity: 0.9,
              marginTop: '18px'
            }}
          >
            <b>No tasks found</b>
            <br />
            Inténtalo buscando con palabras clave diferentes.
            <div style={{ marginTop: '14px' }}>
              <TaskIcon scale={0.8} />
            </div>
          </div>
        )}
        <EditTask
          open={editModalOpen}
          task={user.tasks.find((task) => task.id === selectedTaskId)}
          onClose={() => setEditModalOpen(false)}
          onSave={(editedTask) => {
            const updatedTasks = user.tasks.map((task) => {
              if (task.id === editedTask.id) {
                return {
                  ...task,
                  name: editedTask.name,
                  color: editedTask.color,
                  emoji: editedTask.emoji || undefined,
                  description: editedTask.description || undefined,
                  deadline: editedTask.deadline || undefined,
                  category: editedTask.category || undefined,
                  lastSave: new Date()
                }
              }
              return task
            })
            setUser((prevUser) => ({
              ...prevUser,
              tasks: updatedTasks
            }))
            setEditModalOpen(false)
          }}
        />
      </TasksContainer>
      <Dialog open={deleteDialogOpen} onClose={cancelDeleteTask}>
        <DialogTitle>¿Estás seguro de que deseas eliminar la tarea?</DialogTitle>

        <DialogContent>
          {selectedTask !== undefined && (
            <>
              {selectedTask.emoji && (
                <p
                  style={{
                    display: 'flex',
                    justifyContent: 'left',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <b>Emoji:</b> <Emoji size={28} emojiStyle={user.emojisStyle} unified={selectedTask.emoji} />
                </p>
              )}
              <p>
                <b>Nombre de Tarea:</b> <span translate='no'>{selectedTask.name}</span>
              </p>
              {selectedTask.description && (
                <p>
                  <b>Descripcion de tarea:</b> <span translate='no'>{selectedTask.description.replace(URL_REGEX, '[link]')}</span>
                </p>
              )}
              {selectedTask.category?.[0]?.name && (
                <p>
                  <b>{selectedTask.category.length > 1 ? 'Categories' : 'Category'}:</b>{' '}
                  <span translate='no'>{listFormat.format(selectedTask.category.map((cat) => cat.name))}</span>
                </p>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <DialogBtn onClick={cancelDeleteTask} color='primary'>
            Cancelar
          </DialogBtn>
          <DialogBtn onClick={confirmDeleteTask} color='error'>
            <DeleteRounded /> &nbsp; Eliminar
          </DialogBtn>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteSelectedOpen}>
        <DialogTitle>Estas seguro que quieres eliminar las tareas?</DialogTitle>
        <DialogContent translate='no'>
          {listFormat.format(
            multipleSelectedTasks
              .map((taskId) => user.tasks.find((task) => task.id === taskId)?.name)
              .filter((taskName) => taskName !== undefined) as string[]
          )}
        </DialogContent>
        <DialogActions>
          <DialogBtn onClick={() => setDeleteSelectedOpen(false)} color='primary'>
            Cancelar
          </DialogBtn>
          <DialogBtn
            onClick={() => {
              setUser((prevUser) => ({
                ...prevUser,
                tasks: prevUser.tasks.filter((task) => !multipleSelectedTasks.includes(task.id))
              }))
              // Clear the selected task IDs after the operation
              setMultipleSelectedTasks([])
              setDeleteSelectedOpen(false)
            }}
            color='error'
          >
            Eliminar
          </DialogBtn>
        </DialogActions>
      </Dialog>
    </>
  )
}
