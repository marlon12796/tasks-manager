import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Loading } from './components'

const Home = lazy(() => import('./pages/Home'))
const TaskDetails = lazy(() => import('./pages/TaskDetails'))
const SharePage = lazy(() => import('./pages/Share'))
const AddTask = lazy(() => import('./pages/AddTask'))
const UserProfile = lazy(() => import('./pages/UserProfile'))
const ImportExport = lazy(() => import('./pages/ImportExport'))
const Categories = lazy(() => import('./pages/Categories'))
const Purge = lazy(() => import('./pages/Purge'))
const NotFound = lazy(() => import('./pages/NotFound'))

const AppRouter = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path='' element={<Home />} />
        <Route path='/task/:id' element={<TaskDetails />} />
        <Route path='/share' element={<SharePage />} />
        <Route path='/add' element={<AddTask />} />
        <Route path='/user' element={<UserProfile />} />
        <Route path='/transfer' element={<ImportExport />} />
        <Route path='/categories' element={<Categories />} />
        <Route path='/purge' element={<Purge />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default AppRouter
