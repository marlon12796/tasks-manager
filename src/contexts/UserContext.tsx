import { createContext } from 'react'
import { defaultUser } from '../constants/defaultUser'
import type { User } from '../types/user'

interface UserProps {
  user: User // User data
  setUser: React.Dispatch<React.SetStateAction<User>> // Function to update user data
}

// biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
export const UserContext = createContext<UserProps>({ user: defaultUser, setUser: () => {} })
