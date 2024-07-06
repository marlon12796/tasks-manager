import { Avatar, type ChipProps } from '@mui/material'
import type { Category } from '../../types/user'
import { useContext } from 'react'
import { UserContext } from '../../contexts/UserContext'
import { StyledBadgeProps, StyledCategoryBadge } from './CategoryBadge.styled'
import { Emoji, EmojiStyle } from 'emoji-picker-react'
/**
 * Component for displaying a category badge.
 */
interface CategoryBadgeProps extends ChipProps, StyledBadgeProps {
  category: Category
  /**
   * Array representing emoji sizes: [normal, native]
   */
  emojiSizes?: [number, number]
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, emojiSizes, ...props }) => {
  const { user } = useContext(UserContext)
  const { emojisStyle, settings } = user

  return (
    <StyledCategoryBadge
      key={category.id}
      label={category.name}
      variant='outlined'
      backgroundclr={category.color}
      glow={settings[0].enableGlow}
      translate='no'
      avatar={
        category.emoji ? (
          <Avatar
            alt={category.name}
            sx={{
              background: 'transparent',
              borderRadius: '0px'
            }}
          >
            <Emoji
              lazyLoad
              size={emojiSizes ? (emojisStyle !== EmojiStyle.NATIVE ? emojiSizes[0] : emojiSizes[1]) : 20}
              unified={category.emoji}
              emojiStyle={emojisStyle}
            />
          </Avatar>
        ) : undefined
      }
      {...props}
    />
  )
}
