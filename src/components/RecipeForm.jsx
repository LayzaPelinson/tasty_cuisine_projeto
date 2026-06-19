import { useState, useEffect } from 'react'
import { useUser } from '../hooks/useUser'
import { useNavigate } from 'react-router-dom'
import '../styles/publishRecipe.css'

const DIFFICULTIES = ['Fácil', 'Médio', 'Difícil']
const UNITS = ['unidades', 'gramas', 'kg', 'ml', 'litros', 'xícaras', 'colheres', 'fatias', 'dentes', 'pitadas', 'a gosto']
const API_BASE = 'http://localhost:8080' // Ajuste para a URL da sua API se necessário

function RecipeForm() {
  const { user, publishRecipe } = useUser()
  const navigate = useNavigate()

  // Estado para armazenar as categorias vindas do banco
  const [categoriesFromDb, setCategoriesFromDb] = useState([])
  // Estado para armazenar as categorias selecionadas (IDs)
  const [selectedCategories, setSelectedCategories] = useState([])

  const [form, setForm] = useState({
    title: '', description: '', difficulty: 'Fácil', image: '',
  })
  const [ingredients, setIngredients] = useState([])
  const [ingInput, setIngInput] = useState({ quantidade: '', unidade: 'gramas', nome: '' })
  const [steps, setSteps] = useState([])
  const [stepInput, setStepInput] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // Carrega as categorias do banco de dados ao montar o componente
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch(`${API_BASE}/categoria/findAll`) // Ajuste para o seu endpoint de listar categorias
        if (res.ok) { 
          const data = await res.json()
          setCategoriesFromDb(data) // Espera algo como: [{ id: 1, nome: 'Massas' }, ...]
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

  // Manipula a seleção/desseleção das checkboxes de categoria
  function handleCategoryChange(idCategoria) {
    setSelectedCategories(prev =>
      prev.includes(idCategoria)
        ? prev.filter(id => id !== idCategoria) // Remove se já estava marcado
        : [...prev, idCategoria] // Adiciona se não estava marcado
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

    const result = await publishRecipe({
      title: form.title,
      description: form.description,
      difficulty: form.difficulty,
      time: form.time,
      image: form.image,
      ingredients,
      instructions: steps,
      categorias: selectedCategories, // Enviando o array de IDs para a nova lógica da função
    })

    if (!result.ok) return setError(result.error || 'Falha ao publicar a receita.')
    setSuccess(true)
    setTimeout(() => navigate('/chef-profile'), 2000)
  }

  return (
    <section className="recipe-form-card">
      <h2>Formulário de Receita</h2>
      <p>Preencha os dados abaixo para publicar sua receita.</p>
      <form onSubmit={handleSubmit}>
        <h3>Dados do Autor</h3>
        <div className="grid-2">
          <div>
            <label>Nome Completo</label>
            <input type="text" value={user?.name ?? ''} readOnly />
          </div>
          <div>
            <label>Nome do Chefe</label>
            <input type="text" value={user?.username ?? user?.name ?? ''} readOnly />
          </div>
        </div>

        <h3>Detalhes da Receita</h3>
        <div>
          <label>Título da Receita</label>
          <input name="title" value={form.title} onChange={handleChange} placeholder="Ex: Bolo de Chocolate" required />
        </div>
        <div>
          <label>Descrição</label>
          <textarea name="description" rows="2" value={form.description} onChange={handleChange} placeholder="Breve descrição da receita" required />
        </div>
        
        <div className="grid-2">
          {/* Caixa de seleção de Dificuldade */}
          <div>
            <label>Dificuldade</label>
            <select name="difficulty" value={form.difficulty} onChange={handleChange}>
              {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {/* Seção Nova de Categorias dinâmicas em formato Checkbox */}
        <h3>Categorias</h3>
        <div className="categories-checkbox-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', margin: '10px 0' }}>
          {categoriesFromDb.length === 0 ? (
            <p style={{ fontSize: '14px', color: '#888' }}>Carregando categorias...</p>
          ) : (
            categoriesFromDb.map(c => {
              // Ajuste 'c.id' ou 'c.codCategoria' dependendo de como o seu DTO do Java devolve o ID
              const idCat = c.id || c.codCategoria; 
              const nomeCat = c.nome || c.nomeCategoria;

              return (
                <label key={idCat} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedCategories.includes(idCat)}
                    onChange={() => handleCategoryChange(idCat)}
                  />
                  {nomeCat}
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
          />
          <select value={ingInput.unidade} onChange={e => setIngInput(f => ({ ...f, unidade: e.target.value }))}>
            {UNITS.map(u => <option key={u}>{u}</option>)}
          </select>
          <input
            placeholder="Ingrediente (ex: Ovos)"
            value={ingInput.nome}
            onChange={e => setIngInput(f => ({ ...f, nome: e.target.value }))}
          />
          <button type="button" className="add-btn" onClick={addIngredient}>+ Adicionar</button>
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
          <button type="button" className="add-btn" onClick={addStep}>+ Adicionar Passo</button>
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

        <h3>Foto da Receita</h3>
        <div>
          <label>URL da imagem</label>
          <input name="image" value={form.image} onChange={handleChange} placeholder="https://exemplo.com/foto.jpg" />
        </div>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="publish-success">✓ Receita publicada com sucesso! Redirecionando...</p>}
        <button type="submit" className="submit-btn">Publicar Receita</button>
      </form>
    </section>
  )
}

export default RecipeForm