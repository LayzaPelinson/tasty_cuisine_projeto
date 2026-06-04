import { createContext, useContext, useState } from 'react'

const UserContext = createContext()

const DIET_OPTIONS = ['Vegetariano', 'Vegano', 'Sem Glúten', 'Low Carb', 'Proteína Alta']

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [accounts, setAccounts] = useState([])

  function register(data) {
    const newAccount = { ...data, id: Date.now() }
    setAccounts(prev => [...prev, newAccount])
    setUser(newAccount)
  }

  function login(email, password, role) {
    const found = accounts.find(a => a.email === email && a.password === password && a.role === role)
    if (found) { setUser(found); return true }
    return false
  }

  function logout() { setUser(null) }

  return (
    <UserContext.Provider value={{ user, setUser, DIET_OPTIONS, register, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
