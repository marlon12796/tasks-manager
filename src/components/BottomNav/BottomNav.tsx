import { CategoryRounded, GetAppRounded, PersonRounded, TaskAlt } from '@mui/icons-material'
import { Badge, useTheme } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { UserContext } from '../../contexts/UserContext'
import { useResponsiveDisplay } from '../../hooks/useResponsiveDisplay'
import { AddIcon, Container, NavigationButton, StyledBottomNavigation } from './BottomNav.styled'

export const BottomNav = (): JSX.Element | null => {
  const { user } = useContext(UserContext)
  const { tasks, settings } = user
  const [value, setValue] = useState<number | undefined>()

  const theme = useTheme()
  const n = useNavigate()
  const isMobile = useResponsiveDisplay()
  const location = useLocation()

  const smallIconSize = '29px'

  // useEffect hook to set the active button based on the current route
  useEffect(() => {
    const pathParts = location.pathname.split('/') // Split the pathname by '/'
    if (pathParts[1] === 'task') {
      setValue(0) // If the user is on a task page, set the value to 0
    } else {
      // Handle other routes as before
      switch (location.pathname) {
        case '/categories':
          setValue(1)
          break
        case '/add':
          setValue(2)
          break
        case '/transfer':
          setValue(3)
          break
        case '/user':
          setValue(4)
          break
        case '/':
          setValue(0)
          break
        default:
          setValue(undefined) // Fallback for the undefined route
      }
    }
  }, [location.pathname])

  // If it's a mobile device, don't render the navigation bar.
  if (!isMobile) {
    return null
  }

  return (
    <Container>
      <StyledBottomNavigation
        showLabels
        glow={settings[0].enableGlow}
        value={value}
        onChange={(_event, newValue: number) => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
          setValue(newValue)
        }}
      >
        <NavigationButton
          onClick={() => n('/')}
          label='Tasks'
          icon={
            <Badge color='primary' badgeContent={value !== 0 ? tasks.filter((task) => !task.done).length : undefined} max={99}>
              <TaskAlt sx={{ fontSize: smallIconSize }} />
            </Badge>
          }
        />
        <NavigationButton
          onClick={() => n('/categories')}
          label='Categories'
          icon={<CategoryRounded sx={{ fontSize: smallIconSize }} />}
          disabled={!settings[0].enableCategories}
        />
        <NavigationButton
          onClick={() => n('add')}
          showLabel={false}
          aria-label='Add'
          icon={<AddIcon clr={theme.palette.primary.main} fontSize='large' animate={tasks.length === 0 && value !== 2} />}
        />
        <NavigationButton
          onClick={() => n('transfer')}
          label='Transfer'
          icon={<GetAppRounded sx={{ fontSize: smallIconSize }} />}
        />
        <NavigationButton onClick={() => n('user')} label='Profile' icon={<PersonRounded sx={{ fontSize: smallIconSize }} />} />
      </StyledBottomNavigation>
    </Container>
  )
}
