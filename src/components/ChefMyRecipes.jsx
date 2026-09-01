import { useState, useEffect } from 'react'
import { useUser } from '../hooks/useUser'
import RecipeCard from './RecipeCard'
import '../styles/chefMyRecipes.css'
import { uploadImage } from '../services/supabase'
import { data } from 'react-router-dom'

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
  const [form, setForm] = useState({ title: '', description: '', tempoPreparo: '', image: '' })
  const [ingredients, setIngredients] = useState([])
  const [ingInput, setIngInput] = useState({ quantidade: '', unidade: 'gramas', nome: '' })
  const [steps, setSteps] = useState([])
  const [stepInput, setStepInput] = useState('')
  const [error, setError] = useState(null)

  //Foto
  const [linkFoto, setLinkFoto] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')

  // ── 1. Busca a receita CRUA direto da API, não a versão normalizada ──────
  useEffect(() => {
    async function loadRawRecipe() {
      setLoadingRecipe(true)
      try {
        const res = await fetch(`${API_BASE}/receita/${recipe.id}`)
        if (!res.ok) throw new Error('Falha ao buscar receita')
        const data = await res.json()
        setRawRecipe(data)

        console.log(data)
        setLinkFoto(data.fotoReceita)
        setPreviewUrl(data.fotoReceita)
        // Categorias selecionadas (array de objetos {codCategoria, nomeCategoria})
        const cats = Array.isArray(data.categoria) ? data.categoria : []
        setSelectedCategories(cats.map(c => c.codCategoria).filter(Boolean))
        // Campos de texto e imagem
        setForm({
          title: data.nomeReceita || '',
          description: data.descricao || '',
          tempoPreparo: data.tempoPreparo || 'Faaaaácil',
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

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (ingredients.length === 0) return setError('Adicione ao menos um ingrediente.')
    if (steps.length === 0) return setError('Adicione ao menos um passo no modo de preparo.')
    if (selectedCategories.length === 0) return setError('Selecione ao menos uma categoria.')

    try {
      let novaUrlFoto = linkFoto

      // 1. Faz o upload se o usuário selecionou um arquivo novo
      if (imageFile) {
        // Passa o arquivo novo, id null, true (é receita) e o link da foto antiga (linkFoto)
        novaUrlFoto = await uploadImage(imageFile, null, true, linkFoto)

        // Se falhar o upload, avisa o usuário e interrompe o envio ao backend
        if (!novaUrlFoto) {
          return setError('Erro ao enviar a nova imagem. Tente novamente.')
        }

        setLinkFoto(novaUrlFoto)
      }

      // 2. Monta o objeto com 'novaUrlFoto'
      const updatedRecipe = {
        ...rawRecipe,
        nomeReceita: form.title,
        descricao: form.description,
        tempoPreparo: form.tempoPreparo,
        fotoReceita: novaUrlFoto,
        ingredientes: JSON.stringify(ingredients),
        modo_preparo: JSON.stringify(steps),
        categoria: selectedCategories.map(id => ({ codCategoria: id })),
      }

      // 3. Executa o salvamento no componente pai (o pai se encarrega de atualizar as receitas)
      await onSave(updatedRecipe)
    } catch (err) {
      console.error('Erro ao salvar:', err)
      setError('Falha ao atualizar a imagem ou receita.')
    }
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
            <label>Tempo de Preparo</label>
            <select name="tempoPreparo" value={form.tempoPreparo} onChange={handleChange}>
              <option>Rápido</option>
              <option>Mediano</option>
              <option>Demorado</option>
            </select>
          </div>

          <div>
            <label>Foto da Receita</label>
            <div className="file-upload-wrapper">
              <label htmlFor="file-input-edit" className="custom-file-btn">
                📷 Escolher nova foto
              </label>
              <input
                id="file-input-edit"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0]
                  if (file) {
                    setImageFile(file)
                    setPreviewUrl(URL.createObjectURL(file))
                  }
                }}
              />
              {previewUrl && (
                <div className="image-preview-container">
                  <img src={previewUrl} alt="Pré-visualização" />
                </div>
              )}
            </div>
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
    const res = await deleteRecipe(confirmDelete.id)

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
          onSave={async (updated) => {
            // 1. Garante que pega o ID correto para a URL do backend
            const recipeId = editing.codReceita || editing.codReceitas || editing.id

            // 2. Chama a função de edição do seu hook
            await editRecipe(recipeId, updated)

            // 3. Força a atualização da lista de receitas na tela
            if (user?.id) {
              await loadChefRecipes(user.id)
            }

            setEditing(null)
          }}
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