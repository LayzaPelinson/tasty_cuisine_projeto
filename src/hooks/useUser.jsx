import { createContext, useContext, useEffect, useState } from 'react'

const UserContext = createContext()

const DIET_OPTIONS = ['Vegetariano', 'Vegano', 'Sem Glúten', 'Low Carb', 'Proteína Alta']
const API_BASE = 'http://localhost:8080'

function normalizeUser(entity, role) {
  return {
    id: entity.id ?? entity.codChefe ?? entity.codUser,
    name: entity.name ?? entity.nomeCompleto ?? entity.nomeUsuario ?? entity.fullName,
    email: entity.email ?? entity.gmail,
    age: entity.age ?? entity.idade,
    role,
    username: entity.username ?? entity.nomeUsuario ?? entity.nomeDeUsuario,
    photo: entity.photo ?? entity.fotoPerfil,
    preferences: entity.preferences ?? entity.restricoesAlimentares
      ? entity.restricoesAlimentares.split(',').map(pref => pref.trim()).filter(Boolean)
      : [],
  }
}

function parseJsonOrLines(value) {
  if (!value) return []
  if (Array.isArray(value)) return value
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : [parsed]
  } catch {
    return value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)
  }
}

function normalizeApiRecipe(recipe) {
  return {
    id: recipe.id ?? recipe.codReceitas,
    title: recipe.title ?? recipe.nomeReceita,
    description: recipe.description ?? recipe.descricao,
    category: recipe.category ?? recipe.categoria ?? 'Geral',
    difficulty: recipe.difficulty ?? recipe.dificuldade ?? 'Médio',
    time: recipe.time ?? recipe.tempo ?? '',
    chef: recipe.chef ?? recipe.chefName ?? recipe.chefe?.nomeUsuario ?? recipe.chefe?.nomeCompleto ?? 'Chef',
    chefId: recipe.chefId ?? recipe.chefe?.codChefe,
    ingredients: parseJsonOrLines(recipe.ingredients ?? recipe.ingredientes),
    instructions: parseJsonOrLines(recipe.instructions ?? recipe.modoPreparo ?? recipe.manual2),
    chefTip: recipe.chefTip ?? recipe.dica ?? '',
    image: recipe.image ?? null,
  }
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [recipes, setRecipes] = useState([])
  const [recipesLoaded, setRecipesLoaded] = useState(false)
  const [chefRecipes, setChefRecipes] = useState([])
  const [recipeStats, setRecipeStats] = useState({}) // { recipeId: { favorites: 0, views: 0 } }

  useEffect(() => {
    loadRecipes()
  }, [])

  async function loadRecipes() {
    try {
      const res = await fetch(`${API_BASE}/receita/findAll`)
      if (!res.ok) throw new Error('Falha ao carregar receitas')
      const data = await res.json()
      const normalized = Array.isArray(data) ? data.map(normalizeApiRecipe) : []
      setRecipes(normalized)
      setRecipesLoaded(true)
      return normalized
    } catch (err) {
      console.error('Erro ao carregar receitas:', err)
      setRecipesLoaded(true)
      return []
    }
  }

  async function register(data) {
    try {
      if (data.role === 'chef') {
        const payload = {
          nomeUsuario: data.email ? data.email.split('@')[0] : 'chef' + Date.now(),
          nomeCompleto: data.name || data.email,
          idade: Number(data.age) || 18,
          senha: data.password,
          gmail: data.email,
        }
        const res = await fetch(`${API_BASE}/chefe`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        })
        if (!res.ok) throw new Error('Falha ao cadastrar chefe')
        const created = await res.json()
        const normalized = normalizeUser(created, 'chef')
        setUser(normalized)
        return { ok: true, user: normalized }
      } else {
        const payload = {
          nomeCompleto: data.name || data.email,
          nomeDeUsuario: data.email ? data.email.split('@')[0] : 'user' + Date.now(),
          idade: Number(data.age) || 18,
          gmail: data.email,
          senha: data.password,
          restricoesAlimentares: data.preferences ? data.preferences.join(',') : null
        }
        const res = await fetch(`${API_BASE}/usuario`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        })
        if (!res.ok) throw new Error('Falha ao cadastrar usuário')
        const created = await res.json()
        const normalized = normalizeUser(created, 'usuario')
        setUser(normalized)
        return { ok: true, user: normalized }
      }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  }

  async function login(email, password, role) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, role })
      })
      if (!res.ok) return false
      const body = await res.json()
      setToken(body.token)
      setUser(normalizeUser(body.user, role))
      return true
    } catch (err) {
      return false
    }
  }

  async function updateChefProfile(updated) {
    if (!user || user.role !== 'chef') return { ok: false, error: 'Usuário inválido' }
    try {
      const payload = {
        nomeUsuario: updated.username || user.username || (updated.name ? updated.name.split(' ')[0] : undefined),
        nomeCompleto: updated.name,
        idade: Number(updated.age) || user.age,
        gmail: updated.email,
      }
      const res = await fetch(`${API_BASE}/chefe/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const errorText = await res.text()
        return { ok: false, error: errorText || 'Falha ao atualizar perfil' }
      }
      const updatedChef = await res.json()
      const normalized = normalizeUser(updatedChef, 'chef')
      setUser(prev => ({ ...prev, ...normalized }))
      return { ok: true, user: normalized }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  }

  async function updateUserProfile(updated) {
    if (!user || user.role !== 'usuario') return { ok: false, error: 'Usuário inválido' }
    try {
      const payload = {
        nomeCompleto: updated.name || user.name,
        nomeDeUsuario: user.username,
        idade: Number(updated.age ?? user.age) || user.age,
        gmail: updated.email || user.email,
        senha: updated.password ?? null,
        restricoesAlimentares: updated.preferences ? updated.preferences.join(',') : user.preferences?.join(',') ?? null,
      }
      const res = await fetch(`${API_BASE}/usuario/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const errorText = await res.text()
        return { ok: false, error: errorText || 'Falha ao atualizar perfil' }
      }
      const updatedUser = await res.json()
      const normalized = normalizeUser(updatedUser, 'usuario')
      setUser(prev => ({ ...prev, ...normalized }))
      return { ok: true, user: normalized }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  }

  async function publishRecipe(recipe) {
    if (!user || user.role !== 'chef') {
      return { ok: false, error: 'Apenas chefs podem publicar receitas.' }
    }

    try {
      const payload = {
        title: recipe.title,
        description: recipe.description,
        category: recipe.category,
        difficulty: recipe.difficulty,
        time: recipe.time,
        chefTip: recipe.chefTip,
        chefId: user.id,
        ingredients: recipe.ingredients || [],
        instructions: recipe.instructions || [],
      }
      const res = await fetch(`${API_BASE}/receita`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText || 'Falha ao publicar receita')
      }
      const saved = await res.json()
      const normalized = normalizeApiRecipe(saved)
      setRecipes(prev => [normalized, ...prev])
      setChefRecipes(prev => [normalized, ...prev])
      return { ok: true, recipe: normalized }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  }

  function logout() { setUser(null); setToken(null) }

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
    <UserContext.Provider value={{ user, token, setUser, DIET_OPTIONS, register, login, updateChefProfile, updateUserProfile, logout, recipes, recipesLoaded, chefRecipes, publishRecipe, deleteRecipe, editRecipe, recipeStats, trackFavorite, trackView }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
