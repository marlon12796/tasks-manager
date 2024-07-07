import { Button } from '@mui/material'
import { NoCategories } from './CategorySelect.styled'
import { type NavigateFunction } from 'react-router-dom'

export const NonCategory = ({ n }: { n: NavigateFunction }) => {
  return (
    <NoCategories disableTouchRipple>
      <p>No tienes ninguna categoria</p>
      <Button
        fullWidth
        variant='outlined'
        onClick={() => {
          n('/categories')
        }}
      >
        Add Category
      </Button>
    </NoCategories>
  )
}
