import { createContext, useContext, useEffect, useState } from 'react'
import { deleteImage } from '../services/supabase'
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
          // Se for um objeto com detalhes, mantemos o objeto completo!
          if (item.nome || item.nomeIngredient) {
            return item
          }
          return Object.values(item)[0]
        }
        return item
      })
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
    chef: recipe.chef ?? recipe.chefName ?? recipe.usuario?.nome_completo ?? recipe.usuario?.nome_de_usuario ?? recipe.chefe?.nomeCompleto ?? recipe.chefe?.nomeUsuario ?? 'Desconhecido',
    chefId: recipe.usuario?.codUser ?? recipe.chefe?.codChefe,
    ingredients: parseJsonOrLines(recipe.ingredients ?? recipe.ingredientes),
    instructions: parseJsonOrLines(recipe.instructions ?? recipe.modo_preparo ?? recipe.manual2),
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
  const [notificacoesRaw, setNotificacoesRaw] = useState([])


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
          const DonoBloqueado = receita.usuario?.bloqueado === 0;
          const DonoAtivo = receita.usuario?.status_Usuario === 'ATIVO'
            
          return ehAtiva && DonoAtivo && DonoBloqueado && String(donoDaReceitaId) === String(userId);
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
  
  async function getRecipeFavoritesCount(recipeId) {
  try {
    const res = await fetch(`${API_BASE}/favorito/findAll`);
    if (!res.ok) return 0;
    const data = await res.json();
    if (Array.isArray(data)) {
      // Filtra os favoritos que pertencem a essa receita especificamente
      const favs = data.filter(f => {
        const idDaReceita = f.receita?.codReceitas || f.receita?.id || f.codReceitas;
        return String(idDaReceita) === String(recipeId);
      });
      return favs.length;
    }
    return 0;
  } catch (error) {
    console.error("Erro ao carregar contagem de favoritos da receita:", error);
    return 0;
  }
}

async function getRecipeRatingStats(recipeId) {
  try {
    const res = await fetch(`${API_BASE}/comentario/findAll`);
    if (!res.ok) return { total: 0, media: '0.0' };
    const data = await res.json();
    
    if (Array.isArray(data)) {
      // Filtra comentários pertinentes a essa receita
      const comentariosDaReceita = data.filter(c => {
        const idDaReceita = c.receita?.codReceitas || c.receita?.id || c.codReceitas;
        return String(idDaReceita) === String(recipeId);
      });

      const total = comentariosDaReceita.length;
      if (total === 0) return { total: 0, media: '0.0' };

      const somaNotas = comentariosDaReceita.reduce((acc, c) => acc + Number(c.nota || c.avaliacao || 0), 0);
      const media = (somaNotas / total).toFixed(1);

      return { total, media };
    }
    return { total: 0, media: '0.0' };
  } catch (error) {
    console.error("Erro ao buscar avaliações da receita:", error);
    return { total: 0, media: '0.0' };
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

  async function createCategoria(nome, grupo) {
    try {
      const res = await fetch(`${API_BASE}/categoria`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nomeCategoria: nome, grupoCategoria: grupo })
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
  try {
    const res = await fetch(`${API_BASE}/favorito/findAll`);
    if (!res.ok) return;
    const data = await res.json();
    
    if (Array.isArray(data)) {
      // Filtra apenas os favoritos pertencentes ao usuário atual
      const userFavs = data.filter(f => {
        const idDoUsuario = f.usuario?.codUser || f.usuario?.id || f.codUser;
        return String(idDoUsuario) === String(userId);
      });
      setFavoritos(userFavs);
    }
  } catch (error) {
    console.error("Erro ao carregar favoritos:", error);
  }
}

  async function toggleFavorito(receitaId) {
  if (!user) return;

  // Busca se já está favoritado comparando os IDs da receita
  const jaExiste = favoritos.find(f => {
    const idDaReceita = f.receita?.codReceitas || f.receita?.id || f.codReceitas;
    return String(idDaReceita) === String(receitaId);
  });

  try {
    if (jaExiste) {
      const idFavorito = jaExiste.codFavoritos || jaExiste.id;
      const res = await fetch(`${API_BASE}/favorito/${idFavorito}`, { method: 'DELETE' });
      
      if (res.ok) {
        setFavoritos(prev => prev.filter(f => (f.codFavoritos || f.id) !== idFavorito));
      }
    } else {
      const res = await fetch(`${API_BASE}/favorito`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario: { codUser: user.id },
          receita: { codReceitas: receitaId }
        })
      });

      if (res.ok) {
        // Recarrega os favoritos atualizados do banco
        await loadFavoritos(user.id);
      }
    }
  } catch (error) {
    console.error("Erro ao alternar favorito:", error);
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

    // Tenta capturar o corpo da resposta (caso o backend envie JSON com o ID/dados mesmo em erros)
    let body = {}
    try {
      body = await res.json()
    } catch {
      // Caso a resposta não tenha um corpo JSON válido
    }

    // Extrai o ID do usuário de qualquer variação possível (codUser, id, etc.)
    const codUser = body.codUser || body.id || null

    if (res.status === 401) {
      return { success: false, status: 'incorrect', codUser, message: 'E-mail ou senha incorretos.' }
    }
    if (res.status === 403) {
      return { success: false, status: 'inactive', codUser, message: 'Conta inativa.' }
    }
    if (!res.ok) {
      return { success: false, status: 'error', codUser, message: 'Falha na requisição de login.' }
    }

    if (body.bloqueado === 1) {
      return { success: false, status: 'blocked', codUser, message: 'Acesso bloqueado pelo administrador.' }
    }
    if (body.status_Usuario === 'INATIVO') {
      return { success: false, status: 'inactive', codUser, message: 'Conta inativa.' }
    }

    // Login bem-sucedido
    const normalized = normalizeUser(body, funcao)
    setUser(normalized)

    localStorage.setItem('userId', String(normalized.id))
    localStorage.setItem('userFuncao', normalized.funcao)

    if (typeof loadFavoritos === 'function') {
      await loadFavoritos(normalized.id)
    }

    return { success: true, status: 'success', codUser: normalized.id, user: normalized }
  } catch (err) {
    console.error('Erro no login:', err)
    return { success: false, status: 'exception', codUser: null, message: 'Erro de conexão com o servidor.' }
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
        foto_perfil: updated.photo,
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
    // 1. Busca os dados da receita para pegar o link da foto
    const recipeRes = await fetch(`${API_BASE}/receita/${id}`)
    
    if (recipeRes.ok) {
      const recipeData = await recipeRes.json()
      const fotoParaDeletar = recipeData.fotoReceita || recipeData.image
      // 2. Se houver link de foto, apaga do Supabase Storage
      if (fotoParaDeletar) {
        await deleteImage(fotoParaDeletar)
      }
    }

    // 3. Executa a deleção no backend Spring Boot
    const res = await fetch(`${API_BASE}/receita/${id}`, { method: 'DELETE' })
    if (!res.ok) return { ok: false }

    // 4. Atualiza os estados locais removendo a receita
    setChefRecipes(prev => prev.filter(r => r.id !== id))
    setRecipes(prev => prev.filter(r => r.id !== id))

    return { ok: true }
  } catch (err) {
    console.error('Erro ao deletar receita:', err)
    return { ok: false }
  }
}

  async function editRecipe(id, updatedData) {
  try {
    const res = await fetch(`http://localhost:8080/receita/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    })

    if (!res.ok) {
      console.error('Erro na resposta do servidor:', res.status)
    }
  } catch (err) {
    console.error('Erro de rede ao editar receita:', err)
  }
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

  const registrarBloqueio = async (payload) => {
  try {
    const response = await fetch('http://localhost:8080/notificacoes/bloquear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) throw new Error('Falha ao registrar bloqueio')
    const data = await response.json()
    return { ok: true, data }
  } catch (err) {
    console.error('Erro ao bloquear:', err)
    return { ok: false, error: err.message }
  }
}

// 2. Buscar notificação específica do usuário logado
const loadNotificacaoUsuario = async (userId) => {
  try {
    const response = await fetch(`http://localhost:8080/notificacoes/usuario/${userId}`)
    if (!response.ok) return null
    console.log(response  )
    return await response.json()
  } catch (err) {
    console.error('Erro ao carregar notificação do usuário:', err)
    return null
  }
}

// 3. Enviar a contestação/resposta do usuário
const enviarContestacao = async (codNotificacao, resposta) => {
  try {
    const response = await fetch(`http://localhost:8080/notificacoes/${codNotificacao}/contestar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resposta })
    })
    if (!response.ok) throw new Error('Falha ao enviar contestação')
    const data = await response.json()
    return { ok: true, data }
  } catch (err) {
    console.error('Erro ao contestar:', err)
    return { ok: false, error: err.message }
  }
}

// 4. Função para normalizar e separar uma lista de notificações por categoria
const normalizarNotificacoes = (listaNotificacoes = []) => {
  const normalizadas = {
    usuarios: [],
    chefes: [],
    receitas: []
  }

  listaNotificacoes.forEach(n => {
    const item = {
      id: n.codNotificacao,
      tipo: n.tipoEntidade, // 'USUARIO', 'CHEFE' ou 'RECEITA'
      motivo: n.motivo,
      descricao: n.descricao,
      respostaUsuario: n.respostaUsuario || null,
      status: n.statusNotificacao,
      dataEnvio: n.dataEnvio,
      usuarioId: n.usuario?.codUser || null,
      nomeUsuario: n.usuario?.nome_completo || 'N/A',
      receitaId: n.receita?.codReceitas || null,
      tituloReceita: n.receita?.nomeReceita || 'N/A'
    }

    if (item.tipo === 'USUARIO') {
      normalizadas.usuarios.push(item)
    } else if (item.tipo === 'CHEFE') {
      normalizadas.chefes.push(item)
    } else if (item.tipo === 'RECEITA') {
      normalizadas.receitas.push(item)
    }
  })

  return normalizadas
}

const loadTodasNotificacoes = async () => {
  try {
    const response = await fetch(`${API_BASE}/notificacoes/findAll`)
    if (!response.ok) return []
    
    const data = await response.json()
    const lista = Array.isArray(data) ? data : (data?.content || data?.data || [])
    
    // Salva no estado global do contexto!
    setNotificacoesRaw(lista)
    return lista
  } catch (err) {
    console.error('Erro ao buscar notificações:', err)
    return []
  }
}

const deleteNotificacao = async (idNotificacao) => {
  try {
    const res = await fetch(`${API_BASE}/notificacoes/${idNotificacao}`, {
      method: 'DELETE',
    })
    if (res.ok) {
      // Remove do estado local instantaneamente
      setNotificacoesRaw(prev => prev.filter(n => (n.codNotificacao || n.id_notificacao || n.id) !== idNotificacao))
      return { ok: true }
    }
    return { ok: false, error: 'Falha ao deletar notificação' }
  } catch (err) {
    console.error('Erro ao deletar notificação:', err)
    return { ok: false, error: 'Erro de conexão com o servidor' }
  }
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
      loadRecipes, loadChefRecipes, toggleUserBlock,
      getRecipeFavoritesCount, getRecipeRatingStats,
      enviarContestacao,normalizarNotificacoes,loadNotificacaoUsuario,
      registrarBloqueio,loadTodasNotificacoes,notificacoesRaw,
      deleteNotificacao,
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}