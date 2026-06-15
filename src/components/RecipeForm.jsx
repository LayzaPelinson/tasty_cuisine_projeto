import { useState } from 'react'
import { useUser } from '../hooks/useUser'
import { useNavigate } from 'react-router-dom'
import '../styles/publishRecipe.css'

const CATEGORIES = ['Almoço', 'Jantar', 'Sobremesas', 'Carnes', 'Peixes', 'Massas', 'Sem glúten', 'Vegetariana', 'Outras']
const DIFFICULTIES = ['Fácil', 'Médio', 'Difícil']
const UNITS = ['unidades', 'gramas', 'kg', 'ml', 'litros', 'xícaras', 'colheres', 'fatias', 'dentes', 'pitadas', 'a gosto']

function RecipeForm() {
  const { user, publishRecipe } = useUser()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '', description: '', category: 'Almoço', difficulty: 'Fácil', image: '',
  })
  const [ingredients, setIngredients] = useState([])
  const [ingInput, setIngInput] = useState({ quantidade: '', unidade: 'gramas', nome: '' })
  const [steps, setSteps] = useState([])
  const [stepInput, setStepInput] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

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

    const result = await publishRecipe({
      title: form.title,
      description: form.description,
      category: form.category,
      difficulty: form.difficulty,
      time: form.time,
      image: form.image,
      ingredients,
      instructions: steps,
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
          <div>
            <label>Categoria</label>
            <select name="category" value={form.category} onChange={handleChange}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label>Dificuldade</label>
            <select name="difficulty" value={form.difficulty} onChange={handleChange}>
              {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
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
