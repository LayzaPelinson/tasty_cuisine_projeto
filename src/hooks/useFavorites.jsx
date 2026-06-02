import { createContext, useContext, useState } from 'react'

const FavoritesContext = createContext()

function getStored(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || []
  } catch {
    return []
  }
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => getStored('favorites'))
  const [history, setHistory] = useState(() => getStored('history'))

  function toggle(id) {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
      localStorage.setItem('favorites', JSON.stringify(next))
      return next
    })
  }

  function isFavorite(id) {
    return favorites.includes(id)
  }

  function addToHistory(id) {
    setHistory((prev) => {
      const next = [id, ...prev.filter((h) => h !== id)]
      localStorage.setItem('history', JSON.stringify(next))
      return next
    })
  }

  return (
    <FavoritesContext.Provider value={{ favorites, toggle, isFavorite, history, addToHistory }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  return useContext(FavoritesContext)
}
