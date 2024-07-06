import styled from '@emotion/styled'
import { FiberManualRecord } from '@mui/icons-material'
import { Divider, MenuItem, SwipeableDrawer } from '@mui/material'
import { pulseAnimation, ring } from '../../styles'
import { ColorPalette } from '../../theme/themeConfig'
export const ContainerSidebar = styled.div`
  position: absolute;
  right: 16vw;
  top: 14px;
  z-index: 900;
  @media (max-width: 1024px) {
    right: 16px;
  }
`

export const StyledSwipeableDrawer = styled(SwipeableDrawer)`
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

export const StyledMenuItem = styled(MenuItem)`
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

export const SettingsMenuItem = styled(StyledMenuItem)`
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

export const ProfileMenuItem = styled(StyledMenuItem)`
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${({ theme }) => (theme.darkmode ? '#1f1f1f' : '#d7d7d7')};
  &:hover {
    background: ${({ theme }) => (theme.darkmode ? '#1f1f1fb2' : '#d7d7d7b2')};
  }
`

export const MenuLabel = styled.span<{ clr?: string }>`
  margin-left: auto;
  font-weight: 600;
  background: ${({ clr, theme }) => `${clr || theme.primary}35`};
  color: ${({ clr, theme }) => clr || theme.primary};
  padding: 2px 12px;
  border-radius: 32px;
  font-size: 14px;
`

export const StyledDivider = styled(Divider)`
  margin: 8px 4px;
`

export const PulseMenuLabel = styled(MenuLabel)`
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

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-top: 8px;
  margin-bottom: 16px;
  gap: 12px;
  cursor: pointer;
`

export const Logo = styled.img`
  width: 52px;
  height: 52px;
  margin-left: 12px;
  border-radius: 14px;
`

export const LogoText = styled.h2`
  & span {
    color: ${({ theme }) => theme.primary};
  }
`

export const ProfileOptionsBottom = styled.div`
  margin-top: auto;
  margin-bottom: ${window.matchMedia('(display-mode: standalone)').matches && /Mobi/.test(navigator.userAgent) ? '38px' : '16px'};
  display: flex;
  flex-direction: column;
  gap: 8px;
`
