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
    photo: entity.foto_perfil,
    preferences: entity.restricoesAlimentares
      ? entity.restricoesAlimentares.split(',').map(pref => pref.trim()).filter(Boolean)
      : [],
    bloqueado: entity.bloqueado === 'ATIVO',
  }
}

function parseJsonOrLines(value) {
  if (!value) return []
  if (Array.isArray(value)) {
    return value.map(item => typeof item === 'object' ? (item.nomeIngredient || item.nome || JSON.stringify(item)) : item);
  }
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) {
      return parsed.map(item => {
        if (typeof item === 'object' && item !== null) {
          return item.nomeIngredient || item.nome || Object.values(item)[0];
        }
        return item;
      });
    }
    return [parsed]
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
    time: recipe.time ?? recipe.tempo ?? recipe.tempoPreparo ?? '',
    chef: recipe.chef ?? recipe.chefName ?? recipe.usuario?.nome_completo ?? recipe.usuario?.nome_de_usuario ?? recipe.chefe?.nomeCompleto ?? recipe.chefe?.nomeUsuario ?? 'Desconhecido',
    chefId: recipe.chefId ?? recipe.chefe?.codChefe,
    ingredients: parseJsonOrLines(recipe.ingredients ?? recipe.ingredientes),
    instructions: parseJsonOrLines(recipe.instructions ?? recipe.modo_preparo ?? recipe.manual2),
    chefTip: recipe.chefTip ?? recipe.dica ?? '',
    image: recipe.fotoReceita ?? null,
    active: recipe.status_receita === 'ATIVO',
    blockedUser: recipe.usuario?.bloqueado,
    activeUser: recipe.usuario?.status_Usuario,
    tempoPreparo: recipe.tempoPreparo ?? recipe.prepTime ?? 'Rápido',
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
        const endpoint = `${API_BASE}/usuario/${id}`
        const res = await fetch(endpoint)
        if (res.ok) {
          const body = await res.json()
          const normalized = normalizeUser(body)
          setUser(normalized)
          if (funcao === 'usuario') await loadFavoritos(normalized.id)
        }
      }
      setLoading(false)
    }
    loadRecipes()
    carregarUsuario()
    loadCategorias()
  }, [])

  async function loadChefRecipes(userId) {
    try {
      const resposta = await fetch(`${API_BASE}/receita/findAll`);
      if (!resposta.ok) throw new Error("Erro na requisição das receitas");

      const dadosBrutos = await resposta.json();

      if (Array.isArray(dadosBrutos)) {
        const receitasDoChef = dadosBrutos.filter((receita) => {
          const donoDaReceitaId = receita.usuario?.codUser || receita.codUser;
          const ehAtiva = receita.status_receita === 'ATIVO';

          return ehAtiva && String(donoDaReceitaId) === String(userId);
        });

        const receitasNormalizadas = receitasDoChef.map(normalizeApiRecipe);
        setChefRecipes(receitasNormalizadas);
      }
    } catch (error) {
      console.error("Erro ao carregar receitas do chef no hook:", error);
    }
  }

  async function toggleUserStatus(userId, currentlyActive) {
    try {
      const endpoint = currentlyActive
        ? `${API_BASE}/usuario/delete/${userId}`
        : `${API_BASE}/usuario/${userId}/status`
      const res = await fetch(endpoint, { method: 'PUT' })
      if (!res.ok) return { ok: false }
      return { ok: true }
    } catch {
      return { ok: false }
    }
  }

  async function toggleUserBlock(userId) {
    try {
      const res = await fetch(`${API_BASE}/usuario/bloquear/${userId}`, { method: 'PUT' })
      if (!res.ok) return { ok: false }
      return { ok: true }
    } catch {
      return { ok: false }
    }
  }

  async function toggleRecipeStatus(recipeId, currentlyActive) {
    try {
      const endpoint = currentlyActive
        ? `${API_BASE}/receita/${recipeId}/inativar`
        : `${API_BASE}/receita/${recipeId}/ativar`
      const res = await fetch(endpoint, { method: 'PUT', cache: 'no-store' })
      if (!res.ok) return { ok: false }
      return { ok: true }
    } catch {
      return { ok: false }
    }
  }

  async function toggleCommentStatus(commentId, currentlyActive) {
    try {
      const endpoint = currentlyActive
        ? `${API_BASE}/comentario/${commentId}/inativar`
        : `${API_BASE}/comentario/${commentId}/ativar`
      const res = await fetch(endpoint, { method: 'PUT' })
      if (!res.ok) return { ok: false }
      return { ok: true }
    } catch {
      return { ok: false }
    }
  }

  async function loadAllUsers() {
    try {
      const res = await fetch(`${API_BASE}/usuario/findAll`)
      if (!res.ok) return []
      return await res.json()
    } catch {
      return []
    }
  }

  async function loadAllComments() {
    try {
      const res = await fetch(`${API_BASE}/comentario/findAll`)
      if (!res.ok) return []
      return await res.json()
    } catch {
      return []
    }
  }

  const [categorias, setCategorias] = useState([])

  async function loadCategorias() {
    try {
      const res = await fetch(`${API_BASE}/categoria/findAll`)
      if (!res.ok) return
      const data = await res.json()
      setCategorias(Array.isArray(data) ? data : [])
    } catch {
      setCategorias([])
    }
  }

  async function createCategoria(nome) {
    try {
      const res = await fetch(`${API_BASE}/categoria`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nomeCategoria: nome })
      })
      if (!res.ok) {
        const errText = await res.text()
        return { ok: false, error: errText }
      }
      const created = await res.json()
      setCategorias(prev => [...prev, created])
      return { ok: true, categoria: created }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  }

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
        idade: data.age,
        gmail: data.email,
        senha: data.password,
        funcao: data.funcao,
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

  async function login(email, password, funcao) {
    try {
      const res = await fetch(`${API_BASE}/usuario/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha: password })
      })

      if (res.status === 401) return 'Incorrect'
      if (res.status === 403) return 'inactive'
      if (!res.ok) return false

      const body = await res.json()

      if (body.bloqueado === 1) return 'blocked'
      if (body.status_Usuario === 'INATIVO') return 'inactive'

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
      const endpoint = `${API_BASE}/usuario/reativar`
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
      const endpoint = `${API_BASE}/usuario/delete/${user.id}`
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

  async function updateUserProfile(updated) {
    try {
      const payload = {
        nome_completo: updated.name || user.name,
        nome_de_usuario: user.username,
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
    if (!user || (user.funcao !== 'chef' && user.funcao !== 'Chefe' && user.funcao !== 'CHEF')) {
      return { ok: false, error: 'Apenas chefs podem publicar receitas.' }
    }

    try {
      const listaIngredientes = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
      const listaInstrucoes = Array.isArray(recipe.instructions) ? recipe.instructions : [];

      if (listaIngredientes.length === 0) {
        return { ok: false, error: 'A lista de ingredientes não pode estar vazia.' }
      }
      if (listaInstrucoes.length === 0) {
        return { ok: false, error: 'O modo de preparo não pode estar vazio.' }
      }

      const payload = {
        nomeReceita: recipe.title || recipe.nomeReceita || 'Receita Sem Título',
        descricao: recipe.description || recipe.descricao || '',
        fotoReceita: recipe.image || recipe.fotoReceita || null,
        ingredientes: JSON.stringify(listaIngredientes),
        modo_preparo: JSON.stringify(listaInstrucoes),
        tempoPreparo: recipe.prepTime || recipe.tempoPreparo || 'Rápido', // 💡 ADICIONADO PARA CORRIGIR O ERRO @NotBlank
        status_receita: 'ATIVO',
        restricao: Number(recipe.restricao || 15),
        usuario: {
          codUser: Number(user?.id || user?.codUsuario)
        }
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
      const idReceitaSalva = saved.codReceitas || saved.id;

      const normalized = normalizeApiRecipe(saved);
      normalized.usuario = {
        ...normalized.usuario,
        codUser: user?.codUser
      };

      setRecipes(prev => [normalized, ...prev]);
      setChefRecipes(prev => [normalized, ...prev]);

      if (recipe.categorias && Array.isArray(recipe.categorias)) {
        for (const codCategoria of recipe.categorias) {
          const resCategoria = await fetch(`${API_BASE}/receita/categoria/adicionar/${codCategoria}/${idReceitaSalva}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
          });
          if (!resCategoria.ok) {
            const erroTexto = await resCategoria.text()
            console.warn(`Não foi possível associar a categoria ${codCategoria} à receita ${idReceitaSalva}.`, erroTexto)
          }
        }
      }

      return { ok: true, recipe: normalized };
    } catch (err) {
      console.error("Erro ao publicar receita:", err);
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
    <UserContext.Provider value={{
      user, token, setUser,
      DIET_OPTIONS, register, login,
      reactivateAccount, deactivateAccount, changePassword, updateUserProfile, logout,
      recipes, recipesLoaded, chefRecipes,
      publishRecipe, deleteRecipe, editRecipe,
      recipeStats, trackFavorite, trackView,
      favoritos, toggleFavorito, loading,
      toggleUserStatus, toggleRecipeStatus, toggleCommentStatus,
      loadAllUsers, loadAllComments,
      categorias, loadCategorias, createCategoria,
      loadRecipes, loadChefRecipes, toggleUserBlock
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}