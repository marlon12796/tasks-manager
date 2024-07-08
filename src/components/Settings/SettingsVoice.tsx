import { CachedRounded, ExpandMoreRounded, Google, Microsoft, VolumeDown, VolumeOff, VolumeUp } from '@mui/icons-material'
import {
  Box,
  Chip,
  FormControl,
  FormGroup,
  FormLabel,
  IconButton,
  MenuItem,
  type SelectChangeEvent,
  Slider,
  Switch,
  Tooltip
} from '@mui/material'
import { systemInfo } from '../../utils'
import { SettingsNoVoiceStyles, SettingsStyledFormLabel, SettingsStyledSelect, SettingsVolumeSlider } from './Settings.styled'
import { AppSettings } from '@/types/user'
interface SettingsVoiceTypes {
  filteredVoices: SpeechSynthesisVoice[]
  voiceVolume: number
  getAvailableVoices: () => SpeechSynthesisVoice[]
  getLanguageRegion: (lang: string) => string | undefined
  showLocalVoices: boolean
  getFlagEmoji: (countryCode: string) => string
  settings: AppSettings[]
  onVoiceChange: (event: SelectChangeEvent<unknown>) => void
  onModifiedVoiceVolume: (newVoiceVolume: number) => void
  onMuteClicked: () => void
  onChangeLocalVoices: () => void
  onVoiceVolCommitChange: (value: number | number[]) => void
  setAvailableVoices: React.Dispatch<React.SetStateAction<SpeechSynthesisVoice[]>>
}
export const SettingsVoice = ({
  filteredVoices,
  voiceVolume,
  getAvailableVoices,
  getLanguageRegion,
  showLocalVoices,
  getFlagEmoji,
  settings,
  onModifiedVoiceVolume,
  onVoiceChange,
  onChangeLocalVoices,
  onMuteClicked,
  onVoiceVolCommitChange,
  setAvailableVoices
}: SettingsVoiceTypes) => {
  return (
    <FormGroup>
      <FormControl>
        <FormLabel>Configuración de Voz</FormLabel>
        <SettingsStyledFormLabel
          sx={{ opacity: showLocalVoices ? 1 : 0.8, maxWidth: '300px' }}
          control={<Switch checked={showLocalVoices} onChange={onChangeLocalVoices} />}
          label={`Solo voces locales (${getLanguageRegion(navigator.language) || '?'})`}
        />
        {filteredVoices.length !== 0 ? (
          <SettingsStyledSelect
            value={settings[0].voice}
            variant='outlined'
            onChange={onVoiceChange}
            translate='no'
            IconComponent={ExpandMoreRounded}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 500,
                  padding: '2px 6px'
                }
              }
            }}
          >
            {filteredVoices.map((voice) => (
              <MenuItem
                key={voice.name}
                value={voice.name}
                translate='no'
                sx={{
                  padding: '10px',
                  borderRadius: '8px'
                }}
              >
                {voice.name.startsWith('Google') && <Google />}
                {voice.name.startsWith('Microsoft') && <Microsoft />} &nbsp;{' '}
                {/* Eliminar Google o Microsoft al principio y cualquier cosa entre paréntesis */}
                {voice.name.replace(/^(Google|Microsoft)\s*|\([^()]*\)/gi, '')} &nbsp;
                {!/Windows NT 10/.test(navigator.userAgent) ? (
                  <Chip
                    sx={{ fontWeight: 500, padding: '4px' }}
                    label={getLanguageRegion(voice.lang || '')}
                    icon={<span style={{ fontSize: '16px' }}>{getFlagEmoji(voice.lang.split('-')[1] || '')}</span>}
                  />
                ) : (
                  <span style={{ fontWeight: 500 }}>{getLanguageRegion(voice.lang || '')}</span>
                )}
                {voice.default && systemInfo.os !== 'iOS' && systemInfo.os !== 'macOS' && (
                  <span style={{ fontWeight: 600 }}>&nbsp;Por Defecto</span>
                )}
              </MenuItem>
            ))}
          </SettingsStyledSelect>
        ) : (
          <SettingsNoVoiceStyles>
            No hay estilos de voz disponibles.
            <Tooltip title='Volver a buscar voces'>
              <IconButton
                size='large'
                onClick={() => {
                  setAvailableVoices(getAvailableVoices() ?? [])
                }}
              >
                <CachedRounded fontSize='large' />
              </IconButton>
            </Tooltip>
          </SettingsNoVoiceStyles>
        )}
      </FormControl>

      <Box>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <SettingsVolumeSlider spacing={2} direction='row' alignItems='center'>
            <Tooltip title={voiceVolume ? 'Silenciar' : 'Activar Sonido'} onClick={onMuteClicked}>
              <IconButton>{voiceVolume === 0 ? <VolumeOff /> : voiceVolume <= 0.4 ? <VolumeDown /> : <VolumeUp />}</IconButton>
            </Tooltip>
            <Slider
              sx={{
                width: '100%'
              }}
              value={voiceVolume}
              onChange={(_event, value) => onModifiedVoiceVolume(value as number)}
              onChangeCommitted={(_e, val) => onVoiceVolCommitChange(val)}
              min={0}
              max={1}
              step={0.01}
              aria-label='Control de Volumen'
              valueLabelFormat={() => {
                const vol = Math.floor(voiceVolume * 100)
                return vol === 0 ? 'Silenciado' : `${vol}%`
              }}
              valueLabelDisplay='auto'
            />
          </SettingsVolumeSlider>
        </div>
      </Box>
    </FormGroup>
  )
}
