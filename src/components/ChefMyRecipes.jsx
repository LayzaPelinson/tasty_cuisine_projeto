import { useState, useEffect } from 'react'
import { useUser } from '../hooks/useUser'
import RecipeCard from './RecipeCard'
import '../styles/favoriteRecipes.css'
import '../styles/publishRecipe.css'
import '../styles/recipesSection.css'
import '../styles/login.css'

function EditModal({ recipe, onSave, onClose }) {
  // Função interna para realizar o parse seguro de strings JSON vindas do Spring Boot
  const parseList = (value) => {
    if (!value) return []
    if (Array.isArray(value)) return value
    try { return JSON.parse(value) } catch { return [] }
  }

  const UNITS = ['unidades', 'gramas', 'kg', 'ml', 'litros', 'xícaras', 'colheres', 'fatias', 'dentes', 'pitadas', 'a gosto']
  const API_BASE = 'http://localhost:8080'

  const [categoriesFromDb, setCategoriesFromDb] = useState([])
  const [rawRecipe, setRawRecipe] = useState(null)
  const [loadingRecipe, setLoadingRecipe] = useState(true)

  const [selectedCategories, setSelectedCategories] = useState([])
  const [form, setForm] = useState({ title: '', description: '', difficulty: 'Fácil', image: '' })
  const [ingredients, setIngredients] = useState([])
  const [ingInput, setIngInput] = useState({ quantidade: '', unidade: 'gramas', nome: '' })
  const [steps, setSteps] = useState([])
  const [stepInput, setStepInput] = useState('')
  const [error, setError] = useState(null)

  // ── 1. Busca a receita CRUA direto da API, não a versão normalizada ──────
  useEffect(() => {
    async function loadRawRecipe() {
      setLoadingRecipe(true)
      try {
        const res = await fetch(`${API_BASE}/receita/${recipe.id}`)
        if (!res.ok) throw new Error('Falha ao buscar receita')
        const data = await res.json()
        setRawRecipe(data)

        // Categorias selecionadas (array de objetos {codCategoria, nomeCategoria})
        const cats = Array.isArray(data.categoria) ? data.categoria : []
        setSelectedCategories(cats.map(c => c.codCategoria).filter(Boolean))
        console.log('data.categoria:', data.categoria)
        // Campos de texto e imagem
        setForm({
          title: data.nomeReceita || '',
          description: data.descricao || '',
          difficulty: data.dificuldade || 'Fácil',
          image: data.fotoReceita || '',
        })

        // Ingredientes — vem como string JSON: '[{"quantidade":"123","unidade":"gramas","nome":"3"}, ...]'
        const parsedIngredients = parseList(data.ingredientes)
        setIngredients(
          Array.isArray(parsedIngredients)
            ? parsedIngredients.map(ing => ({
              quantidade: ing.quantidade ?? '',
              unidade: ing.unidade ?? 'gramas',
              nome: ing.nome ?? '',
            }))
            : []
        )

        // Modo de preparo — vem como string JSON: '["passo 1", "passo 2"]'
        const parsedSteps = parseList(data.modo_preparo)
        setSteps(Array.isArray(parsedSteps) ? parsedSteps : [])
      } catch (err) {
        console.error('Erro ao carregar receita para edição:', err)
        setError('Não foi possível carregar os dados da receita.')
      } finally {
        setLoadingRecipe(false)
      }
    }
    loadRawRecipe()
  }, [recipe.id])

  // ── 2. Carrega as categorias disponíveis do banco ────────────────────────
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch(`${API_BASE}/categoria/findAll`)
        if (res.ok) {
          const data = await res.json()
          setCategoriesFromDb(data)
        }
      } catch (err) {
        console.error('Erro ao carregar categorias no modal:', err)
      }
    }
    loadCategories()
  }, [])

  // ── 3. Controladores de eventos ───────────────────────────────────────────
  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleCategoryChange(idCategoria) {
    setSelectedCategories(prev =>
      prev.includes(idCategoria)
        ? prev.filter(id => id !== idCategoria)
        : [...prev, idCategoria]
    )
  }

  function addIngredient() {
    if (!ingInput.quantidade.trim() || !ingInput.nome.trim()) return
    setIngredients(prev => [...prev, { ...ingInput }])
    setIngInput({ quantidade: '', unidade: 'gramas', nome: '' })
  }

  function removeIngredient(i) {
    setIngredients(prev => prev.filter((_, idx) => idx !== i))
  }

  function addStep() {
    if (!stepInput.trim()) return
    setSteps(prev => [...prev, stepInput.trim()])
    setStepInput('')
  }

  function removeStep(i) {
    setSteps(prev => prev.filter((_, idx) => idx !== i))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (ingredients.length === 0) return setError('Adicione ao menos um ingrediente.')
    if (steps.length === 0) return setError('Adicione ao menos um passo no modo de preparo.')
    if (selectedCategories.length === 0) return setError('Selecione ao menos uma categoria.')

    const updatedRecipe = {
      ...rawRecipe,
      nomeReceita: form.title,
      descricao: form.description,
      dificuldade: form.difficulty,
      fotoReceita: form.image,
      ingredientes: JSON.stringify(ingredients),
      modo_preparo: JSON.stringify(steps),
      categoria: selectedCategories.map(id => ({ codCategoria: id })),
    }

    onSave(updatedRecipe)
  }

  if (loadingRecipe) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <p>Carregando receita...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Editar Receita</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Título</label>
            <input name="title" value={form.title} onChange={handleChange} required />
          </div>

          <div>
            <label>Descrição</label>
            <textarea name="description" rows="2" value={form.description} onChange={handleChange} required />
          </div>

          <div>
            <label>Dificuldade</label>
            <select name="difficulty" value={form.difficulty} onChange={handleChange}>
              <option>Fácil</option>
              <option>Médio</option>
              <option>Difícil</option>
            </select>
          </div>

          <div>
            <label>Foto (URL)</label>
            <input name="image" value={form.image} onChange={handleChange} placeholder="https://exemplo.com/foto.jpg" />
          </div>

          <h3>Categorias</h3>
          <div className="categories-checkboxes">
            {categoriesFromDb.map(cat => (
              <label key={cat.codCategoria} className="category-checkbox">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.codCategoria)}
                  onChange={() => handleCategoryChange(cat.codCategoria)}
                />
                {cat.nomeCategoria}
              </label>
            ))}
          </div>

          <h3>Ingredientes</h3>
          <div className="ingredient-inputs">
            <input
              placeholder="Quantidade"
              value={ingInput.quantidade}
              onChange={e => setIngInput(f => ({ ...f, quantidade: e.target.value }))}
            />
            <select value={ingInput.unidade} onChange={e => setIngInput(f => ({ ...f, unidade: e.target.value }))}>
              {UNITS.map(u => <option key={u}>{u}</option>)}
            </select>
            <input
              placeholder="Ingrediente"
              value={ingInput.nome}
              onChange={e => setIngInput(f => ({ ...f, nome: e.target.value }))}
            />
            <button type="button" onClick={addIngredient}>+ Adicionar</button>
          </div>
          {ingredients.length > 0 && (
            <ul className="items-list">
              {ingredients.map((ing, i) => (
                <li key={i}>
                  <span>{ing.quantidade} {ing.unidade} — {ing.nome}</span>
                  <button type="button" onClick={() => removeIngredient(i)}>✕</button>
                </li>
              ))}
            </ul>
          )}

          <h3>Modo de Preparo</h3>
          <div className="step-inputs">
            <textarea
              rows="2"
              placeholder="Descreva um passo do preparo..."
              value={stepInput}
              onChange={e => setStepInput(e.target.value)}
            />
            <button type="button" onClick={addStep}>+ Adicionar Passo</button>
          </div>
          {steps.length > 0 && (
            <ol className="items-list">
              {steps.map((step, i) => (
                <li key={i}>
                  <span>{step}</span>
                  <button type="button" onClick={() => removeStep(i)}>✕</button>
                </li>
              ))}
            </ol>
          )}

          {error && <p className="error-text">{error}</p>}

          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit">Salvar Alterações</button>
          </div>
        </form>
      </div>
    </div>
  )
}


function ChefMyRecipes() {
  // 2. Pegamos a nova função que criamos no hook
  const { user, chefRecipes, deleteRecipe, editRecipe, loadChefRecipes, toggleRecipeStatus } = useUser()

  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [deleteError, setDeleteError] = useState('')

  // 3. Disparamos a busca automaticamente quando o componente inicia ou o usuário muda
  useEffect(() => {
    if (user?.id) {
      loadChefRecipes(user.id);
    }
  }, [user?.id]);

  async function handleDelete() {
    setDeleteError('')

    // Como o card usa os dados normalizados, passamos confirmDelete.id
    // E passamos 'true' para o segundo parâmetro (currentlyActive), pois se estamos deletando, ela está ativa e queremos INATIVAR.
    const res = await toggleRecipeStatus(confirmDelete.id, true)

    if (res.ok) {
      setConfirmDelete(null)
      // Recarrega a lista do banco. Como a receita agora está INATIVA, o filtro do back/front vai ignorá-la e ela some da tela!
      loadChefRecipes(user.id);
    } else {
      setDeleteError('Falha ao excluir a receita. Tente novamente.')
    }
  }

  return (
    <section className="favorite-recipes">
      <h2>Minhas Receitas</h2>
      {chefRecipes.length === 0 ? (
        <p className="no-favorites">Você ainda não publicou nenhuma receita.</p>
      ) : (
        <div className="recipes-grid">
          {chefRecipes.map(recipe => (
            <RecipeCard
              key={recipe.id} // Usando a chave correta da API
              recipe={recipe}
              actions={<>
                <button className="btn-edit" onClick={() => setEditing(recipe)}>Editar</button>
                <button className="btn-delete" onClick={() => { setConfirmDelete(recipe); setDeleteError('') }}>Excluir</button>
              </>}
            />
          ))}
        </div>
      )}

      {editing && (
        <EditModal
          recipe={editing}
          // Ajustado para passar o codReceitas correto no salvamento
          onSave={(updated) => { editRecipe(editing.codReceitas, updated); setEditing(null) }}
          onClose={() => setEditing(null)}
        />
      )}

      {confirmDelete && (
        <div className="reactivate-overlay">
          <div className="reactivate-modal">
            <h3>Excluir Receita</h3>
            <p>Tem certeza que deseja excluir <strong>{confirmDelete.nomeReceita}</strong>? Esta ação não pode ser desfeita.</p>
            {deleteError && <p className="login-error">{deleteError}</p>}
            <div className="reactivate-actions">
              <button className="login-btn" style={{ background: '#e53e3e' }} onClick={handleDelete}>Excluir</button>
              <button onClick={() => setConfirmDelete(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default ChefMyRecipes