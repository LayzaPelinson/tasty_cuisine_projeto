import '../styles/publishRecipe.css'
import { useState, useEffect } from 'react'
import { useUser } from '../hooks/useUser'
import { useNavigate } from 'react-router-dom'
import { CustomSelect } from '../components/CustomSelect'
import { uploadImage } from '../services/supabase'

const UNITS = ['unidades', 'gramas', 'kg', 'ml', 'litros', 'xícaras', 'colheres', 'fatias', 'dentes', 'pitadas', 'a gosto']
const PREP_TIMES = ['Rápido', 'Mediano', 'Demorado']
const API_BASE = 'http://localhost:8080'

function PublishRecipe() {
  const { publishRecipe } = useUser()
  const navigate = useNavigate()

  const [categoriesFromDb, setCategoriesFromDb] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [categorySearch, setCategorySearch] = useState('')

  const [form, setForm] = useState({
    title: '',
    description: '',
    difficulty: 'Fácil',
    prepTime: PREP_TIMES[0],
    image: '',
  })
  const [ingredients, setIngredients] = useState([])
  const [ingInput, setIngInput] = useState({ quantidade: '', unidade: 'gramas', nome: '' })
  const [steps, setSteps] = useState([])
  const [stepInput, setStepInput] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  //Images
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch(`${API_BASE}/categoria/findAll`)
        if (res.ok) {
          const data = await res.json()
          setCategoriesFromDb(data)
        }
      } catch (err) {
        console.error("Erro ao carregar categorias do banco:", err)
      }
    }
    loadCategories()
  }, [])

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

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

    const categoryIds = selectedCategories.map(c => c.codCategoria || c.id)
    
    let fotoUrl = ''
    if (imageFile) {
      fotoUrl = await uploadImage(imageFile, 'receitas')
    }
    const result = await publishRecipe({
      title: form.title,
      description: form.description,
      difficulty: form.difficulty,
      prepTime: form.prepTime,
      image: fotoUrl,
      ingredients,
      instructions: steps,
      categorias: categoryIds,
    })

    if (!result.ok) return setError(result.error || 'Falha ao publicar a receita.')
    setSuccess(true)
    setTimeout(() => navigate('/chef-profile'), 2000)
  }

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
    <div className="publish-page">
      <div className="publish-page-header">
        <h1>Publicar Receita</h1>
        <p className="publish-subtitle">Compartilhe sua receita com a comunidade TastyCuisine.</p>
      </div>

      <div className="publish-page-body">
        <section className="recipe-form-card">
          <h2>Formulário de Receita</h2>
          <p>Preencha os dados abaixo para publicar sua receita.</p>

          <form onSubmit={handleSubmit}>
            <h3>Detalhes da Receita</h3>
            <div>
              <label>Título da Receita</label>
              <input
                className="form-title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Ex: Bolo de Chocolate"
                required
              />
            </div>
            <div>
              <label>Descrição</label>
              <textarea
                name="description"
                className="form-description"
                rows="4"
                value={form.description}
                onChange={handleChange}
                placeholder="Breve descrição da receita"
                required
              />
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
                placeholder="Quantidade (ex: 3)"
                value={ingInput.quantidade}
                onChange={e => setIngInput(f => ({ ...f, quantidade: e.target.value }))}
                style={{ width: '180px', flexShrink: 0 }}
              />
              <CustomSelect
                value={ingInput.unidade}
                onChange={val => setIngInput(f => ({ ...f, unidade: val }))}
                options={UNITS}
              />
              <input
                placeholder="Ingrediente (ex: Ovos)"
                value={ingInput.nome}
                onChange={e => setIngInput(f => ({ ...f, nome: e.target.value }))}
                style={{ flex: 1 }}
              />
              <button type="button" className="add-btn" onClick={addIngredient}>+ Adicionar</button>
            </div>

            {ingredients.length > 0 && (
              <ul className="items-list">
                {ingredients.map((ing, idx) => (
                  <li key={idx}>
                    <span>{ing.quantidade} {ing.unidade} de {ing.nome}</span>
                    <button type="button" onClick={() => removeIngredient(idx)}>✕</button>
                  </li>
                ))}
              </ul>
            )}

            <h3>Modo de Preparo</h3>
            <div className="step-inputs">
              <textarea
                rows="3"
                placeholder="Descreva um passo do preparo..."
                value={stepInput}
                onChange={e => setStepInput(e.target.value)}
              />
              <button
                type="button"
                className="add-btn"
                onClick={addStep}
                style={{ alignSelf: 'flex-end' }}
              >
                + Adicionar Passo
              </button>
            </div>

            {steps.length > 0 && (
              <ol className="items-list">
                {steps.map((st, idx) => (
                  <li key={idx}>
                    <span>{st}</span>
                    <button type="button" onClick={() => removeStep(idx)}>✕</button>
                  </li>
                ))}
              </ol>
            )}

            <h3>Tempo de Preparo</h3>
            <div style={{ maxWidth: '280px', marginBottom: '20px' }}>
              <CustomSelect
                value={form.prepTime}
                onChange={val => setForm(f => ({ ...f, prepTime: val }))}
                options={PREP_TIMES}
              />
            </div>

            <h3>Foto da Receita</h3>
            <div>
              <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0]
                if (file) {
                  setImageFile(file)
                  setPreviewUrl(URL.createObjectURL(file)) // Gera preview local imediato
                }
              }}
            />

              {/* Preview simples da foto escolhida antes do envio */}
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Pré-visualização"
                  style={{ width: '150px', height: '100px', objectFit: 'cover', marginTop: '10px', borderRadius: '8px' }}
                />
              )}
            </div>

            {error && <p className="error-text">{error}</p>}
            {success && <p className="publish-success">✓ Receita publicada com sucesso! Aguarde a aprovação de algum ADM.</p>}

            <button type="submit" className="submit-btn">Publicar Receita</button>
          </form>
        </section>
      </div>
    </div>
  )
}

export default PublishRecipe