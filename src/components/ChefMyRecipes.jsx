import { useState, useEffect } from 'react'
import { useUser } from '../hooks/useUser'
import RecipeCard from './RecipeCard'
import '../styles/chefMyRecipes.css'
import { uploadImage } from '../services/supabase'

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
  const [categorySearch, setCategorySearch] = useState('')
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

  // ── 1. Carrega as categorias disponíveis do banco ────────────────────────
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

  // ── 2. Busca a receita CRUA direto da API e mapeia as categorias com os objetos completos ──
  useEffect(() => {
    async function loadRawRecipe() {
      setLoadingRecipe(true)
      try {
        const res = await fetch(`${API_BASE}/receita/${recipe.id}`)
        if (!res.ok) throw new Error('Falha ao buscar receita')
        const data = await res.json()
        setRawRecipe(data)

        setLinkFoto(data.fotoReceita)
        setPreviewUrl(data.fotoReceita)

        // Mapeia os objetos de categorias da receita
        const rawCats = Array.isArray(data.categoria) ? data.categoria : []
        
        // Se as categorias do banco já foram carregadas, pegamos os objetos completos delas
        if (categoriesFromDb.length > 0) {
          const matchedCats = rawCats.map(rc => {
            const rcId = rc.codCategoria || rc.id
            return categoriesFromDb.find(c => (c.codCategoria || c.id) === rcId) || rc
          }).filter(Boolean)
          setSelectedCategories(matchedCats)
        } else {
          setSelectedCategories(rawCats)
        }

        // Campos de texto e imagem
        setForm({
          title: data.nomeReceita || '',
          description: data.descricao || '',
          tempoPreparo: data.tempoPreparo || 'Faaaaácil',
          image: data.fotoReceita || '',
        })

        // Ingredientes
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

        // Modo de preparo
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
  }, [recipe.id, categoriesFromDb.length])

  // ── 3. Regras de negócios de Categorias (Incompatibilidade e Seleção) ────
  function getCategoryGroup(categoria) {
    return (categoria.grupoCategoria || 'neutro').toString().toLowerCase()
  }

  function isCategoryDisabled(categoria) {
    const grupoCat = getCategoryGroup(categoria)
    if (grupoCat === 'neutro') return false

    const temCarne = selectedCategories.some(c => getCategoryGroup(c) === 'carnes')
    const temVeg = selectedCategories.some(c => {
      const g = getCategoryGroup(c)
      return g === 'vegetariano' || g === 'vegano'
    })

    if (grupoCat === 'carnes' && temVeg) return true
    if ((grupoCat === 'vegetariano' || grupoCat === 'vegano') && temCarne) return true

    return false
  }

  function handleCategoryChange(categoria) {
    setError(null)
    const idCat = categoria.codCategoria || categoria.id
    const isAlreadySelected = selectedCategories.some(c => (c.codCategoria || c.id) === idCat)

    if (isAlreadySelected) {
      setSelectedCategories(prev => prev.filter(c => (c.codCategoria || c.id) !== idCat))
      return
    }

    if (isCategoryDisabled(categoria)) return

    if (selectedCategories.length >= 5) {
      setError('Você pode selecionar no máximo 5 categorias por receita.')
      return
    }

    setSelectedCategories(prev => [...prev, categoria])
  }

  // ── 4. Controladores de eventos ───────────────────────────────────────────
  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
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

      if (imageFile) {
        novaUrlFoto = await uploadImage(imageFile, null, true, linkFoto)

        if (!novaUrlFoto) {
          return setError('Erro ao enviar a nova imagem. Tente novamente.')
        }

        setLinkFoto(novaUrlFoto)
      }

      const updatedRecipe = {
        ...rawRecipe,
        nomeReceita: form.title,
        descricao: form.description,
        tempoPreparo: form.tempoPreparo,
        fotoReceita: novaUrlFoto,
        ingredientes: JSON.stringify(ingredients),
        modo_preparo: JSON.stringify(steps),
        categoria: selectedCategories.map(c => ({ codCategoria: c.codCategoria || c.id })),
      }

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

  // Filtros de busca de categorias
  const unselectedCategories = categoriesFromDb.filter(c => {
    const idCat = c.codCategoria || c.id
    return !selectedCategories.some(sel => (sel.codCategoria || sel.id) === idCat)
  })

  const filteredUnselected = unselectedCategories.filter(c =>
    (c.nomeCategoria || c.nome || '').toLowerCase().includes(categorySearch.toLowerCase())
  )

  const displayedUnselected = categorySearch.trim() === ''
    ? filteredUnselected.slice(0, 9)
    : filteredUnselected

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

          <h3>Categorias <span style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>(Máximo 5 categorias)</span></h3>

          {selectedCategories.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#F27A1A', marginBottom: '8px' }}>
                Selecionadas ({selectedCategories.length}/5):
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedCategories.map(c => {
                  const idCat = c.codCategoria || c.id
                  const nomeCat = c.nomeCategoria || c.nome
                  return (
                    <span
                      key={idCat}
                      className="category-tag"
                      onClick={() => handleCategoryChange(c)}
                      style={{ cursor: 'pointer' }}
                    >
                      {nomeCat} ✕
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          <div style={{ marginBottom: '12px' }}>
            <input
              type="text"
              placeholder="Pesquisar categoria..."
              value={categorySearch}
              onChange={e => setCategorySearch(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '10px',
                border: '1px solid #FDBA74',
                background: '#FFF3EB',
                fontSize: '14px'
              }}
            />
          </div>

          <div className="categories-checkbox-grid">
            {categoriesFromDb.length === 0 ? (
              <p style={{ fontSize: '14px', color: '#888' }}>Carregando categorias...</p>
            ) : displayedUnselected.length === 0 ? (
              <p style={{ fontSize: '14px', color: '#888', gridColumn: '1 / -1' }}>Nenhuma categoria disponível encontrada.</p>
            ) : (
              displayedUnselected.map(c => {
                const idCat = c.codCategoria || c.id
                const nomeCat = c.nomeCategoria || c.nome
                const disabled = isCategoryDisabled(c)

                return (
                  <label
                    key={idCat}
                    className={`category-checkbox ${disabled ? 'disabled' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={false}
                      disabled={disabled}
                      onChange={() => handleCategoryChange(c)}
                      style={{ cursor: disabled ? 'not-allowed' : 'pointer', accentColor: '#F27A1A' }}
                    />
                    <span className="checkbox-text">
                      {nomeCat} {disabled && <small style={{ fontSize: '10px', fontStyle: 'italic', display: 'block', color: '#DC2626' }}>(Incompatível)</small>}
                    </span>
                  </label>
                )
              })
            )}
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
  const { user, chefRecipes, deleteRecipe, editRecipe, loadChefRecipes } = useUser()

  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    if (user?.id) {
      loadChefRecipes(user.id);
    }
  }, [user?.id]);

  async function handleDelete() {
    setDeleteError('')

    const res = await deleteRecipe(confirmDelete.id)

    if (res.ok) {
      setConfirmDelete(null)
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
              key={recipe.id}
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
            const recipeId = editing.codReceita || editing.codReceitas || editing.id

            await editRecipe(recipeId, updated)

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