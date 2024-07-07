import { AddAPhotoRounded, Logout, PersonalVideoRounded, Settings, TodayRounded } from '@mui/icons-material'
import {
  Avatar,
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Tooltip
} from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { SettingsDialog, TopBar } from '../components'
import { PROFILE_PICTURE_MAX_LENGTH, USER_NAME_MAX_LENGTH } from '../constants'
import { defaultUser } from '../constants/defaultUser'
import { UserContext } from '../contexts/UserContext'
import { useSystemTheme } from '../hooks/useSystemTheme'
import { ColorElement, DialogBtn, UserAvatar } from '../styles'
import { Themes } from '../theme/theme'
import { showToast, timeAgo } from '../utils'
import {
  ContainerUser,
  CheckIcon,
  CreatedAtDate,
  SaveBtn,
  ThemePickerContainer,
  UserName
} from './UserProfile/UserProfile.styled'
import { ChangeUserPhoto } from './UserProfile/ChangeUserPhoto'

const UserProfile = () => {
  const { user, setUser } = useContext(UserContext)
  const { name, profilePicture, createdAt } = user
  const [userName, setUserName] = useState<string>('')
  const [profilePictureURL, setProfilePictureURL] = useState<string>('')
  const [openChangeImage, setOpenChangeImage] = useState<boolean>(false)
  const [logoutConfirmationOpen, setLogoutConfirmationOpen] = useState<boolean>(false)
  const [openSettings, setOpenSettings] = useState<boolean>(false)

  const systemTheme = useSystemTheme()

  useEffect(() => {
    document.title = `Todo App - User ${name ? `(${name})` : ''}`
  }, [name])

  const handleSaveName = () => {
    if (userName.length <= USER_NAME_MAX_LENGTH && userName !== name) {
      setUser({ ...user, name: userName })

      showToast(
        <div>
          Changed user name
          {userName && (
            <>
              {' '}
              to <b translate='no'>{userName}</b>
            </>
          )}
          .
        </div>
      )

      setUserName('')
    }
  }

  const handleOpenImageDialog = () => {
    setOpenChangeImage(true)
  }
  const handleCloseImageDialog = () => {
    setOpenChangeImage(false)
  }

  const handleLogoutConfirmationClose = () => {
    setLogoutConfirmationOpen(false)
  }
  const handleLogout = () => {
    setUser(defaultUser)
    handleLogoutConfirmationClose()
    showToast('You have been successfully logged out')
  }

  const handleSaveImage = () => {
    if (profilePictureURL.length <= PROFILE_PICTURE_MAX_LENGTH && profilePictureURL.startsWith('https://')) {
      handleCloseImageDialog()
      setUser((prevUser) => ({
        ...prevUser,
        profilePicture: profilePictureURL
      }))
      showToast('Changed profile picture.')
    }
  }
  const handleChangeProfilePictureUrl = (value: string) => {
    setProfilePictureURL(value)
  }

  return (
    <>
      <TopBar title='Perfil de Usuario' />
      <ContainerUser>
        <Tooltip title='Configuración de la Aplicación'>
          <IconButton
            onClick={() => setOpenSettings(true)}
            aria-label='Configuración'
            size='large'
            sx={{
              position: 'absolute',
              top: '24px',
              right: '24px'
            }}
          >
            <Settings fontSize='large' />
          </IconButton>
        </Tooltip>
        <Tooltip title={profilePicture ? 'Cambiar foto de perfil' : 'Agregar foto de perfil'}>
          <Badge
            overlap='circular'
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Avatar
                onClick={handleOpenImageDialog}
                sx={{
                  background: '#9c9c9c81',
                  backdropFilter: 'blur(10px)',
                  cursor: 'pointer'
                }}
              >
                <AddAPhotoRounded />
              </Avatar>
            }
          >
            <UserAvatar
              onClick={handleOpenImageDialog}
              src={profilePicture || undefined}
              hasImage={profilePicture !== null}
              size='96px'
            >
              {name ? name[0].toUpperCase() : undefined}
            </UserAvatar>
          </Badge>
        </Tooltip>
        <UserName translate={name ? 'no' : 'yes'}>{name || 'Usuario'}</UserName>
        <Tooltip
          title={new Intl.DateTimeFormat(navigator.language, {
            dateStyle: 'full',
            timeStyle: 'medium'
          }).format(new Date(createdAt))}
        >
          <CreatedAtDate>
            <TodayRounded fontSize='small' />
            &nbsp;Registrado {timeAgo(createdAt)}
          </CreatedAtDate>
        </Tooltip>

        <ThemePickerContainer
          container
          maxWidth='300px'
          marginBottom='6px'
          marginTop='1px'
          display='flex'
          justifyContent='left'
          alignItems='center'
          gap={1}
        >
          <Grid item>
            <Tooltip title={`Sistema (${systemTheme})`}>
              <ColorElement
                clr={systemTheme === 'dark' || systemTheme === 'unknown' ? '#3d3e59' : '#ffffff'}
                style={{ transition: '.3s background' }}
                size='40px'
                onClick={() => {
                  setUser((prevUser) => ({
                    ...prevUser,
                    theme: 'system'
                  }))
                }}
              >
                <Badge badgeContent={user.theme === 'system' ? <CheckIcon /> : undefined}>
                  <PersonalVideoRounded sx={{ color: systemTheme === 'dark' ? 'white' : 'black' }} />
                </Badge>
              </ColorElement>
            </Tooltip>
          </Grid>
          {Themes.map((theme) => (
            <Grid key={theme.name}>
              <Tooltip title={theme.name[0].toUpperCase() + theme.name.replace(theme.name[0], '')}>
                <ColorElement
                  clr={theme.MuiTheme.palette.primary.main}
                  secondClr={theme.MuiTheme.palette.secondary.main}
                  aria-label={`Cambiar tema - ${theme.name}`}
                  size='40px'
                  style={{
                    border: user.theme === theme.name ? `3px solid ${theme.MuiTheme.palette.primary.main}` : 'none'
                  }}
                  onClick={() => {
                    setUser((prevUser) => ({
                      ...prevUser,
                      theme: theme.name
                    }))
                  }}
                >
                  <Badge badgeContent={user.theme === theme.name ? <CheckIcon /> : undefined}>
                    <div style={{ width: '24px', height: '24px' }} />
                  </Badge>
                </ColorElement>
              </Tooltip>
            </Grid>
          ))}
        </ThemePickerContainer>
        <TextField
          sx={{ width: '300px' }}
          label={name === null ? 'Agregar Nombre' : 'Cambiar Nombre'}
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
          error={userName.length > USER_NAME_MAX_LENGTH || (userName === name && name !== '')}
          helperText={
            userName.length > USER_NAME_MAX_LENGTH
              ? `El nombre excede ${USER_NAME_MAX_LENGTH} caracteres`
              : userName.length > 0 && userName !== name
                ? `${userName.length}/${USER_NAME_MAX_LENGTH}`
                : userName === name && name !== ''
                  ? 'El nuevo nombre es igual al anterior.'
                  : ''
          }
          autoComplete='nickname'
        />

        <SaveBtn onClick={handleSaveName} disabled={userName.length > USER_NAME_MAX_LENGTH || userName === name}>
          Guardar nombre
        </SaveBtn>
        <Button
          color='error'
          variant='outlined'
          sx={{ p: '12px 20px', borderRadius: '14px', marginTop: '8px' }}
          onClick={() => setLogoutConfirmationOpen(true)}
        >
          <Logout />
          &nbsp; Cerrar sesión
        </Button>
      </ContainerUser>
      <ChangeUserPhoto
        open={openChangeImage}
        oneSaveImage={handleSaveImage}
        profilePictureURL={profilePictureURL}
        openChangeImage={openChangeImage}
        onCloseImageDialog={handleCloseImageDialog}
        onChangeProfilePictureURL={handleChangeProfilePictureUrl}
      />
      <Dialog open={logoutConfirmationOpen} onClose={handleLogoutConfirmationClose}>
        <DialogTitle>Confirmación de Cierre de Sesión</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que quieres cerrar sesión? <b>Tus tareas no se guardarán.</b>
        </DialogContent>
        <DialogActions>
          <DialogBtn onClick={handleLogoutConfirmationClose}>Cancelar</DialogBtn>
          <DialogBtn onClick={handleLogout} color='error'>
            <Logout /> &nbsp; Cerrar Sesión
          </DialogBtn>
        </DialogActions>
      </Dialog>
      <SettingsDialog open={openSettings} onClose={() => setOpenSettings(false)} />
    </>
  )
}

export default UserProfile
