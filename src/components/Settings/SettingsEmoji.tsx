import { DeleteRounded, ExpandMoreRounded, WifiOffRounded } from '@mui/icons-material'
import { Button, FormControl, FormGroup, FormLabel, MenuItem, SelectChangeEvent, Switch, Tooltip } from '@mui/material'
import { Emoji, EmojiStyle } from 'emoji-picker-react'
import { defaultUser } from '../../constants/defaultUser'
import { showToast } from '../../utils'
import { StyledFormLabel, StyledMenuItem, StyledSelect } from './Settings.styled'
import { AppSettings } from '@/types/user'
import { useContext } from 'react'
import { UserContext } from '../../contexts/UserContext'
interface EmojisStyle {
  label: string
  style: EmojiStyle
}
interface SettingsEmojiTypes {
  isOnline: boolean
  userSettings: AppSettings
  lastStyle: EmojiStyle
  emojiStyles: EmojisStyle[]
  onEmojiStyleChange: (event: SelectChangeEvent<unknown>) => void
  onSettingsChange: (name: keyof AppSettings) => (event: React.ChangeEvent<HTMLInputElement>) => void
}
export const SettingsEmoji = ({
  isOnline,
  lastStyle,
  userSettings,
  emojiStyles,
  onEmojiStyleChange,
  onSettingsChange
}: SettingsEmojiTypes) => {
  const {
    user: { emojisStyle }
  } = useContext(UserContext)

  return (
    <FormGroup>
      <FormControl>
        <FormLabel>Configuración de Emojis</FormLabel>
        <StyledSelect value={emojisStyle} onChange={onEmojiStyleChange} translate='no' IconComponent={ExpandMoreRounded}>
          {/* Mostrar un elemento de menú deshabilitado cuando esté sin conexión, indicando que no se puede cambiar el estilo */}
          {!isOnline && (
            <MenuItem
              disabled
              style={{
                opacity: 0.8,
                display: 'flex',
                gap: '6px',
                fontWeight: 500
              }}
            >
              <WifiOffRounded /> No puedes cambiar el estilo de emojis <br /> cuando estás fuera de línea.
            </MenuItem>
          )}

          {emojiStyles.map((style) => (
            <StyledMenuItem
              key={style.style}
              value={style.style}
              translate='no'
              disabled={
                !isOnline &&
                style.style !== EmojiStyle.NATIVE &&
                style.style !== defaultUser.emojisStyle &&
                style.style !== lastStyle
              }
            >
              <Emoji size={24} unified='1f60e' emojiStyle={style.style} />
              &nbsp;
              {/* Espacio para Emoji Nativo */}
              {style.style === EmojiStyle.NATIVE && '\u00A0'}
              {style.label}
            </StyledMenuItem>
          ))}
        </StyledSelect>

        <Tooltip title='El selector de emojis solo mostrará emojis usados frecuentemente'>
          <FormGroup>
            <StyledFormLabel
              sx={{ opacity: userSettings.simpleEmojiPicker ? 1 : 0.8 }}
              control={<Switch checked={userSettings.simpleEmojiPicker} onChange={onSettingsChange('simpleEmojiPicker')} />}
              label='Selector de Emojis Simple'
            />
          </FormGroup>
        </Tooltip>
      </FormControl>

      <Tooltip title='Esto eliminará los datos sobre emojis usados frecuentemente'>
        <Button
          color='error'
          variant='outlined'
          sx={{ my: '12px', p: '12px', borderRadius: '18px' }}
          onClick={() => {
            localStorage.removeItem('epr_suggested')
            showToast('Datos de emojis eliminados.')
          }}
        >
          <DeleteRounded /> &nbsp; Borrar Datos de Emojis
        </Button>
      </Tooltip>
    </FormGroup>
  )
}
