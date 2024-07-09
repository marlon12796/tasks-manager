import styled from '@emotion/styled'
import { ArrowBackIosNewRounded } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { getFontColor } from '../../utils'
export const TopBarContainer = styled.div`
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 99;
  display:grid;
  align-items:center;
  padding-block:0.5em;  
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background: ${({ theme }) => `${theme.secondary}c1`};
  transition: background 0.3s, color 0.3s;
  margin: 0;
`

export const TopBarArrowIcon = styled(ArrowBackIosNewRounded)`
padding:0.2em;
  color: ${({ theme }) => getFontColor(theme.secondary)};
`

export const TopBarTitle = styled.h2`
  font-size: 28px;
  margin: 0 auto;
  text-align: center;
  padding: 4px 0 8px 0;
  text-shadow: 0 0 24px #00000068;
`
export const TopBarBackBtn = styled(IconButton)`
  position: absolute;
  color: ${({ theme }) => getFontColor(theme.secondary)};
  padding:0;
  margin:0;
`
