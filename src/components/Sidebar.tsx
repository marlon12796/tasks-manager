import styled from '@emotion/styled'
import {
  AddRounded,
  CategoryRounded,
  DeleteForeverRounded,
  FiberManualRecord,
  GetAppRounded,
  InstallDesktopRounded,
  InstallMobileRounded,
  IosShareRounded,
  Logout,
  PhoneIphoneRounded,
  SettingsRounded,
  TaskAltRounded
} from '@mui/icons-material'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  SwipeableDrawer,
  Tooltip
} from '@mui/material'
import type React from 'react'
import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SettingsDialog } from '.'
import logo from '../assets/logo256.png'
import { defaultUser } from '../constants/defaultUser'
import { UserContext } from '../contexts/UserContext'
import { DialogBtn, UserAvatar, pulseAnimation, ring } from '../styles'
import { ColorPalette } from '../theme/themeConfig'
import { showToast, systemInfo } from '../utils'

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

  interface BeforeInstallPromptEvent extends Event {
    readonly platforms: readonly string[]
    readonly userChoice: Promise<{
      outcome: 'accepted' | 'dismissed'
      platform: string
    }>
    prompt(): Promise<void>
  }

  const [supportsPWA, setSupportsPWA] = useState<boolean>(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isAppInstalled, setIsAppInstalled] = useState<boolean>(false)

  useEffect(() => {
    const beforeInstallPromptHandler = (e: Event) => {
      e.preventDefault()
      setSupportsPWA(true)
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    const detectAppInstallation = () => {
      window.matchMedia('(display-mode: standalone)').addEventListener('change', (e) => {
        setIsAppInstalled(e.matches)
      })
    }

    window.addEventListener('beforeinstallprompt', beforeInstallPromptHandler)
    detectAppInstallation()

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallPromptHandler)
    }
  }, [])

  const installPWA = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          showToast('¡Aplicación instalada exitosamente!')
          if ('setAppBadge' in navigator) {
            setUser((prevUser) => ({
              ...prevUser,
              settings: [
                {
                  ...prevUser.settings[0],
                  appBadge: true
                }
              ]
            }))
          }
          handleClose()
        }
        if (choiceResult.outcome === 'dismissed') {
          showToast('Instalación cancelada.', { type: 'error' })
        }
      })
    }
  }

  return (
    <Container>
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

        {supportsPWA && !isAppInstalled && (
          <StyledMenuItem onClick={installPWA}>
            {systemInfo.os === 'Android' ? <InstallMobileRounded /> : <InstallDesktopRounded />}
            &nbsp; Instalar App
          </StyledMenuItem>
        )}

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
    </Container>
  )
}

const MenuLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const styles: React.CSSProperties = { borderRadius: '14px' }
  if (to.startsWith('/')) {
    return (
      // React Router Link component for internal navigation
      <Link to={to} style={styles}>
        {children}
      </Link>
    )
  }
  // Render an anchor tag for external navigation
  return (
    <a href={to} target='_blank' style={styles} rel='noreferrer'>
      {children}
    </a>
  )
}

const Container = styled.div`
  position: absolute;
  right: 16vw;
  top: 14px;
  z-index: 900;
  @media (max-width: 1024px) {
    right: 16px;
  }
`

const StyledSwipeableDrawer = styled(SwipeableDrawer)`
  & .MuiPaper-root {
    border-radius: 24px 0 0 0;
    min-width: 300px;
    box-shadow: none;
    padding: 4px 12px;
    color: ${({ theme }) => (theme.darkmode ? ColorPalette.fontLight : '#101727')};
    z-index: 999;

    @media (min-width: 1920px) {
      min-width: 310px;
    }

    @media (max-width: 1024px) {
      min-width: 270px;
    }

    @media (max-width: 600px) {
      min-width: 55vw;
    }
  }
`

const StyledMenuItem = styled(MenuItem)`
  /* margin: 0px 8px; */
  padding: 16px 12px;
  border-radius: 14px;
  box-shadow: none;
  font-weight: 500;
  gap: 6px;

  & svg,
  .bmc-icon {
    transition: 0.4s transform;
  }

  &:hover {
    & svg[data-testid="GitHubIcon"] {
      transform: rotateY(${2 * Math.PI}rad);
    }
    & svg[data-testid="BugReportRoundedIcon"] {
      transform: rotate(45deg) scale(0.9) translateY(-20%);
    }
    & .bmc-icon {
      animation: ${ring} 2.5s ease-in alternate;
    }
  }
`

const SettingsMenuItem = styled(StyledMenuItem)`
  background: ${({ theme }) => (theme.darkmode ? '#1f1f1f' : '#101727')};
  color: ${ColorPalette.fontLight} !important;
  margin-top: 8px !important;
  &:hover {
    background: ${({ theme }) => (theme.darkmode ? '#1f1f1fb2' : '#101727b2')};
    & svg[data-testid="SettingsRoundedIcon"] {
      transform: rotate(180deg);
    }
  }
`

const ProfileMenuItem = styled(StyledMenuItem)`
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${({ theme }) => (theme.darkmode ? '#1f1f1f' : '#d7d7d7')};
  &:hover {
    background: ${({ theme }) => (theme.darkmode ? '#1f1f1fb2' : '#d7d7d7b2')};
  }
`

const MenuLabel = styled.span<{ clr?: string }>`
  margin-left: auto;
  font-weight: 600;
  background: ${({ clr, theme }) => `${clr || theme.primary}35`};
  color: ${({ clr, theme }) => clr || theme.primary};
  padding: 2px 12px;
  border-radius: 32px;
  font-size: 14px;
`

const StyledDivider = styled(Divider)`
  margin: 8px 4px;
`

const PulseMenuLabel = styled(MenuLabel)`
  animation: ${({ theme }) => pulseAnimation(theme.primary, 6)} 1.2s infinite;
  padding: 6px;
  margin-right: 4px;
`

PulseMenuLabel.defaultProps = {
  children: (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <FiberManualRecord style={{ fontSize: '16px' }} />
    </div>
  )
}

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-top: 8px;
  margin-bottom: 16px;
  gap: 12px;
  cursor: pointer;
`

const Logo = styled.img`
  width: 52px;
  height: 52px;
  margin-left: 12px;
  border-radius: 14px;
`

const LogoText = styled.h2`
  & span {
    color: ${({ theme }) => theme.primary};
  }
`

const ProfileOptionsBottom = styled.div`
  margin-top: auto;
  margin-bottom: ${window.matchMedia('(display-mode: standalone)').matches && /Mobi/.test(navigator.userAgent) ? '38px' : '16px'};
  display: flex;
  flex-direction: column;
  gap: 8px;
`
