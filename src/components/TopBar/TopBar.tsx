import { useNavigate } from 'react-router-dom'
import { ArrowIcon, BackBtn, ContainerBar, Title } from './TopBar.styled'

interface TopBarProps {
  title: string
}

/**
 * Component for displaying a top bar with a title and a back button.
 * @param {string} title - Title of page
 */
export const TopBar = ({ title }: TopBarProps) => {
  const n = useNavigate()
  return (
    <ContainerBar>
      <BackBtn size='large' aria-label='Back' onClick={() => n('/')}>
        <ArrowIcon />
      </BackBtn>
      <Title>{title}</Title>
    </ContainerBar>
  )
}
