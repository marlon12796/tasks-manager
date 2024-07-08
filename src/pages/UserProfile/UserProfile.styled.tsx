import styled from '@emotion/styled'
import { CheckRounded } from '@mui/icons-material'
import { Button, Grid } from '@mui/material'

import { ColorPalette } from '../../theme/themeConfig'
import { getFontColor } from '../../utils'

export const ContainerUser = styled.div`
  max-width: 400px;
  padding: 64px 48px;
  border-radius: 48px;
  box-shadow: 0px 4px 50px rgba(0, 0, 0, 0.25);
  background: ${({ theme }) => (theme.darkmode ? '#383838' : '#f5f5f5')};
  color: ${({ theme }) => (theme.darkmode ? ColorPalette.fontLight : ColorPalette.fontDark)};
  transition: border 0.3s, box-shadow 0.3s;
  border: 4px solid ${({ theme }) => theme.primary};
  box-shadow: 0 0 72px -1px ${({ theme }) => `${theme.primary}bf`};
  display: flex;
  gap: 14px;
  flex-direction: column;
  align-items: center;
  flex-direction: column;
  position: relative;
  margin-inline:auto;
`

export const CheckIcon = styled(CheckRounded)`
  font-size: 18px;
  padding: 2px;
  color: white;
  background: #242427;
  border-radius: 100px;
`

export const ThemePickerContainer = styled(Grid)`
  background: ${({ theme }) => (theme.darkmode ? '#505050' : '#d9d9d9')};
  padding: 10px;
  border-radius: 32px;
  overflow-y: auto;
`

export const SaveBtn = styled(Button)`
  width: 300px;
  font-weight: 600;
  border: none;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => getFontColor(theme.primary)};
  font-size: 18px;
  padding: 14px;
  border-radius: 16px;
  cursor: pointer;
  text-transform: capitalize;
  transition: background 0.3s, color 0.3s;
  &:hover {
    background: ${({ theme }) => theme.primary};
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
    color: white;
  }
`

export const UserName = styled.span`
  font-size: 20px;
  font-weight: 500;
`

export const CreatedAtDate = styled.span`
  display: flex;
  align-items: center;
  font-style: italic;
  font-weight: 400;
  opacity: 0.8;
  margin-top: -5px;
  margin-bottom: 2px;
  // fix for browser translate
  & font {
    margin: 0 1px;
  }
`
