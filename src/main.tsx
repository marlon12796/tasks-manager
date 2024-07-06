import { initColors } from 'ntc-ts'
import { ORIGINAL_COLORS } from 'ntc-ts'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { UserContextProvider } from './contexts/UserProvider.tsx'

initColors(ORIGINAL_COLORS)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <UserContextProvider>
      <App />
    </UserContextProvider>
  </BrowserRouter>
)
