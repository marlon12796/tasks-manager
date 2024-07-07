import { useTheme } from '@emotion/react'
import {
  BrightnessAutoRounded,
  DarkModeRounded,
  ExpandMoreRounded,
  LightModeRounded,
  PersonalVideoRounded
} from '@mui/icons-material'
import {
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  FormGroup,
  FormLabel,
  type SelectChangeEvent,
  Switch,
  Tooltip
} from '@mui/material'
import { EmojiStyle } from 'emoji-picker-react'
import { useCallback, useContext, useEffect, useState } from 'react'
import { defaultUser } from '../../constants/defaultUser'
import { UserContext } from '../../contexts/UserContext'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'
import { useSystemTheme } from '../../hooks/useSystemTheme'
import { DialogBtn } from '../../styles'
import { ColorPalette } from '../../theme/themeConfig'
import type { AppSettings, DarkModeOptions } from '../../types/user'
import { getFontColor } from '../../utils'
import { ContainerSettings, StyledFormLabel, StyledMenuItem, StyledSelect } from './Settings.styled'
import { SettingsVoice } from './SettingsVoice'
import { SettingsEmoji } from './SettingsEmoji'

interface SettingsProps {
  open: boolean
  onClose: () => void
}

//TODO: Redesign settings component to have tabs on the left side

export const SettingsDialog: React.FC<SettingsProps> = ({ open, onClose }) => {
  const { user, setUser } = useContext(UserContext)
  const { settings, emojisStyle, darkmode } = user
  const [userSettings, setUserSettings] = useState<AppSettings>(settings[0])
  const [lastStyle] = useState<EmojiStyle>(emojisStyle)

  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [voiceVolume, setVoiceVolume] = useState<number>(settings[0].voiceVolume)
  const [prevVoiceVol, setPrevVoiceVol] = useState<number>(settings[0].voiceVolume)
  const [showLocalVoices, setShowLocalVoices] = useState<boolean>(false)

  const [storageUsage, setStorageUsage] = useState<number | undefined>(undefined)

  const isOnline = useOnlineStatus()
  const systemTheme = useSystemTheme()
  const theme = useTheme()

  // Array of available emoji styles with their labels
  const emojiStyles: { label: string; style: EmojiStyle }[] = [
    { label: 'Apple', style: EmojiStyle.APPLE },
    { label: 'Facebook, Messenger', style: EmojiStyle.FACEBOOK },
    { label: 'Twitter, Discord', style: EmojiStyle.TWITTER },
    { label: 'Google', style: EmojiStyle.GOOGLE },
    { label: 'Native', style: EmojiStyle.NATIVE }
  ]

  // Array of available dark mode options
  const darkModeOptions: {
    label: string
    mode: DarkModeOptions
    icon: JSX.Element
  }[] = [
    {
      label: 'Automático',
      mode: 'auto',
      icon: <BrightnessAutoRounded />
    },
    {
      label: 'Sistema',
      mode: 'system',
      icon: <PersonalVideoRounded />
    },
    {
      label: 'Claro',
      mode: 'light',
      icon: <LightModeRounded />
    },
    {
      label: 'Oscuro',
      mode: 'dark',
      icon: <DarkModeRounded />
    }
  ]

  // function to get the flag emoji for a given country code
  const getFlagEmoji = (countryCode: string): string =>
    typeof countryCode === 'string'
      ? String.fromCodePoint(...[...countryCode.toUpperCase()].map((x) => 0x1f1a5 + x.charCodeAt(0)))
      : ''

  // Function to get the available speech synthesis voices
  // https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis
  const getAvailableVoices = useCallback(() => {
    const voices = window.speechSynthesis.getVoices()
    const voiceInfoArray: SpeechSynthesisVoice[] = []
    for (const voice of voices) {
      voiceInfoArray.push(voice)
    }
    return voiceInfoArray
  }, [])
  useEffect(() => {
    const availableVoices = getAvailableVoices()
    setAvailableVoices(availableVoices ?? [])

    const getStorageUsage = async () => {
      const storageUsage = await navigator.storage.estimate()
      setStorageUsage(storageUsage.usage)
    }
    getStorageUsage()
  }, [getAvailableVoices])

  // Ensure the voices are loaded before calling getAvailableVoices
  window.speechSynthesis.onvoiceschanged = () => {
    const availableVoices = getAvailableVoices()
    setAvailableVoices(availableVoices ?? [])
  }

  // Handler for updating individual setting options
  const handleSettingChange = (name: keyof AppSettings) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked
    // cancel read aloud
    if (name === 'enableReadAloud') window.speechSynthesis.cancel()

    if (name === 'appBadge' && navigator.clearAppBadge && !isChecked) navigator.clearAppBadge()

    const updatedSettings: AppSettings = {
      ...userSettings,
      [name]: isChecked
    }
    setUserSettings(updatedSettings)
    setUser((prevUser) => ({
      ...prevUser,
      settings: [updatedSettings]
    }))
  }

  // Handler for updating the selected emoji style
  const handleEmojiStyleChange = (event: SelectChangeEvent<unknown>) => {
    const selectedEmojiStyle = event.target.value as EmojiStyle
    setUser((prevUser) => ({
      ...prevUser,
      emojisStyle: selectedEmojiStyle
    }))
  }

  const handleDarkModeChange = (event: SelectChangeEvent<unknown>) => {
    const selectedDarkMode = event.target.value as DarkModeOptions
    setUser((prevUser) => ({
      ...prevUser,
      darkmode: selectedDarkMode
    }))
  }

  const handleVoiceChange = (event: SelectChangeEvent<unknown>) => {
    // Handle the selected voice
    const selectedVoice = availableVoices.find((voice) => voice.name === (event.target.value as string))
    if (selectedVoice) {
      // Update the user settings with the selected voice
      setUser((prevUser) => ({
        ...prevUser,
        settings: [
          {
            ...prevUser.settings[0],
            voice: selectedVoice.name
          }
        ]
      }))
    }
  }

  // Function to handle changes in voice volume after mouse up
  const handleVoiceVolCommitChange = (value: number | number[]) => {
    // Update user settings with the new voice volume
    setUser((prevUser) => ({
      ...prevUser,
      settings: [
        {
          ...prevUser.settings[0],
          voiceVolume: value as number
        }
      ]
    }))
  }
  const handleModifiedVoiceVolume = (newVoiceVolume: number) => {
    setVoiceVolume(newVoiceVolume)
  }

  // Function to handle mute/unmute button click
  const handleMuteClick = () => {
    // Retrieve the current voice volume from user settings
    const vol = voiceVolume
    // Save the previous voice volume before muting
    setPrevVoiceVol(vol)
    const newVoiceVolume = vol === 0 ? (prevVoiceVol !== 0 ? prevVoiceVol : defaultUser.settings[0].voiceVolume) : 0
    setUser((prevUser) => ({
      ...prevUser,
      settings: [
        {
          ...prevUser.settings[0],
          voiceVolume: newVoiceVolume
        }
      ]
    }))
    setVoiceVolume(newVoiceVolume)
  }

  const getLanguageRegion = (lang: string) => {
    if (!lang) {
      // If lang is undefined or falsy, return an empty string
      return ''
    }
    const langParts = lang.split('-')
    if (langParts.length > 1) {
      try {
        return new Intl.DisplayNames([lang], { type: 'region' }).of(langParts[1])
      } catch (error) {
        console.error('Error:', error)
        // Return the language itself if there's an error
        return lang
      }
    } else {
      // If region is not specified, return the language itself
      return lang
    }
  }

  const filteredVoices = showLocalVoices
    ? availableVoices.filter((voice) => voice.lang.startsWith(navigator.language))
    : availableVoices
  const handleChangeLocalVoices = () => {
    setShowLocalVoices((prev) => !prev)
  }
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ fontWeight: 600 }}>Configuración</DialogTitle>
      <ContainerSettings>
        <FormGroup>
          <FormControl>
            <FormLabel>Modo Oscuro</FormLabel>
            <StyledSelect value={darkmode} onChange={handleDarkModeChange} IconComponent={ExpandMoreRounded}>
              {darkModeOptions.map((option) => (
                <StyledMenuItem key={option.mode} value={option.mode}>
                  {option.icon} {option.label}
                  {option.mode === 'system' && ` (${systemTheme})`}
                  {option.mode === 'auto' && ` (${getFontColor(theme.secondary) === ColorPalette.fontDark ? 'claro' : 'oscuro'})`}
                </StyledMenuItem>
              ))}
            </StyledSelect>
          </FormControl>
        </FormGroup>

        <SettingsEmoji
          emojiStyles={emojiStyles}
          isOnline={isOnline}
          lastStyle={lastStyle}
          onEmojiStyleChange={handleEmojiStyleChange}
          onSettingsChange={handleSettingChange}
          userSettings={userSettings}
        />

        <FormGroup>
          <FormLabel>Configuraciones de la Aplicación</FormLabel>
          <StyledFormLabel
            sx={{ opacity: userSettings.enableCategories ? 1 : 0.8 }}
            control={<Switch checked={userSettings.enableCategories} onChange={handleSettingChange('enableCategories')} />}
            label='Habilitar Categorías'
          />
        </FormGroup>

        <FormGroup>
          <StyledFormLabel
            sx={{ opacity: userSettings.enableGlow ? 1 : 0.8 }}
            control={<Switch checked={userSettings.enableGlow} onChange={handleSettingChange('enableGlow')} />}
            label='Habilitar Efecto de Resplandor'
          />
        </FormGroup>

        <FormGroup>
          <StyledFormLabel
            sx={{ opacity: userSettings.enableReadAloud ? 1 : 0.8 }}
            control={
              <Switch
                checked={!!('speechSynthesis' in window && userSettings.enableReadAloud)}
                onChange={handleSettingChange('enableReadAloud')}
                disabled={!('speechSynthesis' in window)}
              />
            }
            label='Habilitar Lectura en Voz Alta'
          />
        </FormGroup>

        {'clearAppBadge' in navigator && window.matchMedia('(display-mode: standalone)').matches && (
          <Tooltip
            title={
              'setAppBadge' in navigator
                ? 'Esto mostrará el número de tareas no realizadas en el ícono de la aplicación si PWA está instalada.'
                : 'El distintivo de la aplicación no es compatible'
            }
          >
            <FormGroup>
              <StyledFormLabel
                sx={{ opacity: userSettings.appBadge ? 1 : 0.8 }}
                control={
                  <Switch
                    checked={!!('setAppBadge' in navigator && userSettings.appBadge)}
                    onChange={handleSettingChange('appBadge')}
                    disabled={!('setAppBadge' in navigator)}
                  />
                }
                label='Habilitar Distintivo de Aplicación'
              />
            </FormGroup>
          </Tooltip>
        )}

        <FormGroup>
          <StyledFormLabel
            sx={{ opacity: userSettings.doneToBottom ? 1 : 0.8 }}
            control={<Switch checked={userSettings.doneToBottom} onChange={handleSettingChange('doneToBottom')} />}
            label='Mover Tareas Realizadas al Fondo'
          />
        </FormGroup>

        {settings[0].enableReadAloud && (
          <SettingsVoice
            filteredVoices={filteredVoices}
            getAvailableVoices={getAvailableVoices}
            getFlagEmoji={getFlagEmoji}
            getLanguageRegion={getLanguageRegion}
            settings={settings}
            voiceVolume={voiceVolume}
            showLocalVoices={showLocalVoices}
            onChangeLocalVoices={handleChangeLocalVoices}
            onVoiceChange={handleVoiceChange}
            onMuteClicked={handleMuteClick}
            onVoiceVolCommitChange={handleVoiceVolCommitChange}
            onModifiedVoiceVolume={handleModifiedVoiceVolume}
            setAvailableVoices={setAvailableVoices}
          />
        )}

        {storageUsage !== undefined && storageUsage !== 0 && (
          <FormGroup>
            <FormLabel>Uso de Almacenamiento</FormLabel>
            <div>{storageUsage ? `${(storageUsage / 1024 / 1024).toFixed(2)} MB` : '0 MB'}</div>
          </FormGroup>
        )}
      </ContainerSettings>

      <DialogActions>
        <DialogBtn onClick={onClose}>Cerrar</DialogBtn>
      </DialogActions>
    </Dialog>
  )
}
