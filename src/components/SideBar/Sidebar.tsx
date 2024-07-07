import {
  AddRounded,
  CategoryRounded,
  DeleteForeverRounded,
  GetAppRounded,
  IosShareRounded,
  Logout,
  PhoneIphoneRounded,
  SettingsRounded,
  TaskAltRounded
} from '@mui/icons-material'
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip } from '@mui/material'
import type React from 'react'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import logo from '../../assets/logo256.png'
import { defaultUser } from '../../constants/defaultUser'
import { UserContext } from '../../contexts/UserContext'
import { DialogBtn, UserAvatar } from '../../styles'
import {
  ContainerSidebar,
  LogoContainer,
  Logo,
  LogoText,
  MenuLabel,
  ProfileMenuItem,
  ProfileOptionsBottom,
  PulseMenuLabel,
  SettingsMenuItem,
  StyledDivider,
  StyledMenuItem,
  StyledSwipeableDrawer
} from './Sidebar.styled'
import { showToast, systemInfo } from '../../utils'
import { SettingsDialog } from '../Settings'
import { MenuLink } from './MenuLink'

export const ProfileSidebar = () => {
  const { user, setUser } = useContext(UserContext)
  const { name, profilePicture, tasks, settings } = user
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const [logoutConfirmationOpen, setLogoutConfirmationOpen] = useState<boolean>(false)
  const [openSettings, setOpenSettings] = useState<boolean>(false)
  const n = useNavigate()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogoutConfirmationOpen = () => {
    setLogoutConfirmationOpen(true)
    setAnchorEl(null)
  }

  const handleLogoutConfirmationClose = () => {
    setLogoutConfirmationOpen(false)
  }

  const handleLogout = () => {
    setUser(defaultUser)
    handleLogoutConfirmationClose()
    showToast('Has cerrado sesión exitosamente')
  }

  return (
    <ContainerSidebar>
      <Tooltip title={<div translate={name ? 'no' : 'yes'}>{name || 'Usuario'}</div>}>
        <IconButton
          aria-label='Barra lateral'
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          sx={{ zIndex: 1 }}
        >
          <UserAvatar
            src={(profilePicture as string) || undefined}
            alt={name || 'Usuario'}
            hasImage={profilePicture !== null}
            size='52px'
            onError={() => {
              // Esto evita que se llame al manejo de errores innecesariamente cuando se está offline
              if (!navigator.onLine) return
              setUser((prevUser) => ({
                ...prevUser,
                profilePicture: null
              }))
              showToast('Error en la URL de la imagen de perfil', { type: 'error' })
              throw new Error('Error en la URL de la imagen de perfil')
            }}
          >
            {name ? name[0].toUpperCase() : undefined}
          </UserAvatar>
        </IconButton>
      </Tooltip>
      <StyledSwipeableDrawer
        disableBackdropTransition={systemInfo.os !== 'iOS'}
        disableDiscovery={systemInfo.os === 'iOS'}
        id='basic-menu'
        anchor='right'
        open={open}
        onOpen={(e) => e.preventDefault()}
        onClose={handleClose}
      >
        <LogoContainer
          translate='no'
          onClick={() => {
            n('/')
            handleClose()
          }}
        >
          <Logo src={logo} alt='logo' />
          <LogoText>
            <span>App de Tareas</span>
            <span>.</span>
          </LogoText>
        </LogoContainer>

        <MenuLink to='/'>
          <StyledMenuItem onClick={handleClose}>
            <TaskAltRounded /> &nbsp; Tareas
            {tasks.filter((task) => !task.done).length > 0 && (
              <Tooltip title={`${tasks.filter((task) => !task.done).length} tareas pendientes`}>
                <MenuLabel>
                  {tasks.filter((task) => !task.done).length > 99 ? '99+' : tasks.filter((task) => !task.done).length}
                </MenuLabel>
              </Tooltip>
            )}
          </StyledMenuItem>
        </MenuLink>

        <MenuLink to='/add'>
          <StyledMenuItem onClick={handleClose}>
            <AddRounded /> &nbsp; Agregar Tarea
          </StyledMenuItem>
        </MenuLink>

        <MenuLink to='/purge'>
          <StyledMenuItem onClick={handleClose}>
            <DeleteForeverRounded /> &nbsp; Eliminar Tareas
          </StyledMenuItem>
        </MenuLink>

        {settings[0].enableCategories !== undefined && settings[0].enableCategories && (
          <MenuLink to='/categories'>
            <StyledMenuItem onClick={handleClose}>
              <CategoryRounded /> &nbsp; Categorías
            </StyledMenuItem>
          </MenuLink>
        )}

        <MenuLink to='/transfer'>
          <StyledMenuItem onClick={handleClose}>
            <GetAppRounded /> &nbsp; Transferir
          </StyledMenuItem>
        </MenuLink>

        <StyledDivider />

        {systemInfo.browser === 'Safari' &&
          systemInfo.os === 'iOS' &&
          !window.matchMedia('(display-mode: standalone)').matches && (
            <StyledMenuItem
              onClick={() => {
                showToast(
                  <div style={{ display: 'inline-block' }}>
                    Para instalar la app en Safari de iOS, haz clic en{' '}
                    <IosShareRounded sx={{ verticalAlign: 'middle', mb: '4px' }} /> y luego en{' '}
                    <span style={{ fontWeight: 'bold' }}>Añadir a la pantalla de inicio</span>.
                  </div>,
                  { type: 'blank', duration: 8000 }
                )
                handleClose()
              }}
            >
              <PhoneIphoneRounded />
              &nbsp; Instalar App
            </StyledMenuItem>
          )}

        <StyledMenuItem onClick={handleLogoutConfirmationOpen} sx={{ color: '#ff4040 !important' }}>
          <Logout /> &nbsp; Cerrar sesión
        </StyledMenuItem>

        <ProfileOptionsBottom>
          <SettingsMenuItem
            onClick={() => {
              setOpenSettings(true)
              handleClose()
            }}
          >
            <SettingsRounded /> &nbsp; Configuración
            {settings[0] === defaultUser.settings[0] && <PulseMenuLabel />}
          </SettingsMenuItem>

          <StyledDivider />
          <MenuLink to='/user'>
            <ProfileMenuItem translate={name ? 'no' : 'yes'} onClick={handleClose}>
              <UserAvatar src={(profilePicture as string) || undefined} hasImage={profilePicture !== null} size='44px'>
                {name ? name[0].toUpperCase() : undefined}
              </UserAvatar>
              <h4 style={{ margin: 0, fontWeight: 600 }}> {name || 'Usuario'}</h4>{' '}
              {(name === null || name === '') && profilePicture === null && user.theme !== defaultUser.theme && (
                <PulseMenuLabel />
              )}
            </ProfileMenuItem>
          </MenuLink>
        </ProfileOptionsBottom>
      </StyledSwipeableDrawer>

      <Dialog open={logoutConfirmationOpen} onClose={handleLogoutConfirmationClose}>
        <DialogTitle>Confirmación de Cierre de Sesión</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que quieres cerrar sesión? <b>Tus tareas no se guardarán.</b>
        </DialogContent>
        <DialogActions>
          <DialogBtn onClick={handleLogoutConfirmationClose}>Cancelar</DialogBtn>
          <DialogBtn onClick={handleLogout} color='error'>
            <Logout /> &nbsp; Cerrar sesión
          </DialogBtn>
        </DialogActions>
      </Dialog>
      <SettingsDialog open={openSettings} onClose={() => setOpenSettings(!openSettings)} />
    </ContainerSidebar>
  )
}
