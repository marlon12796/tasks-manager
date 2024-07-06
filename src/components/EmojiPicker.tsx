import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { AddReaction, AutoAwesome, Edit, RemoveCircleOutline } from '@mui/icons-material'
import { Avatar, Badge, Button, CircularProgress } from '@mui/material'
import { Emoji, type EmojiClickData, EmojiStyle, SuggestionMode, Theme } from 'emoji-picker-react'
import { type CSSProperties, type Dispatch, type SetStateAction, Suspense, lazy, useContext, useEffect, useState } from 'react'
import { UserContext } from '../contexts/UserContext'
import { useOnlineStatus } from '../hooks/useOnlineStatus'
import { fadeIn } from '../styles'
import { ColorPalette } from '../theme/themeConfig'
import { getFontColor, showToast, systemInfo } from '../utils'

const EmojiPicker = lazy(() => import('emoji-picker-react'))

interface EmojiPickerProps {
  emoji?: string
  //FIXME:
  setEmoji: Dispatch<SetStateAction<string | null>>
  //TODO:
  // onEmojiChange: (emojiData: EmojiClickData) => void;
  color?: string
  width?: CSSProperties['width']
  name?: string
}

export const CustomEmojiPicker = ({ emoji, setEmoji, color, width, name }: EmojiPickerProps) => {
  const { user, setUser } = useContext(UserContext)
  const { emojisStyle, settings } = user
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false)
  const [currentEmoji, setCurrentEmoji] = useState<string | null>(emoji || null)

  const isOnline = useOnlineStatus()
  const emotionTheme = useTheme()

  interface EmojiItem {
    unified: string
    original: string
    count: number
  }

  const getFrequentlyUsedEmojis = (): string[] => {
    const frequentlyUsedEmojis: EmojiItem[] | null = JSON.parse(localStorage.getItem('epr_suggested') || 'null')

    if (!frequentlyUsedEmojis) {
      return []
    }

    frequentlyUsedEmojis.sort((a: EmojiItem, b: EmojiItem) => b.count - a.count)
    const topEmojis: EmojiItem[] = frequentlyUsedEmojis.slice(0, 6)
    const topUnified: string[] = topEmojis.map((item: EmojiItem) => item.unified)

    return topUnified
  }

  // Cuando el estado currentEmoji cambia, actualiza el estado emoji del componente padre
  useEffect(() => {
    currentEmoji !== null && setEmoji(currentEmoji)
  }, [currentEmoji, setEmoji])

  // Cuando la propiedad emoji cambia a una cadena vacía, establece el estado currentEmoji a null
  useEffect(() => {
    if (emoji === '') setCurrentEmoji(null)
  }, [emoji])

  // Función para alternar la visibilidad del EmojiPicker
  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prevState) => !prevState)
  }

  // Función manejadora para cuando se hace clic en un emoji en el EmojiPicker
  const handleEmojiClick = (e: EmojiClickData) => {
    toggleEmojiPicker()
    setCurrentEmoji(e.unified)
    console.log(e)
  }

  const handleRemoveEmoji = () => {
    toggleEmojiPicker()
    setCurrentEmoji(null)
  }

  const [isAILoading, setIsAILoading] = useState<boolean>(false)
  // ‼ Esta característica solo funciona en Chrome (Dev / Canary) versión 127 o superior con algunas banderas habilitadas
  async function useAI() {
    const start = new Date().getTime()
    setIsAILoading(true)
    //@ts-expect-error window.ai es una característica experimental de Chrome
    const session = window.ai.createTextSession()

    const sessionInstance = await session

    const response = await sessionInstance.prompt(
      `Elige un emoji que mejor represente la tarea: ${name}. (Por ejemplo: 🖥️ para programación, 📝 para escribir, 🎨 para diseño) Escribe 'ninguno' si no aplica.`
    )

    console.log('Respuesta completa de AI:', response)
    // Validar si la entrada del usuario es un emoji válido
    const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u
    if (emojiRegex.test(response)) {
      setIsAILoading(false)

      const unified = emojiToUnified(response.trim().toLowerCase()).toLowerCase()
      console.log('Emoji unificado:', unified)
      setCurrentEmoji(unified)
    } else {
      setCurrentEmoji(null)
      showToast(`Emoji inválido (respuesta: ${response}). Por favor intenta de nuevo con otro nombre de tarea.`, {
        type: 'error'
      })
      console.error('Emoji inválido.')
    }
    const end = new Date().getTime()
    setIsAILoading(false)
    console.log(`%cTardó ${end - start}ms en generarse.`, 'color: lime')
  }

  const emojiToUnified = (emoji: string): string => {
    const codePoints = [...emoji].map((char) => {
      if (char) {
        return char.codePointAt(0)?.toString(16).toUpperCase() ?? ''
      }
      return ''
    })
    return codePoints.join('-')
  }
  // fin del código de la característica experimental de AI

  // Función para renderizar el contenido del Avatar basado en si se ha seleccionado un emoji o no
  const renderAvatarContent = () => {
    const fontColor = color ? getFontColor(color) : ColorPalette.fontLight
    if (isAILoading) {
      return <CircularProgress size={40} thickness={5} sx={{ color: fontColor }} />
    }
    if (currentEmoji) {
      const emojiSize =
        emojisStyle === EmojiStyle.NATIVE && systemInfo.os === 'iOS' ? 64 : emojisStyle === EmojiStyle.NATIVE ? 48 : 64

      return (
        <EmojiElement key={currentEmoji}>
          <Emoji size={emojiSize} emojiStyle={emojisStyle} unified={currentEmoji} />
        </EmojiElement>
      )
    }
    return (
      <AddReaction
        sx={{
          fontSize: '52px',
          color: fontColor,
          transition: '.3s all'
        }}
      />
    )
  }

  return (
    <>
      <EmojiContainer>
        <Badge
          overlap='circular'
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <Avatar
              sx={{
                background: '#9c9c9c81',
                backdropFilter: 'blur(6px)',
                cursor: 'pointer'
              }}
              onClick={toggleEmojiPicker}
            >
              <Edit />
            </Avatar>
          }
        >
          <Avatar
            onClick={toggleEmojiPicker}
            sx={{
              width: '96px',
              height: '96px',
              background: color || emotionTheme.primary,
              transition: '.3s all',
              cursor: 'pointer'
            }}
          >
            {renderAvatarContent()}
          </Avatar>
        </Badge>
      </EmojiContainer>
      {'ai' in window && name && (
        <Button onClick={useAI} disabled={name?.length < 5} style={{ width: '250px', height: '50px', marginBottom: '4px' }}>
          <AutoAwesome /> &nbsp; Encontrar emoji con AI
        </Button>
      )}
      {showEmojiPicker && (
        <>
          {!isOnline && emojisStyle !== EmojiStyle.NATIVE && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                maxWidth: width || '350px',
                margin: '6px auto -6px auto'
              }}
            >
              <span style={{ margin: 0, fontSize: '14px', textAlign: 'center' }}>
                Los emojis pueden no cargarse correctamente cuando estás sin conexión. Intenta cambiar al estilo de emoji nativo.
                <br />
                <Button
                  variant='outlined'
                  onClick={() => {
                    setUser((prevUser) => ({
                      ...prevUser,
                      emojisStyle: EmojiStyle.NATIVE
                    }))
                  }}
                  sx={{ borderRadius: '12px', p: '10px 20px', mt: '12px' }}
                >
                  Cambiar estilo
                </Button>
              </span>
            </div>
          )}

          <EmojiPickerContainer>
            <Suspense
              fallback={
                !settings[0].simpleEmojiPicker && (
                  <PickerLoader pickerTheme={emotionTheme.darkmode ? 'dark' : 'light'} width={width} />
                )
              }
            >
              <EmojiPicker
                width={width || '350px'}
                height='500px'
                reactionsDefaultOpen={settings[0].simpleEmojiPicker && getFrequentlyUsedEmojis().length !== 0}
                reactions={getFrequentlyUsedEmojis()}
                emojiStyle={emojisStyle}
                theme={emotionTheme.darkmode ? Theme.DARK : Theme.LIGHT}
                suggestedEmojisMode={SuggestionMode.FREQUENT}
                autoFocusSearch={false}
                onEmojiClick={handleEmojiClick}
                searchPlaceHolder='Buscar emoji'
                previewConfig={{
                  defaultEmoji: '1f4dd',
                  defaultCaption: 'Elige el emoji perfecto para tu tarea'
                }}
              />
            </Suspense>
          </EmojiPickerContainer>
          {currentEmoji && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '14px'
              }}
            >
              <Button variant='outlined' color='error' onClick={handleRemoveEmoji} sx={{ p: '10px 20px', borderRadius: '12px' }}>
                <RemoveCircleOutline /> &nbsp; Quitar Emoji
              </Button>
            </div>
          )}
        </>
      )}
    </>
  )
}

const EmojiContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 14px;
`

const EmojiPickerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 24px;
  animation: ${fadeIn} 0.4s ease-in;
`

const PickerLoader = styled.div<{
  pickerTheme: 'light' | 'dark' | undefined
  width: CSSProperties['width'] | undefined
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ width }) => width || '350px'};
  height: 500px;
  padding: 8px;
  border-radius: 20px;
  background: ${({ pickerTheme }) => (pickerTheme === 'dark' ? '#222222' : '#ffffff')};
  border: ${({ pickerTheme }) => `1px solid ${pickerTheme === 'dark' ? '#151617' : '#e7e7e7'}`};
`

const EmojiElement = styled.div`
  animation: ${fadeIn} 0.4s ease-in;
`
