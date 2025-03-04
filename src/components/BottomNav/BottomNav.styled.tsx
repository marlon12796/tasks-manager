import { AddRounded } from '@mui/icons-material'
import { Box, BottomNavigation, BottomNavigationAction, css, styled } from '@mui/material'
import { pulseAnimation, slideInBottom } from '../../styles'
import { getFontColor } from '../../utils'
import type { BoxProps } from '@mui/system'
interface AddIconProps extends BoxProps {
  clr: string // Definición explícita de la propiedad 'clr'
  animate: string
}

export const AddIcon = styled(AddRounded)<AddIconProps>`
  border: 2px solid ${({ clr }) => clr};
  background-color: ${({ theme }) => theme.palette.secondary.main};
  font-size: 38px;
  border-radius: 100px;
  padding: 6px;
  margin: 14px;
  transition: background 0.3s;

  ${({ animate, theme }) =>
    animate &&
    css`
      animation: ${pulseAnimation(theme.palette.primary.main, 10)} 1.2s infinite;
    `};
`

export const Container = styled(Box)`
  position: fixed;
  bottom: 0;
  inset-inline:0;
  width: 100%;
  animation: ${slideInBottom} 0.5s ease;
  z-index: 999;
`

export const StyledBottomNavigation = styled(BottomNavigation)<{ glow: string }>`
  border-radius: 24px 24px 0 0;
  background: ${({ theme, glow }) => `${theme.palette.secondary.main}${glow === 'true' ? 'c8' : 'e6'}`};
  backdrop-filter: blur(20px);
  padding-block:1em;
  transition: 0.3s background, color;
`

export const NavigationButton = styled(BottomNavigationAction)`
  border-radius: 18px;
  margin: 4px;
  color: ${({ theme }) => getFontColor(theme.palette.secondary.main)};

  &:disabled {
    opacity: 0.6;
    & .MuiBottomNavigationAction-label {
      text-shadow: none;
    }
  }

  & .MuiBottomNavigationAction-label {
    font-size: 13px !important;
  }
`
