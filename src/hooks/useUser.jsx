import { createContext, useContext, useState } from 'react'

const UserContext = createContext()

const DIET_OPTIONS = ['Vegetariano', 'Vegano', 'Sem Glúten', 'Low Carb', 'Proteína Alta']

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [chefRecipes, setChefRecipes] = useState([])
  const [recipeStats, setRecipeStats] = useState({}) // { recipeId: { favorites: 0, views: 0 } }

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

  function changePassword(currentPassword, newPassword) {
    if (user.password !== currentPassword) return false
    setUser(u => ({ ...u, password: newPassword }))
    setAccounts(prev => prev.map(a => a.id === user.id ? { ...a, password: newPassword } : a))
    return true
  }

  function publishRecipe(recipe) {
    const newRecipe = { ...recipe, id: Date.now(), chefId: user.id, chef: user.name }
    setChefRecipes(prev => [...prev, newRecipe])
  }

  function deleteRecipe(id) {
    setChefRecipes(prev => prev.filter(r => r.id !== id))
  }

  function editRecipe(id, updated) {
    setChefRecipes(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r))
  }

  function trackFavorite(recipeId, added) {
    setRecipeStats(prev => {
      const cur = prev[recipeId] || { favorites: 0, views: 0 }
      return { ...prev, [recipeId]: { ...cur, favorites: Math.max(0, cur.favorites + (added ? 1 : -1)) } }
    })
  }

  function trackView(recipeId) {
    setRecipeStats(prev => {
      const cur = prev[recipeId] || { favorites: 0, views: 0 }
      if (cur._tracked) return prev
      return { ...prev, [recipeId]: { ...cur, views: cur.views + 1, _tracked: true } }
    })
  }

  return (
    <UserContext.Provider value={{ user, setUser, DIET_OPTIONS, register, login, logout, changePassword, chefRecipes, publishRecipe, deleteRecipe, editRecipe, recipeStats, trackFavorite, trackView }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
