import { SelectedNames, HeaderMenuItem } from './CategorySelect.styled'
import { MAX_CATEGORIES_IN_TASK } from '../../constants'
import { Category } from '../../types/user'

interface CategorySelectHeaderProps {
  selectedCats: Category[]
  categories: Category[]
}

export const CategorySelectHeader: React.FC<CategorySelectHeaderProps> = ({ selectedCats, categories }) => (
  <HeaderMenuItem disabled>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <b>
        Selecciona Categorías{' '}
        <span
          style={{
            transition: '.3s color',
            color: selectedCats.length >= MAX_CATEGORIES_IN_TASK ? '#f34141' : 'currentcolor'
          }}
        >
          {categories.length > 3 && <span>(max {MAX_CATEGORIES_IN_TASK})</span>}
        </span>
      </b>
      {selectedCats.length > 0 && (
        <SelectedNames>
          Seleccionadas{' '}
          {selectedCats.length > 0 &&
            new Intl.ListFormat('es', {
              style: 'long',
              type: 'conjunction'
            }).format(selectedCats.map((category) => category.name))}
        </SelectedNames>
      )}
    </div>
  </HeaderMenuItem>
)
