import styled from '@emotion/styled'
import {
  Cancel,
  Close,
  ContentCopy,
  ContentCopyRounded,
  DeleteRounded,
  Done,
  DownloadRounded,
  EditRounded,
  IosShare,
  LaunchRounded,
  LinkRounded,
  Pause,
  PlayArrow,
  PushPinRounded,
  QrCode2Rounded,
  RadioButtonChecked,
  RecordVoiceOver,
  RecordVoiceOverRounded
} from '@mui/icons-material'
import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material'
import { Emoji, EmojiStyle } from 'emoji-picker-react'
import { useContext, useMemo, useState } from 'react'
import Marquee from 'react-fast-marquee'
import toast from 'react-hot-toast'
import QRCode from 'react-qr-code'
import { useNavigate } from 'react-router-dom'
import { BottomSheet } from 'react-spring-bottom-sheet'
import 'react-spring-bottom-sheet/dist/style.css'
import { useTheme } from '@emotion/react'
import { TaskIcon } from '..'
import { TaskContext } from '../../contexts/TaskContext'
import { UserContext } from '../../contexts/UserContext'
import { useResponsiveDisplay } from '../../hooks/useResponsiveDisplay'
import { DialogBtn } from '../../styles'
import { ColorPalette } from '../../theme/themeConfig'
import type { Task, UUID } from '../../types/user'
import { calculateDateDifference, getFontColor, saveQRCode, showToast, systemInfo } from '../../utils'

export const TaskMenu = () => {
  const { user, setUser } = useContext(UserContext)
  const { tasks, name, settings, emojisStyle } = user
  const {
    selectedTaskId,
    anchorEl,
    anchorPosition,
    multipleSelectedTasks,
    handleSelectTask,
    setEditModalOpen,
    handleDeleteTask,
    handleCloseMoreMenu
  } = useContext(TaskContext)
  const [showShareDialog, setShowShareDialog] = useState<boolean>(false)
  const [shareTabVal, setShareTabVal] = useState<number>(0)

  const isMobile = useResponsiveDisplay()
  const n = useNavigate()
  const theme = useTheme()

  const selectedTask = useMemo(() => {
    return tasks.find((task) => task.id === selectedTaskId) || ({} as Task)
  }, [selectedTaskId, tasks])

  const redirectToTaskDetails = () => {
    const taskId = selectedTask?.id.toString().replace('.', '')
    n(`/task/${taskId}`)
  }

  const generateShareableLink = (taskId: UUID | null, userName: string): string => {
    const task = tasks.find((task) => task.id === taskId)
    // This removes id property from link as a new identifier is generated on the share page.
    interface TaskToShare extends Omit<Task, 'id'> {
      id: undefined
    }

    if (task) {
      const taskToShare: TaskToShare = {
        ...task,
        sharedBy: undefined,
        id: undefined,
        category: settings[0].enableCategories ? task.category : undefined
      }
      const encodedTask = encodeURIComponent(JSON.stringify(taskToShare))
      const encodedUserName = encodeURIComponent(userName)
      return `${window.location.href}share?task=${encodedTask}&userName=${encodedUserName}`
    }
    return ''
  }
  const handleCopyToClipboard = async (): Promise<void> => {
    const linkToCopy = generateShareableLink(selectedTaskId, name || 'Usuario')
    try {
      await navigator.clipboard.writeText(linkToCopy)
      showToast('Enlace copiado al portapapeles.')
    } catch (error) {
      console.error('Error al copiar el enlace al portapapeles:', error)
      showToast('Error al copiar el enlace al portapapeles', { type: 'error' })
    }
  }

  const handleShare = async (): Promise<void> => {
    const linkToShare = generateShareableLink(selectedTaskId, name || 'Usuario')
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Compartir tarea',
          text: `Echa un vistazo a esta tarea: ${selectedTask.name}`,
          url: linkToShare
        })
      } catch (error) {
        console.error('Error al compartir el enlace:', error)
      }
    }
  }

  const handleMarkAsDone = () => {
    // Toggles the "done" property of the selected task
    if (selectedTaskId) {
      handleCloseMoreMenu()
      const updatedTasks = tasks.map((task) => {
        if (task.id === selectedTaskId) {
          return { ...task, done: !task.done }
        }
        return task
      })
      setUser((prevUser) => ({
        ...prevUser,
        tasks: updatedTasks
      }))

      const allTasksDone = updatedTasks.every((task) => task.done)

      if (allTasksDone) {
        showToast(
          <div>
            <b>Todas las tareas hechas</b>
            <br />
            <span>¡Has marcado todas tus tareas pendientes! ¡Bien hecho!</span>
          </div>,
          {
            icon: (
              <div style={{ margin: '-6px 4px -6px -6px' }}>
                <TaskIcon variant='success' scale={0.18} />
              </div>
            )
          }
        )
      }
    }
  }

  const handlePin = () => {
    // Toggles the "pinned" property of the selected task
    if (selectedTaskId) {
      handleCloseMoreMenu()
      const updatedTasks = tasks.map((task) => {
        if (task.id === selectedTaskId) {
          return { ...task, pinned: !task.pinned }
        }
        return task
      })
      setUser((prevUser) => ({
        ...prevUser,
        tasks: updatedTasks
      }))
    }
  }

  const handleDuplicateTask = () => {
    handleCloseMoreMenu()
    if (selectedTaskId) {
      if (selectedTask) {
        // Create a duplicated task with a new ID and current date
        const duplicatedTask: Task = {
          ...selectedTask,
          id: crypto.randomUUID(),
          date: new Date(),
          lastSave: undefined
        }
        // Add the duplicated task to the existing tasks
        const updatedTasks = [...tasks, duplicatedTask]
        // Update the user object with the updated tasks
        setUser((prevUser) => ({
          ...prevUser,
          tasks: updatedTasks
        }))
      }
    }
  }

  //https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis
  const handleReadAloud = () => {
    const voices = window.speechSynthesis.getVoices()
    const voice = voices.find((voice) => voice.name === settings[0].voice)
    const voiceName = voices.find((voice) => voice.name === settings[0].voice)
    const voiceVolume = settings[0].voiceVolume
    const taskName = selectedTask?.name || ''
    const taskDescription = selectedTask?.description?.replace(/((?:https?):\/\/[^\s/$.?#].[^\s]*)/gi, '') || '' // remove links from description
    // Read task date in voice language
    const taskDate = new Intl.DateTimeFormat(voice ? voice.lang : navigator.language, {
      dateStyle: 'full',
      timeStyle: 'short'
    }).format(new Date(selectedTask?.date || ''))

    const taskDeadline = selectedTask?.deadline
      ? `. Fecha de Cierre : ${calculateDateDifference(
          new Date(selectedTask.deadline),
          voice ? voice.lang : navigator.language // Read task deadline in voice language
        )}`
      : ''

    const textToRead = `${taskName}. ${taskDescription}. Date: ${taskDate}${taskDeadline}`

    const utterThis: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(textToRead)

    if (voiceName) utterThis.voice = voiceName

    if (voiceVolume) utterThis.volume = voiceVolume

    handleCloseMoreMenu()

    const pauseSpeech = () => {
      window.speechSynthesis.pause()
    }

    const resumeSpeech = () => {
      window.speechSynthesis.resume()
    }

    const cancelSpeech = () => {
      window.speechSynthesis.cancel()
      toast.dismiss(SpeechToastId)
      handleCloseMoreMenu()
    }

    const SpeechToastId = toast(
      () => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [isPlaying, setIsPlaying] = useState<boolean>(true)
        return (
          <ReadAloudContainer>
            <ReadAloudHeader translate='yes'>
              <RecordVoiceOver /> Read aloud: <span translate='no'>{selectedTask?.name}</span>
            </ReadAloudHeader>
            <span translate='yes' style={{ marginTop: '8px', fontSize: '16px' }}>
              Voice: <span translate='no'>{utterThis.voice?.name || 'Default'}</span>
            </span>
            <div translate='no'>
              <Marquee delay={0.6} play={isPlaying}>
                <p style={{ margin: '6px 0' }}>{utterThis.text} &nbsp;</p>
              </Marquee>
            </div>
            <ReadAloudControls>
              {isPlaying ? (
                <IconButton
                  onClick={() => {
                    pauseSpeech()
                    setIsPlaying(!isPlaying)
                  }}
                >
                  <Pause fontSize='large' />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => {
                    resumeSpeech()
                    setIsPlaying(!isPlaying)
                  }}
                >
                  <PlayArrow fontSize='large' />
                </IconButton>
              )}
              <IconButton onClick={cancelSpeech}>
                <Cancel fontSize='large' />
              </IconButton>
            </ReadAloudControls>
          </ReadAloudContainer>
        )
      },
      {
        duration: 999999999,
        style: {
          border: `1px solid ${theme.darkmode ? '#1b1d4eb7' : '#ededf7b0'} `,
          WebkitBackdropFilter: `blur(${theme.darkmode ? '10' : '14'}px)`,
          backdropFilter: `blur(${theme.darkmode ? '10' : '14'}px)`
        }
      }
    )

    // Set up event listener for the end of speech
    utterThis.onend = () => {
      // Close the menu
      handleCloseMoreMenu()
      // Hide the toast when speech ends
      toast.dismiss(SpeechToastId)
    }
    if (voiceVolume > 0) {
      window.speechSynthesis.speak(utterThis)
    }
  }

  const menuItems: JSX.Element = (
    <div>
      <StyledMenuItem onClick={handleMarkAsDone}>
        {selectedTask.done ? <Close /> : <Done />}
        &nbsp; {selectedTask.done ? 'Marcar como no hecho' : 'Marcar como hecho'}
      </StyledMenuItem>
      <StyledMenuItem onClick={handlePin}>
        <PushPinRounded sx={{ textDecoration: 'line-through' }} />
        &nbsp; {selectedTask.pinned ? 'Unpin' : 'Pin'}
      </StyledMenuItem>

      {multipleSelectedTasks.length === 0 && (
        <StyledMenuItem onClick={() => handleSelectTask(selectedTaskId || crypto.randomUUID())}>
          <RadioButtonChecked /> &nbsp; Seleccionar
        </StyledMenuItem>
      )}

      <StyledMenuItem onClick={redirectToTaskDetails}>
        <LaunchRounded /> &nbsp; Detalles de tarea
      </StyledMenuItem>

      {settings[0].enableReadAloud && (
        <StyledMenuItem onClick={handleReadAloud} disabled={window.speechSynthesis.speaking || window.speechSynthesis.pending}>
          <RecordVoiceOverRounded /> &nbsp;Leer en voz alta
        </StyledMenuItem>
      )}

      <StyledMenuItem
        onClick={() => {
          setShowShareDialog(true)
          handleCloseMoreMenu()
        }}
      >
        <LinkRounded /> &nbsp; Compartir
      </StyledMenuItem>

      <Divider />
      <StyledMenuItem
        onClick={() => {
          setEditModalOpen(true)
          handleCloseMoreMenu()
        }}
      >
        <EditRounded /> &nbsp; Editar
      </StyledMenuItem>
      <StyledMenuItem onClick={handleDuplicateTask}>
        <ContentCopy /> &nbsp; Duplicado
      </StyledMenuItem>
      <Divider />
      <StyledMenuItem
        clr={ColorPalette.red}
        onClick={() => {
          handleDeleteTask()
          handleCloseMoreMenu()
        }}
      >
        <DeleteRounded /> &nbsp; Eliminar
      </StyledMenuItem>
    </div>
  )

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setShareTabVal(newValue)
  }
  return (
    <>
      {isMobile ? (
        <BottomSheet
          open={Boolean(anchorEl)}
          onDismiss={handleCloseMoreMenu}
          snapPoints={({ minHeight, maxHeight }) => [minHeight, maxHeight]}
          expandOnContentDrag
          header={
            <SheetHeader translate='no'>
              <Emoji emojiStyle={emojisStyle} size={32} unified={selectedTask.emoji || ''} />{' '}
              {emojisStyle === EmojiStyle.NATIVE && '\u00A0 '}
              {selectedTask.name}
            </SheetHeader>
          }
        >
          <SheetContent>{menuItems}</SheetContent>
        </BottomSheet>
      ) : (
        <Menu
          id='task-menu'
          anchorEl={anchorEl}
          anchorPosition={anchorPosition ? anchorPosition : undefined}
          anchorReference={anchorPosition ? 'anchorPosition' : undefined}
          open={Boolean(anchorEl)}
          onClose={handleCloseMoreMenu}
          sx={{
            '& .MuiPaper-root': {
              borderRadius: '18px',
              minWidth: '200px',
              boxShadow: 'none',
              padding: '6px 4px'
            }
          }}
          MenuListProps={{
            'aria-labelledby': 'more-button'
          }}
        >
          {menuItems}
        </Menu>
      )}
      <Dialog
        open={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        PaperProps={{
          style: {
            borderRadius: '28px',
            padding: '10px',
            width: '560px'
          }
        }}
      >
        <DialogTitle>Compartir Tarea</DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShareTaskChip
              translate='no'
              label={selectedTask.name}
              clr={selectedTask.color}
              avatar={
                selectedTask.emoji ? (
                  <Avatar sx={{ background: 'transparent', borderRadius: '0' }}>
                    <Emoji
                      unified={selectedTask.emoji || ''}
                      emojiStyle={emojisStyle}
                      size={
                        emojisStyle === EmojiStyle.NATIVE ? (systemInfo.os === 'iOS' || systemInfo.os === 'macOS' ? 24 : 18) : 24
                      }
                    />
                  </Avatar>
                ) : undefined
              }
            />
          </div>
          <Tabs value={shareTabVal} onChange={handleTabChange} sx={{ m: '8px 0' }}>
            <StyledTab label='Link' icon={<LinkRounded />} />
            <StyledTab label='QR Code' icon={<QrCode2Rounded />} />
          </Tabs>
          <CustomTabPanel value={shareTabVal} index={0}>
            <ShareField
              value={generateShareableLink(selectedTaskId, name || 'User')}
              fullWidth
              variant='outlined'
              label='Shareable Link'
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position='start'>
                    <LinkRounded sx={{ ml: '8px' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position='end'>
                    <Button
                      onClick={() => {
                        handleCopyToClipboard()
                      }}
                      sx={{ p: '12px', borderRadius: '14px', mr: '4px' }}
                    >
                      <ContentCopyRounded /> &nbsp; Copiar
                    </Button>
                  </InputAdornment>
                )
              }}
              sx={{
                mt: 3
              }}
            />
          </CustomTabPanel>
          <CustomTabPanel value={shareTabVal} index={1}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '22px'
              }}
            >
              <QRCode id='QRCodeShare' value={generateShareableLink(selectedTaskId, name || 'User')} size={400} />
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <DownloadQrCodeBtn variant='outlined' onClick={() => saveQRCode(selectedTask.name || '')}>
                <DownloadRounded /> &nbsp; Descargar codigo QR
              </DownloadQrCodeBtn>
            </Box>
          </CustomTabPanel>
          <Alert severity='info' sx={{ mt: '20px' }}>
            <AlertTitle>Comparte tu tarea</AlertTitle>
            Comparte tu tarea con otros usando el enlace o el código QR. Copia el enlace para compartirlo manualmente o usa el
            botón de compartir para enviarlo a través de otras aplicaciones. También puedes descargar el código QR para un acceso
            fácil.
          </Alert>

          {/* <Alert severity="warning" sx={{ mt: "8px" }}>
            Anyone with access to this link will be able to view your name and task details.
          </Alert> */}
        </DialogContent>
        <DialogActions>
          <DialogBtn onClick={() => setShowShareDialog(false)}>Cerrar</DialogBtn>
          <DialogBtn onClick={handleShare}>
            <IosShare sx={{ mb: '4px' }} /> &nbsp; Compartir
          </DialogBtn>
        </DialogActions>
      </Dialog>
    </>
  )
}
interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}
const CustomTabPanel = ({ children, value, index }: TabPanelProps) => {
  return (
    <div role='tabpanel' hidden={value !== index} id={`share-tabpanel-${index}`} aria-labelledby={`share-tab-${index}`}>
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}
const SheetHeader = styled.h3`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => (theme.darkmode ? ColorPalette.fontLight : ColorPalette.fontDark)};
  margin: 10px;
  font-size: 20px;
`

const SheetContent = styled.div`
  color: ${({ theme }) => (theme.darkmode ? ColorPalette.fontLight : ColorPalette.fontDark)};
  margin: 20px 10px;
  & .MuiMenuItem-root {
    font-size: 16px;
    padding: 16px;
    &::before {
      content: "";
      display: inline-block;
      margin-right: 10px;
    }
  }
`
const StyledMenuItem = styled(MenuItem)<{ clr?: string }>`
  margin: 0 6px;
  padding: 12px;
  border-radius: 12px;
  box-shadow: none;
  gap: 2px;
  color: ${({ clr }) => clr || 'unset'};
`

const ReadAloudContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const ReadAloudHeader = styled.div`
  display: inline-flex;
  align-items: center;
  font-weight: 600;
  gap: 6px;
`

const ReadAloudControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  gap: 8px;
`

const ShareField = styled(TextField)`
  margin-top: 22px;
  .MuiOutlinedInput-root {
    border-radius: 14px;
    padding: 2px;
    transition: 0.3s all;
  }
`

const ShareTaskChip = styled(Chip)<{ clr: string }>`
  background: ${({ clr }) => clr};
  color: ${({ clr }) => getFontColor(clr)};
  font-size: 14px;
  padding: 18px 8px;
  border-radius: 50px;
  font-weight: 500;
  margin-left: 6px;
  @media (max-width: 768px) {
    font-size: 16px;
    padding: 20px 10px;
  }
`

const DownloadQrCodeBtn = styled(Button)`
  padding: 12px 24px;
  border-radius: 14px;
  margin-top: 16px;
  @media (max-width: 520px) {
    margin-top: -2px;
  }
`

const StyledTab = styled(Tab)`
  border-radius: 12px 12px 0 0;
  width: 50%;
  .MuiTabs-indicator {
    border-radius: 24px;
  }
`
StyledTab.defaultProps = {
  iconPosition: 'start'
}
