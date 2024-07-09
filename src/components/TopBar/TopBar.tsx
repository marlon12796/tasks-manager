import { useNavigate } from 'react-router-dom'
import { TopBarArrowIcon, TopBarBackBtn, TopBarContainer, TopBarTitle } from './TopBar.styled'

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
    <TopBarContainer className=''>
      <TopBarBackBtn size='large' aria-label='Back' onClick={() => n('/')}>
        <TopBarArrowIcon />
      </TopBarBackBtn>
      <TopBarTitle>{title}</TopBarTitle>
    </TopBarContainer>
  )
}
