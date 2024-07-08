import { GitHub, ImageRounded, Language, Link, LinkedIn, Reddit, X, YouTube } from '@mui/icons-material'
import { Tooltip } from '@mui/material'
import { memo, useContext } from 'react'
import { DESCRIPTION_SHORT_LENGTH, URL_REGEX } from '../../constants'
import { TaskContext } from '../../contexts/TaskContext'
import { useResponsiveDisplay } from '../../hooks/useResponsiveDisplay'
import type { Task } from '../../types/user'
import { DescriptionLink, ShowMoreBtn, YouTubeThumbnail } from './Tasks.styled'

interface RenderTaskDescriptionProps {
  task: Task
}

/**
 * Función para renderizar la descripción de la tarea con enlaces.
 */
export const RenderTaskDescription = memo(({ task }: RenderTaskDescriptionProps): JSX.Element | null => {
  const { expandedTasks, toggleShowMore, highlightMatchingText } = useContext(TaskContext)
  const isMobile = useResponsiveDisplay()

  if (!task || !task.description) {
    return null
  }

  const { description, color, id } = task

  const hasLinks = description.match(URL_REGEX)

  const isExpanded = expandedTasks.has(id)
  const highlightedDescription = isExpanded || hasLinks ? description : description.slice(0, DESCRIPTION_SHORT_LENGTH)

  const parts = highlightedDescription.split(URL_REGEX)

  interface DomainMappings {
    regex: RegExp
    domainName?: string
    icon: JSX.Element
  }

  const domainMappings: DomainMappings[] = [
    {
      regex: /(m\.)?youtu(\.be|be\.com)/,
      domainName: 'YouTube',
      icon: <YouTube />
    },
    {
      regex: /(twitter\.com|x\.com)/,
      domainName: 'X',
      icon: <X sx={{ fontSize: '18px' }} />
    },
    {
      regex: /github\.com/,
      domainName: 'GitHub',
      icon: <GitHub sx={{ fontSize: '20px' }} />
    },
    { regex: /reddit\.com/, domainName: 'Reddit', icon: <Reddit /> },
    { regex: /linkedin\.com/, domainName: 'LinkedIn', icon: <LinkedIn /> },
    { regex: /localhost/, icon: <Language /> },
    { regex: /.*/, icon: <Link /> } // Icono predeterminado para otros dominios
  ]

  const descriptionWithLinks = parts.map((part, index) => {
    if (index % 2 === 0) {
      return highlightMatchingText(part)
    }
    let domain = ''
    let icon: JSX.Element = <Link />

    try {
      const url = new URL(part)
      domain = url.hostname.replace('www.', '')
      // Buscar el icono correspondiente para el dominio
      const mapping = domainMappings.find(({ regex }) => domain.match(regex))
      icon = mapping ? mapping.icon : <Link /> // Por defecto, utilizar el icono de enlace
      domain = mapping?.domainName ? mapping.domainName : url.hostname.replace('www.', '')
    } catch (_error) {
      // Si falla la construcción de la URL
      console.error('URL inválida:', part)
    }

    // Comprobar si la parte coincide con alguna extensión de archivo de imagen
    if (part.match(/\.(jpeg|jpg|gif|png|bmp|svg|tif|tiff|webp)$/)) {
      icon = <ImageRounded />
    }

    const youtubeId = (youtubeLink: string) =>
      youtubeLink.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)?.[1] || null

    return (
      <Tooltip
        title={
          <>
            <span style={{ wordBreak: 'break-all' }}>{part}</span>
            {part.match(domainMappings[0].regex) && youtubeId(part) && !isMobile && (
              <YouTubeThumbnail>
                <img src={`https://i.ytimg.com/vi/${youtubeId(part)}/hqdefault.jpg`} alt='Miniatura de YouTube' loading='lazy' />
              </YouTubeThumbnail>
            )}
          </>
        }
        key={`${part}-${color}`}
      >
        <DescriptionLink role='link' data-href={part} clr={color} onClick={() => window.open(part)}>
          <div>
            {icon} {highlightMatchingText(domain)}
          </div>
        </DescriptionLink>
      </Tooltip>
    )
  })

  return (
    <div>
      {descriptionWithLinks}{' '}
      {task.description && task.description.length > DESCRIPTION_SHORT_LENGTH && !hasLinks && (
        <ShowMoreBtn onClick={() => toggleShowMore(task.id)} clr={task.color}>
          {expandedTasks.has(task.id) ? 'Mostrar menos' : 'Mostrar más'}
        </ShowMoreBtn>
      )}
    </div>
  )
})
