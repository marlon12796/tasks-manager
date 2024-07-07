import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import AddRounded from '@mui/icons-material/AddRounded'
import ColorizeRounded from '@mui/icons-material/ColorizeRounded'
import { getColorName } from 'ntc-ts'
import { getFontColor } from '../../utils'
import { StyledColorPicker, PickerLabel } from './ColorPicker.styled'
import { useTheme } from '@emotion/react'
interface AlertNewColorProps {
  open: boolean
  onClose: () => void
  addColorVal: string
  onPickerChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onColorChange: (color: string) => void
  handleAddColor: () => void
  colorList: string[]
}

export const AlertNewColor: React.FC<AlertNewColorProps> = ({
  open,
  onClose,
  addColorVal,
  onPickerChange,
  onColorChange,
  handleAddColor,
  colorList
}) => {
  const theme = useTheme()
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Añadir nuevo color</DialogTitle>
      <DialogContent>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '4px 0',
            fontWeight: 600
          }}
        >
          {addColorVal.toUpperCase()} - {getColorName(addColorVal).name}{' '}
          {/* Asegúrate de tener la función getColorName implementada */}
        </div>
        <div style={{ position: 'relative' }}>
          <StyledColorPicker type='color' value={addColorVal} onChange={onPickerChange} />
          <datalist id='color-list'>
            <option value={theme.primary} />
            {colorList.map((color) => (
              <option value={color} key={color} />
            ))}
          </datalist>
          <PickerLabel clr={getFontColor(addColorVal)}>
            {' '}
            {/* Asegúrate de tener la función getFontColor implementada */}
            <ColorizeRounded /> Elegir color
          </PickerLabel>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={() => {
            onColorChange(addColorVal)
            onClose()
          }}
        >
          <ColorizeRounded /> &nbsp; Modificar
        </Button>
        <Button onClick={handleAddColor}>
          <AddRounded /> &nbsp; Añadir
        </Button>
      </DialogActions>
    </Dialog>
  )
}
