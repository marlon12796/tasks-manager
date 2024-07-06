import { ExpandMoreRounded } from '@mui/icons-material'
import { Box, FormControl, FormLabel, type SelectChangeEvent } from '@mui/material'
import { type CSSProperties, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StyledSelect } from './CategorySelect.styled'
import { Category, UUID } from '../../types/user'
import { UserContext } from '../../contexts/UserContext'
import { MAX_CATEGORIES_IN_TASK } from '../../constants'
import { ColorPalette } from '../../theme/themeConfig'
import { showToast } from '../../utils'
import { CategoryBadge } from '../CategoryBadge/CategoryBadge'
import { CategorySelectHeader } from './CategoryHeaderSelect'
import { CategorySelection } from './CategorySelection'

interface CategorySelectProps {
  selectedCategories: Category[]
  onCategoryChange?: (categories: Category[]) => void
  width?: CSSProperties['width']
  fontColor?: CSSProperties['color']
}

/**
 * Component for selecting categories with emojis.
 */
export const CategorySelect: React.FC<CategorySelectProps> = ({ selectedCategories, onCategoryChange, width, fontColor }) => {
  const { user } = useContext(UserContext)
  const { categories, emojisStyle } = user
  const [selectedCats, setSelectedCats] = useState<Category[]>(selectedCategories)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const handleCategoryChange = (event: SelectChangeEvent<unknown>): void => {
    const selectedCategoryIds = event.target.value as UUID[]
    if (selectedCategoryIds.length > MAX_CATEGORIES_IN_TASK) {
      showToast(`No puedes añadir más de ${MAX_CATEGORIES_IN_TASK} categorías`, {
        type: 'error',
        position: 'top-center'
      })
      return
    }
    const selectedCategories = categories.filter((cat) => selectedCategoryIds.includes(cat.id))
    setSelectedCats(selectedCategories)
    onCategoryChange?.(selectedCategories)
  }

  const renderValue = () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '4px 8px' }}>
      {selectedCats.map((category) => (
        <CategoryBadge key={category.id} category={category} sx={{ cursor: 'pointer' }} glow={false} />
      ))}
    </Box>
  )

  const renderIconComponent = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => setIsOpen((prev) => !prev)}>
      <ExpandMoreRounded
        sx={{
          marginRight: '14px',
          color: fontColor || ColorPalette.fontLight,
          transform: isOpen ? 'rotate(180deg)' : 'none'
        }}
      />
    </Box>
  )

  return (
    <FormControl sx={{ width: width || '100%' }}>
      <FormLabel
        sx={{
          color: fontColor ? `${fontColor}e8` : `${ColorPalette.fontLight}e8`,
          marginLeft: '8px',
          fontWeight: 500
        }}
      >
        Categoría
      </FormLabel>
      <StyledSelect
        multiple
        width={width}
        value={selectedCats.map((cat) => cat.id)}
        onChange={handleCategoryChange}
        open={isOpen}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        IconComponent={renderIconComponent}
        renderValue={renderValue}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 450,
              zIndex: 999999,
              padding: '0px 8px'
            }
          }
        }}
      >
        <CategorySelectHeader categories={categories} selectedCats={selectedCats} />
        <CategorySelection categories={categories} selectedCats={selectedCats} emojisStyle={emojisStyle} />
      </StyledSelect>
    </FormControl>
  )
}
