import { Clear, Done } from '@mui/icons-material'
import { Emoji } from 'emoji-picker-react'
import { getColorName } from 'ntc-ts'
import { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'
import { PathName } from '../styles'
import NotFound from './NotFound'
import { CategoryBadge } from '../components/CategoryBadge/CategoryBadge'
import {
  ContainerTaksDetails,
  CategoryContainer,
  ColorSquare,
  TableData,
  TableHeader,
  TableRow,
  TaskName,
  TaskTable
} from './TaskDetails/TaskDetails.styled'
import { TopBar } from '../components'
const TaskDetails = () => {
  const { user } = useContext(UserContext)
  const { tasks, emojisStyle } = user
  const { id } = useParams()
  const formattedId = id?.replace('.', '')
  const task = tasks.find((task) => task.id.toString().replace('.', '') === formattedId)

  useEffect(() => {
    document.title = `Aplicación de Tareas - ${task?.name || 'Detalles de la Tarea'}`
  }, [task?.name])

  if (!task) {
    return (
      <NotFound
        message={
          <div>
            La tarea con ID <PathName>{formattedId}</PathName> no se encontró.
          </div>
        }
      />
    )
  }

  const dateFormatter = new Intl.DateTimeFormat(navigator.language, {
    dateStyle: 'full',
    timeStyle: 'short'
  })

  return (
    <>
      <TopBar title='Detalles de la Tarea' />
      <ContainerTaksDetails>
        <TaskName>
          Tarea: <span translate='no'>{task.name}</span>
        </TaskName>
        <TaskTable>
          <tbody>
            <TableRow>
              <TableHeader>Emoji:</TableHeader>
              <TableData>
                {task.emoji ? (
                  <>
                    <Emoji unified={task?.emoji || ''} size={32} emojiStyle={emojisStyle} /> ({task.emoji})
                  </>
                ) : (
                  <i>ninguno</i>
                )}
              </TableData>
            </TableRow>
            <TableRow>
              <TableHeader>ID:</TableHeader>
              <TableData>{task?.id}</TableData>
            </TableRow>
            <TableRow>
              <TableHeader>Descripción:</TableHeader>
              <TableData translate='no'>{task?.description}</TableData>
            </TableRow>
            <TableRow>
              <TableHeader>Color:</TableHeader>
              <TableData>
                <ColorSquare clr={task.color} />
                {getColorName(task.color).name} ({task.color.toUpperCase()})
              </TableData>
            </TableRow>
            <TableRow>
              <TableHeader>Creado:</TableHeader>
              <TableData>{dateFormatter.format(new Date(task.date))}</TableData>
            </TableRow>
            {task?.lastSave && (
              <TableRow>
                <TableHeader>Última edición:</TableHeader>
                <TableData>{dateFormatter.format(new Date(task.lastSave))}</TableData>
              </TableRow>
            )}
            {task?.deadline && (
              <TableRow>
                <TableHeader>Fecha límite:</TableHeader>
                <TableData>{dateFormatter.format(new Date(task.deadline))}</TableData>
              </TableRow>
            )}
            <TableRow>
              <TableHeader>Completado:</TableHeader>
              <TableData>
                {task?.done ? <Done /> : <Clear />} {task?.done.toString()}
              </TableData>
            </TableRow>
            <TableRow>
              <TableHeader>Fijado:</TableHeader>
              <TableData>
                {task?.pinned ? <Done /> : <Clear />} {task?.pinned.toString()}
              </TableData>
            </TableRow>
            {task?.sharedBy && (
              <TableRow>
                <TableHeader>Compartido por: </TableHeader>
                <TableData>{task.sharedBy}</TableData>
              </TableRow>
            )}
            {task.category && task.category.length > 0 && (
              <TableRow>
                <TableHeader>Categorías:</TableHeader>
                <TableData>
                  <CategoryContainer>
                    {task?.category?.map((category) => (
                      <CategoryBadge key={category.id} category={category} glow={false} />
                    ))}
                  </CategoryContainer>
                </TableData>
              </TableRow>
            )}
          </tbody>
        </TaskTable>
      </ContainerTaksDetails>
    </>
  )
}

export default TaskDetails
