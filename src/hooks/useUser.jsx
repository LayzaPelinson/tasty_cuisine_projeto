import { createContext, useContext, useEffect, useState } from 'react'

const UserContext = createContext()

const DIET_OPTIONS = ['Vegetariano', 'Vegano', 'Sem Glúten', 'Low Carb', 'Proteína Alta']
const API_BASE = 'http://localhost:8080'


function normalizeUser(entity) {
  return {
    id: entity.codUser,
    name: entity.nome_completo,
    email: entity.gmail,
    age: entity.idade,
    funcao: entity.funcao,
    username: entity.nome_de_usuario,
    photo: entity.foto_perfil,
    preferences: entity.restricoesAlimentares
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
    chef: recipe.chef ?? recipe.chefName ?? recipe.chefe?.nomeUsuario ?? recipe.chefe?.nomeCompleto ?? 'Chefe',
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
  const [recipeStats, setRecipeStats] = useState({})
  const [favoritos, setFavoritos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRecipes()
  }, [])

  useEffect(() => {
    async function carregarUsuario() {
      const id = localStorage.getItem('userId')
      const funcao = localStorage.getItem('userFuncao')
      if (id && funcao) {
        const endpoint = funcao === 'Chefe' ? `${API_BASE}/chefe/${id}` : `${API_BASE}/usuario/${id}`
        const res = await fetch(endpoint)
        if (res.ok) {
          const body = await res.json()
          const normalized = normalizeUser(body)
          setUser(normalized)
          if (funcao === 'usuario') await loadFavoritos(normalized.id)
        }
      }
      setLoading(false) // só aqui!
    }
    loadRecipes()
    carregarUsuario()
  }, [])

  async function loadFavoritos(userId) {
    const res = await fetch(`${API_BASE}/favorito/findAll`)
    const data = await res.json()
    if (Array.isArray(data)) {
      setFavoritos(data.filter(f => String(f.usuario?.codUser) === String(userId)))
    }
  }
  async function toggleFavorito(receitaId) {
    if (!user) return
    const jaExiste = favoritos.find(f => String(f.receita?.codReceitas) === String(receitaId))
    if (jaExiste) {
      await fetch(`${API_BASE}/favorito/${jaExiste.codFavoritos}`, { method: 'DELETE' })
      setFavoritos(prev => prev.filter(f => f.codFavoritos !== jaExiste.codFavoritos))
    } else {
      const res = await fetch(`${API_BASE}/favorito`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: { codUser: user.id }, receita: { codReceitas: receitaId } })
      })
      const saved = await res.json()
      await loadFavoritos(String(user.id))
    }
  }

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
      const payload = {
        nome_completo: data.name || data.email,
        nome_de_usuario: data.email ? data.email.split('@')[0] : 'user' + Date.now(),
        idade: Number(data.age) || 18,
        gmail: data.email,
        senha: data.password,
        funcao: data.funcao,
        // 💡 CORRIGIDO: Deixando null temporariamente para ignorar a restrição CHECK do SQL Server
        restricoesAlimentares: null
      }

      const res = await fetch(`${API_BASE}/usuario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Falha ao realizar o cadastro');
      }

      const created = await res.json()
      const normalized = normalizeUser(created, created.funcao || data.funcao)
      setUser(normalized)

      return { ok: true, user: normalized }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  }

  async function reactivateAccount(email, password, funcao) {
    try {
      // 💡 ENDPOINT ÚNICO DE REATIVAR: Como a tabela é a mesma, o endpoint também é
      const res = await fetch(`${API_BASE}/usuario/reativar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha: password })
      })

      if (!res.ok) return { ok: false }
      const body = await res.json()
      setUser(normalizeUser(body, body.funcao || funcao))
      return { ok: true }
    } catch {
      return { ok: false }
    }
  }

  async function login(email, password, funcao) {
    try {
      // 💡 OBSERVAÇÃO: Se seu Spring Boot tiver endpoints separados para login de chefe, 
      // mude a URL dinamicamente aqui usando a variável 'funcao'. 
      // Caso o endpoint '/usuario/login' valide ambos, o código abaixo está perfeito.
      const res = await fetch(`${API_BASE}/usuario/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha: password })
      })

      if (res.status === 403) return 'inactive'
      if (!res.ok) return false

      const body = await res.json()

      // Passamos a funcao para garantir que o objeto normalizado saiba quem ele é
      const normalized = normalizeUser(body, funcao)
      setUser(normalized)

      localStorage.setItem('userId', String(normalized.id))
      localStorage.setItem('userFuncao', normalized.funcao)

      if (typeof loadFavoritos === 'function') {
        await loadFavoritos(normalized.id)
      }

      return true
    } catch {
      return false
    }
  }

  async function reactivateAccount(email, password, funcao) {
    try {
      const endpoint = funcao === 'Chefe' ? `${API_BASE}/chefe/reativar` : `${API_BASE}/usuario/reativar`
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha: password })
      })
      if (!res.ok) return { ok: false }
      const body = await res.json()
      setUser(normalizeUser(body, funcao))
      return { ok: true }
    } catch {
      return { ok: false }
    }
  }
  async function deactivateAccount() {
    if (!user) return { ok: false }
    try {
      const endpoint = user.funcao === 'Chefe'
        ? `${API_BASE}/chefe/inativar/${user.id}`
        : `${API_BASE}/usuario/delete/${user.id}`
      const res = await fetch(endpoint, { method: 'PUT' })
      if (!res.ok) return { ok: false }
      setUser(null)
      return { ok: true }
    } catch {
      return { ok: false }
    }
  }

  async function changePassword(currentPassword, newPassword) {
    if (!user) return { ok: false }
    try {
      const endpoint = user.funcao === 'Chefe' ? `${API_BASE}/chefe/${user.id}` : `${API_BASE}/usuario/${user.id}`
      const payload = user.funcao === 'Chefe'
        ? { nomeUsuario: user.username, nomeCompleto: user.name, idade: user.age, gmail: user.email, senha: newPassword }
        : { nomeCompleto: user.name, nomeDeUsuario: user.username, idade: user.age, gmail: user.email, senha: newPassword, restricoesAlimentares: user.preferences?.join(',') ?? null }
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) return { ok: false }
      return { ok: true }
    } catch {
      return { ok: false }
    }
  }

  async function updateChefProfile(updated) {
    if (!user || user.funcao !== 'Chefe') return { ok: false, error: 'Usuário inválido' }
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
      const normalized = normalizeUser(updatedChef, 'Chefe')
      setUser(prev => ({ ...prev, ...normalized }))
      return { ok: true, user: normalized }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  }

  async function updateUserProfile(updated) {
    if (!user || user.funcao !== 'usuario') return { ok: false, error: 'Usuário inválido' }
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
    try {
      console.log("DEBUG - Usuário logado no React:", user);
      let textoPreparo = '';
      if (Array.isArray(recipe.instructions)) {
        textoPreparo = recipe.instructions.join('\n');
      } else {
        textoPreparo = recipe.instructions || recipe.modoPreparo || recipe.modo_preparo || '';
      }

      if (!textoPreparo.trim()) {
        textoPreparo = "Modo de preparo não informado.";
      }

      const payload = {
        nomeReceita: recipe.title || recipe.nomeReceita || 'Receita Sem Título',
        descricao: recipe.description || recipe.descricao || '',
        fotoReceita: recipe.image || recipe.fotoReceita || null,

        // Certifique-se de que o nome dessa chave seja exatamente igual ao atributo do seu DTO/Entity Java
        ingredientes: JSON.stringify(
          Array.isArray(recipe.ingredients)
            ? recipe.ingredients
            : ["Ingrediente não informado"]
        ),

        // Certifique-se de que o nome dessa chave seja exatamente igual ao atributo do seu DTO/Entity Java
        modo_preparo: JSON.stringify(
          Array.isArray(recipe.instructions)
            ? recipe.instructions
            : [textoPreparo]
        ),

        restricao: Number(recipe.restricao || 15),
        usuario: {
          codUser: Number(user?.id || user?.codUsuario)
        }
      }

      // 1. Salva a receita básica
      const res = await fetch(`${API_BASE}/receita`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        console.log("PAYLOAD:", payload);
        const errorText = await res.text()
        throw new Error(errorText || 'Falha ao publicar receita')
      }

      // Pegamos a receita salva que voltou do banco (ela contém o codReceitas)
      const saved = await res.json()
      const idReceitaSalva = saved.codReceitas;

      // 2. Vincula as categorias (assumindo que recipe.categorias seja um array de IDs, ex: [1, 3, 5])
      if (recipe.categorias && Array.isArray(recipe.categorias)) {
        for (const codCategoria of recipe.categorias) {
          // Seu endpoint espera: /categoria/adicionar/{codCategoria}/{receita}
          // Nota: Como o backend pede o objeto Receita no @PathVariable (ou o ID, dependendo de como o Spring converte),
          // passamos o id da receita no lugar do parâmetro {receita}
          const resCategoria = await fetch(`${API_BASE}/categoria/adicionar/${codCategoria}/${idReceitaSalva}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
          });

          if (!resCategoria.ok) {
            console.warn(`Não foi possível associar a categoria ${codCategoria} à receita.`);
          }
        }
      }

      // 3. Atualiza o estado local do React
      const normalized = normalizeApiRecipe(saved)
      setRecipes(prev => [normalized, ...prev])
      setChefRecipes(prev => [normalized, ...prev])

      return { ok: true, recipe: normalized }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  }

  function logout() {
    setUser(null);
    setToken(null)
    localStorage.removeItem('userId')
    localStorage.removeItem('userfuncao')
  }

  async function deleteRecipe(id) {
    try {
      const res = await fetch(`${API_BASE}/receita/${id}`, { method: 'DELETE' })
      if (!res.ok) return { ok: false }
      setChefRecipes(prev => prev.filter(r => r.id !== id))
      setRecipes(prev => prev.filter(r => r.id !== id))
      return { ok: true }
    } catch {
      return { ok: false }
    }
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
    <UserContext.Provider value={{ user, token, setUser, DIET_OPTIONS, register, login, reactivateAccount, deactivateAccount, changePassword, updateChefProfile, updateUserProfile, logout, recipes, recipesLoaded, chefRecipes, publishRecipe, deleteRecipe, editRecipe, recipeStats, trackFavorite, trackView, favoritos, toggleFavorito, loading }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
