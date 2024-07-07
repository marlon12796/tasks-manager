import { PersonalVideoRounded } from '@mui/icons-material'
import { Badge, Grid, Tooltip } from '@mui/material'

import { ColorElement } from '../../styles'
import { Themes } from '../../theme/theme'
import { CheckIcon, ThemePickerContainer } from './UserProfile.styled'
import { useSystemTheme } from '../../hooks/useSystemTheme'
import { useContext } from 'react'
import { UserContext } from '../../contexts/UserContext'
export const ThemePicker = () => {
  const { user, setUser } = useContext(UserContext)
  const systemTheme = useSystemTheme()
  return (
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
  )
}
