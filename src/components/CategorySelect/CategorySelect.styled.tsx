import styled from '@emotion/styled'
import { getFontColor } from '../../utils'
import { MenuItem, Select } from '@mui/material'
import { CSSProperties } from 'react'
import { ColorPalette } from '../../theme/themeConfig'

export const StyledSelect = styled(Select)<{ width?: CSSProperties['width'] }>`
  margin: 12px 0;
  border-radius: 16px !important;
  transition: 0.3s all;
  width: ${({ width }) => width || '100%'};
  color: white;
  background: #ffffff18;
  z-index: 999;
`

export const CategoriesMenu = styled(MenuItem)<{ clr: string; disable?: boolean }>`
  padding: 12px 16px;
  border-radius: 16px;
  margin: 8px;
  display: flex;
  gap: 4px;
  font-weight: 600;
  transition: 0.2s all;
  color: ${(props) => getFontColor(props.clr || ColorPalette.fontLight)};
  background: ${({ clr }) => clr};
  opacity: ${({ disable }) => (disable ? '.6' : 'none')};
  &:hover {
    background: ${({ clr }) => clr};
    opacity: ${({ disable }) => (disable ? 'none' : '.8')};
  }

  &:focus {
    opacity: none;
  }

  &:focus-visible {
    border-color: ${({ theme }) => theme.primary} !important;
  }

  &.Mui-selected {
    background: ${({ clr }) => clr};
    color: ${(props) => getFontColor(props.clr || ColorPalette.fontLight)};
    display: flex;
    justify-content: left;
    align-items: center;
    font-weight: 800;
    &:hover {
      background: ${({ clr }) => clr};
      opacity: 0.7;
    }
  }
`

export const HeaderMenuItem = styled(MenuItem)`
  opacity: 1 !important;
  font-weight: 500;
  position: sticky !important;
  top: 0;
  backdrop-filter: blur(6px);
  z-index: 99;
  pointer-events: none;
  background: ${({ theme }) => (theme.darkmode ? '#2f2f2fc3' : '#ffffffc3')};
`

export const SelectedNames = styled.span`
  opacity: 0.9;
  font-size: 15px;
  word-break: break-all;
  max-width: 300px;
`

export const NoCategories = styled(MenuItem)`
  opacity: 1 !important;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 12px 0;
  gap: 6px;
  cursor: default !important;
  & p {
    margin: 20px 0 32px 0;
  }
  &:hover {
    background: transparent !important;
  }
`
