import { createContext, useContext, useState } from 'react'

const UserContext = createContext()

const DIET_OPTIONS = ['Vegetariano', 'Vegano', 'Sem Glúten', 'Low Carb', 'Proteína Alta']

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    name: 'Layza Pelinson',
    email: 'pelinsonlayza@gmail.com',
    photo: null,
    preferences: ['Vegetariano', 'Sem Glúten'],
  })

  return (
    <UserContext.Provider value={{ user, setUser, DIET_OPTIONS }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
