import { Delete, LinkRounded, SaveRounded } from '@mui/icons-material'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, TextField } from '@mui/material'
import { PROFILE_PICTURE_MAX_LENGTH } from '../../constants'

import { DialogBtn } from '../../styles'

import { showToast } from '../../utils'
import { UserContext } from '../../contexts/UserContext'
import { useContext } from 'react'
interface ChangeUserPhotoTypes {
  open: boolean
  profilePictureURL: string
  onCloseImageDialog: () => void
  openChangeImage: boolean
  oneSaveImage: () => void
  onChangeProfilePictureURL: (value: string) => void
}

export const ChangeUserPhoto: React.FC<ChangeUserPhotoTypes> = ({
  profilePictureURL,
  onCloseImageDialog,
  openChangeImage,
  oneSaveImage,
  onChangeProfilePictureURL
}) => {
  const { user, setUser } = useContext(UserContext)
  const { profilePicture } = user
  return (
    <Dialog open={openChangeImage} onClose={onCloseImageDialog}>
      <DialogTitle>Cambiar Foto de Perfil</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          label='Enlace a la foto de perfil'
          placeholder='Ingrese el enlace a la foto de perfil...'
          sx={{ my: '8px', width: '300px' }}
          value={profilePictureURL}
          onChange={(e) => {
            onChangeProfilePictureURL(e.target.value)
          }}
          onKeyDown={(e) => e.key === 'Enter' && oneSaveImage()}
          error={profilePictureURL.length > PROFILE_PICTURE_MAX_LENGTH}
          helperText={
            profilePictureURL.length > PROFILE_PICTURE_MAX_LENGTH
              ? `El URL es demasiado largo, máximo ${PROFILE_PICTURE_MAX_LENGTH} caracteres`
              : ''
          }
          autoComplete='url'
          type='url'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <LinkRounded />
              </InputAdornment>
            )
          }}
        />

        <br />
        {profilePicture !== null && (
          <Button
            fullWidth
            onClick={() => {
              onCloseImageDialog()
              showToast('Imagen de perfil eliminada.')
              setUser({ ...user, profilePicture: null })
            }}
            color='error'
            variant='outlined'
            sx={{ margin: '16px 0', p: '12px 20px', borderRadius: '14px' }}
          >
            <Delete /> &nbsp; Eliminar Imagen
          </Button>
        )}
      </DialogContent>
      <DialogActions>
        <DialogBtn onClick={onCloseImageDialog}>Cancelar</DialogBtn>
        <DialogBtn
          disabled={profilePictureURL.length > PROFILE_PICTURE_MAX_LENGTH || !profilePictureURL.startsWith('https://')}
          onClick={oneSaveImage}
        >
          <SaveRounded /> &nbsp; Guardar
        </DialogBtn>
      </DialogActions>
    </Dialog>
  )
}
