import styled from '@emotion/styled'
import { ArrowBackIosNewRounded } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { getFontColor } from '../../utils'
export const ContainerBar = styled.div`
  margin: 0;
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 99;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background: ${({ theme }) => `${theme.secondary}c1`};
  transition: background 0.3s, color 0.3s;
  margin-bottom: 48px;
`

export const ArrowIcon = styled(ArrowBackIosNewRounded)`
  color: ${({ theme }) => getFontColor(theme.secondary)};
`

export const Title = styled.h2`
  font-size: 28px;
  margin: 0 auto;
  text-align: center;
  padding: 4px 0 8px 0;
  text-shadow: 0 0 24px #00000068;
`
export const BackBtn = styled(IconButton)`
  position: absolute;
  color: ${({ theme }) => getFontColor(theme.secondary)};
  @media (max-width: 1024px) {
    margin-top: 4px;
  }
`
