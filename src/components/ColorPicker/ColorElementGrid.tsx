import { getColorName } from 'ntc-ts'
import { useRef } from 'react'
import { Popover, Grid, Tooltip } from '@mui/material'
import { useTheme } from '@emotion/react'

import { ColorElement } from '../../styles'
import { DeleteColorBtn, SelectedIcon } from './ColorPicker.styled'
interface ColorElementGridItemProps {
  color: string
  index: number
  selectedColor: string
  onColorChange: (color: string) => void
  handleDeleteColor: (clr: string) => void
  popoverOpen: boolean[]
  onTogglePopover: (index: number) => void
}

export const ColorElementGridItem: React.FC<ColorElementGridItemProps> = ({
  color,
  index,
  selectedColor,
  onColorChange,
  handleDeleteColor,
  popoverOpen,
  onTogglePopover
}) => {
  const theme = useTheme()
  const colorElementRef = useRef<HTMLElement | null>(null)
  const handleColorChange = () => {
    onColorChange(color)
    if (!window.matchMedia('(pointer:fine)').matches) {
      if (selectedColor === color && color !== theme.primary) onTogglePopover(index)
    }
  }
  const handleContextMenu = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (window.matchMedia('(pointer:fine)').matches && color !== theme.primary) {
      e.preventDefault()
      onTogglePopover(index)
    }
  }
  return (
    <Grid item key={color}>
      <Tooltip title={getColorName(color).name}>
        <ColorElement
          ref={(element) => (colorElementRef.current = element)}
          id={`color-element-${index}`}
          clr={color}
          aria-label={`Select color - ${color}`}
          onContextMenu={handleContextMenu}
          onClick={handleColorChange}
        >
          {color.toUpperCase() === selectedColor.toUpperCase() && <SelectedIcon />}
        </ColorElement>
      </Tooltip>
      <Popover
        open={popoverOpen[index] === true}
        onClose={() => onTogglePopover(index)}
        anchorEl={colorElementRef.current}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        slotProps={{
          paper: {
            sx: {
              background: 'transparent',
              boxShadow: 'none'
            }
          }
        }}
      >
        <div>
          <DeleteColorBtn onClick={() => handleDeleteColor(color)}>Eliminar</DeleteColorBtn>
        </div>
      </Popover>
    </Grid>
  )
}
