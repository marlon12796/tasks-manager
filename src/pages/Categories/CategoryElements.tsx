import { Delete, Edit } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/material'
import { Emoji } from 'emoji-picker-react'
import { ActionButton, CategoryContent, CategoryElement, CategoryElementsContainer } from '../../styles'
import { useContext } from 'react'
import { UserContext } from '../../contexts/UserContext'
import { UUID } from '@/types/user'
interface CategoryElementsTypes {
  onOpenDeleteDialog: () => void
  onCloseDeleteDialog: () => void
  onChangeCategoryId: (value: UUID) => void
  onDelete: (categoryId: UUID | undefined) => void
  onOpenEditDialog: () => void
}
export const CategoryElements = ({
  onChangeCategoryId,
  onOpenEditDialog,
  onOpenDeleteDialog,
  onDelete
}: CategoryElementsTypes) => {
  const { user } = useContext(UserContext)
  return (
    <CategoryElementsContainer>
      {user.categories.map((category) => {
        const categoryTasks = user.tasks.filter((task) => task.category?.some((cat) => cat.id === category.id))

        const completedTasksCount = categoryTasks.reduce((count, task) => (task.done ? count + 1 : count), 0)
        const totalTasksCount = categoryTasks.length
        const completionPercentage = totalTasksCount > 0 ? Math.floor((completedTasksCount / totalTasksCount) * 100) : 0

        const displayPercentage = totalTasksCount > 0 ? `(${completionPercentage}%)` : ''

        return (
          <CategoryElement key={category.id} clr={category.color}>
            <CategoryContent translate='no'>
              <span>{category.emoji && <Emoji unified={category.emoji} emojiStyle={user.emojisStyle} />}</span>
              &nbsp;
              <span style={{ wordBreak: 'break-all', fontWeight: 600 }}>{category.name}</span>
              {totalTasksCount > 0 && (
                <Tooltip title='Porcentaje de completado de las tareas asignadas a esta categoría'>
                  <span style={{ opacity: 0.8, fontStyle: 'italic' }}>{displayPercentage}</span>
                </Tooltip>
              )}
            </CategoryContent>
            <div style={{ display: 'flex', gap: '4px' }}>
              <ActionButton>
                <IconButton
                  color='primary'
                  onClick={() => {
                    onChangeCategoryId(category.id)
                    onOpenEditDialog()
                  }}
                >
                  <Edit />
                </IconButton>
              </ActionButton>
              <ActionButton>
                <IconButton
                  color='error'
                  onClick={() => {
                    onChangeCategoryId(category.id)
                    totalTasksCount > 0 ? onOpenDeleteDialog : onDelete(category.id)
                  }}
                >
                  <Delete />
                </IconButton>
              </ActionButton>
            </div>
          </CategoryElement>
        )
      })}
    </CategoryElementsContainer>
  )
}
