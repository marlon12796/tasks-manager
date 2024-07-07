import { AddReaction } from '@mui/icons-material'
import { CircularProgress } from '@mui/material'
import { Emoji, EmojiStyle } from 'emoji-picker-react'

import { ColorPalette } from '../../theme/themeConfig'
import { getFontColor, systemInfo } from '../../utils'
import { EmojiElement } from './EmojiPicker.styled'
import { useContext } from 'react'
import { UserContext } from '../../contexts/UserContext'
interface AvatarContentTypes {
  isAILoading: boolean
  color: string
  currentEmoji: string | null
}
export const AvatarContent = ({ isAILoading, color, currentEmoji }: AvatarContentTypes) => {
  const {
    user: { emojisStyle }
  } = useContext(UserContext)

  const fontColor = color ? getFontColor(color) : ColorPalette.fontLight
  if (isAILoading) return <CircularProgress size={40} thickness={5} sx={{ color: fontColor }} />
  const emojiSize =
    emojisStyle === EmojiStyle.NATIVE && systemInfo.os === 'iOS' ? 64 : emojisStyle === EmojiStyle.NATIVE ? 48 : 64
  return !currentEmoji ? (
    <AddReaction
      sx={{
        fontSize: '52px',
        color: fontColor,
        transition: '.3s all'
      }}
    />
  ) : (
    <EmojiElement key={currentEmoji}>
      <Emoji size={emojiSize} emojiStyle={emojisStyle} unified={currentEmoji} />
    </EmojiElement>
  )
}
