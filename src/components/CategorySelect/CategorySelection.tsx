import { Box, Button } from '@mui/material'
import { CategoriesMenu, NoCategories } from './CategorySelect.styled'
import { Emoji, EmojiStyle } from 'emoji-picker-react'
import { useNavigate } from 'react-router-dom'
import { Category } from '../../types/user'
import { RadioButtonChecked } from '@mui/icons-material'
import { MAX_CATEGORIES_IN_TASK } from '../../constants'

interface CategorySelectCategoriesProps {
  categories: Category[]
  selectedCats: Category[]
  emojisStyle: EmojiStyle
}

export const CategorySelection: React.FC<CategorySelectCategoriesProps> = ({ categories, selectedCats, emojisStyle }) => {
  const navigate = useNavigate()

  return categories && categories.length > 0 ? (
    <Box>
      {categories.map((category) => (
        <CategoriesMenu
          key={category.id}
          value={category.id}
          clr={category.color}
          translate='no'
          disable={selectedCats.length >= MAX_CATEGORIES_IN_TASK && !selectedCats.some((cat) => cat.id === category.id)}
        >
          {selectedCats.some((cat) => cat.id === category.id) && <RadioButtonChecked />}
          {category.emoji && <Emoji unified={category.emoji} emojiStyle={emojisStyle} />}
          &nbsp;
          {category.name}
        </CategoriesMenu>
      ))}
    </Box>
  ) : (
    <NoCategories disableTouchRipple>
      <p>No tienes ninguna categoría</p>
      <Button fullWidth variant='outlined' onClick={() => navigate('/categories')}>
        Añadir categoría
      </Button>
    </NoCategories>
  )
}
