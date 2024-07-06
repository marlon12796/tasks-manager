import { useTheme } from '@emotion/react'
import { Delete, DeleteRounded, Edit, SaveRounded } from '@mui/icons-material'
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip } from '@mui/material'
import { Emoji } from 'emoji-picker-react'
import { lazy, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ColorPicker, CustomEmojiPicker, TopBar } from '../components'
import { CATEGORY_NAME_MAX_LENGTH } from '../constants'
import { UserContext } from '../contexts/UserContext'
import { useStorageState } from '../hooks/useStorageState'
import {
  ActionButton,
  AddCategoryButton,
  AddContainer,
  CategoriesContainer,
  CategoryContent,
  CategoryElement,
  CategoryElementsContainer,
  CategoryInput,
  DialogBtn,
  EditNameInput
} from '../styles'
import { ColorPalette } from '../theme/themeConfig'
import type { Category, UUID } from '../types/user'
import { getFontColor, showToast } from '../utils'

const NotFound = lazy(() => import('./NotFound'))
const Categories = () => {
  const { user, setUser } = useContext(UserContext)
  const theme = useTheme()

  const [name, setName] = useStorageState<string>('', 'catName', 'sessionStorage')
  const [nameError, setNameError] = useState<string>('')
  const [emoji, setEmoji] = useStorageState<string | null>(null, 'catEmoji', 'sessionStorage')
  const [color, setColor] = useStorageState<string>(theme.primary, 'catColor', 'sessionStorage')

  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<UUID | undefined>()

  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)
  const [editName, setEditName] = useState<string>('')
  const [editNameError, setEditNameError] = useState<string>('')
  const [editEmoji, setEditEmoji] = useState<string | null>(null)
  const [editColor, setEditColor] = useState<string>(ColorPalette.purple)

  const n = useNavigate()

  useEffect(() => {
    document.title = 'Aplicación de Tareas - Categorías'
    if (!user.settings[0].enableCategories) {
      n('/')
    }
    if (name.length > CATEGORY_NAME_MAX_LENGTH) {
      setNameError(`El nombre es demasiado largo, máximo ${CATEGORY_NAME_MAX_LENGTH} caracteres`)
    }
  }, [n, name.length, user.settings])

  useEffect(() => {
    setEditColor(user.categories.find((cat) => cat.id === selectedCategoryId)?.color || ColorPalette.purple)
    setEditName(user.categories.find((cat) => cat.id === selectedCategoryId)?.name || '')
    setEditNameError('')
  }, [selectedCategoryId, user.categories])

  const handleDelete = (categoryId: UUID | undefined) => {
    if (categoryId) {
      const categoryName = user.categories.find((category) => category.id === categoryId)?.name || ''
      const updatedCategories = user.categories.filter((category) => category.id !== categoryId)
      // Eliminar la categoría de las tareas asociadas
      const updatedTasks = user.tasks.map((task) => {
        const updatedCategoryList = task.category?.filter((category) => category.id !== categoryId)
        return {
          ...task,
          category: updatedCategoryList
        }
      })

      setUser({
        ...user,
        categories: updatedCategories,
        tasks: updatedTasks
      })

      showToast(
        <div>
          Categoría eliminada - <b translate='no'>{categoryName}.</b>
        </div>
      )
    }
  }

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value
    setName(newName)
    if (newName.length > CATEGORY_NAME_MAX_LENGTH) {
      setNameError(`El nombre es demasiado largo (máximo ${CATEGORY_NAME_MAX_LENGTH} caracteres)`)
    } else {
      setNameError('')
    }
  }

  const handleEditNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value
    setEditName(newName)
    if (newName.length > CATEGORY_NAME_MAX_LENGTH) {
      setEditNameError(`El nombre es demasiado largo (máximo ${CATEGORY_NAME_MAX_LENGTH} caracteres)`)
    } else {
      setEditNameError('')
    }
  }

  const handleAddCategory = () => {
    if (name !== '') {
      if (name.length > CATEGORY_NAME_MAX_LENGTH) {
        return
      }
      const newCategory: Category = {
        id: crypto.randomUUID(),
        name,
        emoji: emoji !== '' && emoji !== null ? emoji : undefined,
        color
      }

      showToast(
        <div>
          Categoría agregada - <b translate='no'>{newCategory.name}</b>
        </div>
      )

      setUser((prevUser) => ({
        ...prevUser,
        categories: [...prevUser.categories, newCategory]
      }))

      setName('')
      setColor(theme.primary)
      setEmoji('')
    } else {
      showToast('El nombre de la categoría es requerido.', { type: 'error' })
    }
  }

  const handleEditDimiss = () => {
    setSelectedCategoryId(undefined)
    setOpenEditDialog(false)
    setEditColor(theme.primary)
    setEditName('')
    setEditEmoji(null)
  }

  const handleEditCategory = () => {
    if (selectedCategoryId) {
      const updatedCategories = user.categories.map((category) => {
        if (category.id === selectedCategoryId) {
          return {
            ...category,
            name: editName,
            emoji: editEmoji || undefined,
            color: editColor
          }
        }
        return category
      })

      const updatedTasks = user.tasks.map((task) => {
        const updatedCategoryList = task.category?.map((category) => {
          if (category.id === selectedCategoryId) {
            return {
              id: selectedCategoryId,
              name: editName,
              emoji: editEmoji || undefined,
              color: editColor
            }
          }
          return category
        })

        return {
          ...task,
          category: updatedCategoryList
        }
      })

      setUser({
        ...user,
        categories: updatedCategories,
        tasks: updatedTasks
      })

      showToast(
        <div>
          Categoría actualizada - <b translate='no'>{editName}</b>
        </div>
      )

      setOpenEditDialog(false)
    }
  }

  if (!user.settings[0].enableCategories) {
    return <NotFound message='Las categorías no están habilitadas.' />
  }

  return (
    <>
      <TopBar title='Categorías' />
      <CategoriesContainer>
        {user.categories.length > 0 ? (
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
                          setSelectedCategoryId(category.id)
                          setOpenEditDialog(true)
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </ActionButton>
                    <ActionButton>
                      <IconButton
                        color='error'
                        onClick={() => {
                          setSelectedCategoryId(category.id)
                          if (totalTasksCount > 0) {
                            // Abrir diálogo de eliminación si hay tareas asociadas a la categoría
                            setOpenDeleteDialog(true)
                          } else {
                            // Si no hay tareas asociadas, eliminar directamente
                            handleDelete(category.id)
                          }
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
        ) : (
          <p>No tienes ninguna categoría</p>
        )}
        <AddContainer>
          <h2>Agregar Nueva Categoría</h2>
          <CustomEmojiPicker emoji={typeof emoji === 'string' ? emoji : undefined} setEmoji={setEmoji} color={color} />
          <CategoryInput
            focused
            required
            label='Nombre de la categoría'
            placeholder='Ingrese el nombre de la categoría'
            value={name}
            onChange={handleNameChange}
            error={nameError !== ''}
            helperText={name == '' ? undefined : !nameError ? `${name.length}/${CATEGORY_NAME_MAX_LENGTH}` : nameError}
          />
          {/* <Typography>Color</Typography> */}
          <ColorPicker
            color={color}
            onColorChange={(color) => {
              setColor(color)
            }}
            width={360}
            fontColor={getFontColor(theme.secondary)}
          />
          <AddCategoryButton onClick={handleAddCategory} disabled={name.length > CATEGORY_NAME_MAX_LENGTH}>
            Crear Categoría
          </AddCategoryButton>
        </AddContainer>
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          PaperProps={{
            style: {
              borderRadius: '24px',
              padding: '12px',
              maxWidth: '600px'
            }
          }}
        >
          <DialogTitle>
            Confirmar eliminación de <b>{user.categories.find((cat) => cat.id === selectedCategoryId)?.name}</b>
          </DialogTitle>

          <DialogContent>Esto eliminará la categoría de tu lista y las tareas asociadas.</DialogContent>

          <DialogActions>
            <DialogBtn onClick={() => setOpenDeleteDialog(false)}>Cancelar</DialogBtn>
            <DialogBtn
              onClick={() => {
                handleDelete(selectedCategoryId)
                setOpenDeleteDialog(false)
              }}
              color='error'
            >
              <DeleteRounded /> &nbsp; Eliminar
            </DialogBtn>
          </DialogActions>
        </Dialog>
        {/* Diálogo de Edición */}
        <Dialog
          open={openEditDialog}
          onClose={handleEditDimiss}
          PaperProps={{
            style: {
              borderRadius: '24px',
              padding: '12px',
              maxWidth: '600px'
            }
          }}
        >
          <DialogTitle>
            Editar Categoría
            {/* <b>{user.categories.find((cat) => cat.id === selectedCategoryId)?.name}</b> */}
          </DialogTitle>

          <DialogContent>
            <CustomEmojiPicker
              emoji={user.categories.find((cat) => cat.id === selectedCategoryId)?.emoji || undefined}
              setEmoji={setEditEmoji}
              width={300}
              color={editColor}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column'
              }}
            >
              <EditNameInput
                label='Ingrese el nombre de la categoría'
                placeholder='Ingrese el nombre de la categoría'
                value={editName}
                error={editNameError !== '' || editName.length === 0}
                onChange={handleEditNameChange}
                helperText={
                  editNameError
                    ? editNameError
                    : editName.length === 0
                      ? 'El nombre de la categoría es requerido'
                      : `${editName.length}/${CATEGORY_NAME_MAX_LENGTH}`
                }
              />
              <ColorPicker
                color={editColor}
                width='300px'
                fontColor={theme.darkmode ? ColorPalette.fontLight : ColorPalette.fontDark}
                onColorChange={(clr) => {
                  setEditColor(clr)
                }}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <DialogBtn onClick={handleEditDimiss}>Cancelar</DialogBtn>
            <DialogBtn onClick={handleEditCategory} disabled={editNameError !== '' || editName.length === 0}>
              <SaveRounded /> &nbsp; Guardar
            </DialogBtn>
          </DialogActions>
        </Dialog>
      </CategoriesContainer>
    </>
  )
}

export default Categories
