import type { ReactNode } from 'react'
import { ProfileSidebar } from '../components'
import { BottomNav } from '../components/BottomNav/BottomNav'

interface MainLayoutProps {
  children: ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <ProfileSidebar />
      {children}
      <div style={{ marginTop: '128px' }} />
      <BottomNav />
    </>
  )
}

export default MainLayout
