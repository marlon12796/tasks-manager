import { Chip, styled } from '@mui/material'

import { fadeIn } from '../../styles'
import { getFontColor } from '../../utils'

export interface StyledBadgeProps {
  backgroundclr?: string
  borderclr?: string
  glow?: boolean
  list?: boolean | string
}

export const StyledCategoryBadge = styled(Chip)<StyledBadgeProps>`
  color: ${({ backgroundclr }) => getFontColor(backgroundclr || '')};
  background-color: ${({ backgroundclr }) => backgroundclr};
  box-shadow: ${({ glow, backgroundclr }) => (glow ? `0 0 8px 0 ${backgroundclr}` : 'none')};
  border: ${({ borderclr }) => (borderclr ? `2px solid ${borderclr}` : 'none')};
  font-weight: bold;
  font-size: 14px;
  margin: 6px 0 0 0;
  padding: 8px;
  transition: 0.3s all;
  /* opacity: ${({ list }) => (list ? 1 : 0.9)}; */
  animation: ${fadeIn} 0.5s ease-in;

  &:hover {
    background-color: ${(props) => `${props.backgroundclr}!important`};
    /* box-shadow: ${({ list, backgroundclr }) => list && `0 0 8px 0px ${backgroundclr}`}; */
    opacity: ${({ list }) => list && 0.8};
  }

  &:focus-visible {
    opacity: 0.8;
    background-color: ${({ backgroundclr }) => backgroundclr};
  }
  &:focus {
    opacity: none;
  }

  & .MuiChip-deleteIcon {
    color: ${({ backgroundclr }) => getFontColor(backgroundclr || '')};
    transition: 0.3s all;
    width: 22px;
    height: 22px;
    stroke: transparent;
    @media (max-width: 1024px) {
      width: 26px;
      height: 26px;
    }
    &:hover {
      color: ${({ backgroundclr }) => getFontColor(backgroundclr || '')};
      opacity: 0.8;
    }
  }
`
