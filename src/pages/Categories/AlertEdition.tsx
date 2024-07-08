import { SaveRounded } from '@mui/icons-material'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { ColorPicker, CustomEmojiPicker } from '../../components'
import { CATEGORY_NAME_MAX_LENGTH } from '../../constants'
import { DialogBtn, EditNameInput } from '../../styles'
import { ColorPalette } from '../../theme/themeConfig'
import { useContext } from 'react'
import { UserContext } from '../../contexts/UserContext'
import { useTheme } from '@emotion/react'
import { UUID } from '@/types/user'
interface AlertEditionTypes {
  openEditDialog: boolean
  onEditDimiss: () => void
  onEditCategory: () => void
  onChangeEditColor: (clr: string) => void
  onEditNameChange: (name: string) => void
  selectedCategoryId?: UUID
  editColor: string
  editName: string
  editNameError: string
  setEditEmoji: React.Dispatch<React.SetStateAction<string | null>>
}
export const AlertEdition = ({
  editColor,
  editName,
  editNameError,
  selectedCategoryId,
  openEditDialog,
  onEditDimiss,
  onEditCategory,
  onChangeEditColor,
  onEditNameChange,
  setEditEmoji
}: AlertEditionTypes) => {
  const { user } = useContext(UserContext)
  const theme = useTheme()
  const renderHelperText = () => {
    if (editNameError) return editNameError

    if (editName.length === 0) return 'El nombre de la categoría es requerido'

    return `${editName.length}/${CATEGORY_NAME_MAX_LENGTH}`
  }
  return (
    <Dialog
      open={openEditDialog}
      onClose={onEditDimiss}
      PaperProps={{
        style: {
          borderRadius: '24px',
          padding: '12px',
          maxWidth: '600px'
        }
      }}
    >
      <DialogTitle>
        <span> Editar Categoría</span> <b>{user.categories.find((cat) => cat.id === selectedCategoryId)?.name}</b>
      </DialogTitle>

      <DialogContent>
        <CustomEmojiPicker
          emoji={user.categories.find((cat) => cat.id === selectedCategoryId)?.emoji || undefined}
          setEmoji={setEditEmoji}
          width={300}
          color={editColor}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          <EditNameInput
            label='Ingrese el nombre de la categoría'
            placeholder='Ingrese el nombre de la categoría'
            value={editName}
            error={editNameError !== '' || editName.length === 0}
            onChange={(e) => onEditNameChange(e.target.value)}
            helperText={renderHelperText()}
          />
          <ColorPicker
            color={editColor}
            width='300px'
            fontColor={theme.darkmode ? ColorPalette.fontLight : ColorPalette.fontDark}
            onColorChange={(clr) => onChangeEditColor(clr)}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <DialogBtn onClick={onEditDimiss}>Cancelar</DialogBtn>
        <DialogBtn onClick={onEditCategory} disabled={editNameError !== '' || editName.length === 0}>
          <SaveRounded /> &nbsp; Guardar
        </DialogBtn>
      </DialogActions>
    </Dialog>
  )
}
