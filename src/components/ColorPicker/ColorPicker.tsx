import { useTheme } from '@emotion/react'
import { AddRounded, ExpandMoreRounded, InfoRounded } from '@mui/icons-material'
import { AccordionDetails, AccordionSummary, Grid, Tooltip } from '@mui/material'
import { getColorName } from 'ntc-ts'
import { type CSSProperties, useCallback, useContext, useEffect, useState } from 'react'
import type { ToastOptions } from 'react-hot-toast'
import { MAX_COLORS_IN_LIST } from '../../constants'
import { UserContext } from '../../contexts/UserContext'
import { ColorElement } from '../../styles'
import { ColorPalette } from '../../theme/themeConfig'
import { getFontColor, showToast } from '../../utils'
import { ToastColorPreview, AccordionPreview, ColorPreview, StyledAccordion, StyledInfo } from './ColorPicker.styled'
import { AlertNewColor } from './AlertNewColor'
import { ColorElementGridItem } from './ColorElementGrid'
interface ColorPickerProps {
  color: string
  onColorChange: (newColor: string) => void
  width?: CSSProperties['width']
  fontColor?: CSSProperties['color']
  label?: string
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onColorChange, width, fontColor, label }) => {
  const { user, setUser } = useContext(UserContext)
  const { colorList } = user
  const [selectedColor, setSelectedColor] = useState<string>(color)
  const [accordionExpanded, setAccordionExpanded] = useState<boolean>(false)

  const [popoverOpen, setPopoverOpen] = useState<boolean[]>(Array(colorList.length).fill(false))
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false)
  const [addColorVal, setAddColorVal] = useState<string>(color)

  const theme = useTheme()

  useEffect(() => {
    // Update the selected color when the color prop changes
    setSelectedColor(color)
  }, [color])

  const handleColorChange = useCallback(
    (color: string) => {
      setSelectedColor(color)
      onColorChange(color)
    },
    [onColorChange]
  )

  // Check if the current color is a valid hex color and update it if not
  useEffect(() => {
    const isHexColor = (value: string): boolean => /^#[0-9A-Fa-f]{6}$/.test(value)
    if (!isHexColor(color)) {
      handleColorChange(theme.primary)
      setSelectedColor(theme.primary)
      console.error(`Invalid hex color ${color}`)
    }
  }, [color, handleColorChange, theme.primary])

  const handleAccordionChange = (_event: React.SyntheticEvent<Element, Event>, isExpanded: boolean) =>
    setAccordionExpanded(isExpanded)

  const togglePopover = (index: number) => {
    const newPopoverOpen = [...popoverOpen]
    newPopoverOpen[index] = !newPopoverOpen[index]
    setPopoverOpen(newPopoverOpen)
  }

  const handleAddDialogOpen = () => {
    setOpenAddDialog(true)
    setAddColorVal(selectedColor)
  }

  const handleAddDialogClose = () => {
    setOpenAddDialog(false)
    setAddColorVal(selectedColor)
  }

  const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => setAddColorVal(e.target.value as string)

  const ToastColorOptions = (color: string): Pick<ToastOptions, 'iconTheme' | 'style'> => {
    return {
      iconTheme: { primary: color, secondary: getFontColor(color) },
      style: { borderColor: color }
    }
  }

  const handleAddColor = () => {
    if (colorList.length >= MAX_COLORS_IN_LIST) {
      showToast(`You cannot add more than ${MAX_COLORS_IN_LIST} colors to color list.`, {
        type: 'error'
      })
      return
    }

    if (
      colorList.some((color) => color.toLowerCase() === addColorVal.toLowerCase()) ||
      addColorVal.toLowerCase() === theme.primary.toLowerCase()
    ) {
      showToast('El color ya esta en la lista de color.', { type: 'error' })
      return
    }

    handleColorChange(addColorVal.toUpperCase())
    setUser({ ...user, colorList: [...colorList, addColorVal.toUpperCase()] })
    showToast(
      <div>
        Añadido
        <b>
          <ToastColorPreview clr={addColorVal} />
          {getColorName(addColorVal).name}
        </b>{' '}
        a tu lista de color.
      </div>,
      ToastColorOptions(addColorVal)
    )
    handleAddDialogClose()
  }

  const handleDeleteColor = (clr: string) => {
    setPopoverOpen(Array(colorList.length).fill(false))
    showToast(
      <div>
        Removido
        <b>
          <ToastColorPreview clr={clr} />
          {getColorName(clr).name}
        </b>{' '}
        de tu lista de color.
      </div>,
      ToastColorOptions(clr)
    )

    setUser({
      ...user,
      colorList: colorList.filter((listColor) => listColor !== clr)
    })
  }

  return (
    <>
      <StyledAccordion
        onChange={handleAccordionChange}
        sx={{
          width: width
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreRounded sx={{ color: fontColor || ColorPalette.fontLight }} />}
          sx={{ fontWeight: 500 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {!accordionExpanded && <AccordionPreview clr={selectedColor} />}
            <span style={{ color: fontColor || ColorPalette.fontLight }}>
              {label || 'Color'}
              {!accordionExpanded && ` - ${getColorName(selectedColor).name}`}
            </span>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <ColorPreview maxWidth={width || 400} clr={selectedColor}>
            {selectedColor.toUpperCase()} - {getColorName(selectedColor).name}
          </ColorPreview>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              maxWidth: width || 400
            }}
          >
            <Grid container spacing={1} maxWidth={width || 400} m={1}>
              {[theme.primary, ...colorList].map((color, index) => (
                <ColorElementGridItem
                  color={color}
                  index={index}
                  key={color + index}
                  popoverOpen={popoverOpen}
                  selectedColor={selectedColor}
                  handleDeleteColor={handleDeleteColor}
                  onColorChange={handleColorChange}
                  onTogglePopover={togglePopover}
                />
              ))}
              <Tooltip title='Añadir nuevo Color'>
                <Grid item>
                  <ColorElement
                    clr='transparent'
                    style={{
                      border: '2px solid',
                      color: fontColor || ColorPalette.fontLight
                    }}
                    onClick={handleAddDialogOpen}
                  >
                    <AddRounded style={{ fontSize: '38px' }} />
                  </ColorElement>
                </Grid>
              </Tooltip>
            </Grid>
          </div>
          <StyledInfo clr={fontColor || ColorPalette.fontLight}>
            <InfoRounded fontSize='small' /> {window.matchMedia('(pointer:fine)').matches ? 'Right click' : 'Double tap'} Remover
            color de lista
          </StyledInfo>
        </AccordionDetails>
      </StyledAccordion>
      <AlertNewColor
        addColorVal={addColorVal}
        colorList={colorList}
        open={openAddDialog}
        onColorChange={handleColorChange}
        onClose={handleAddDialogClose}
        handleAddColor={handleAddColor}
        onPickerChange={handlePickerChange}
      />
    </>
  )
}
