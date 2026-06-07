import { useState } from 'react'
import { useUser } from '../hooks/useUser'
import { useNavigate } from 'react-router-dom'
import '../styles/publishRecipe.css'

const CATEGORIES = ['Almoço', 'Jantar', 'Sobremesas', 'Carnes', 'Peixes', 'Massas', 'Sem glúten', 'Vegetariana', 'Outras']
const DIFFICULTIES = ['Fácil', 'Médio', 'Difícil']

function RecipeForm() {
  const { user, publishRecipe } = useUser()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', description: '', category: 'Almoço', difficulty: 'Fácil',
    time: '', ingredients: '', instructions: '', chefTip: '', image: '',
  })
  const [error, setError] = useState(null)

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleImage(e) {
    const file = e.target.files[0]
    if (file) setForm((f) => ({ ...f, image: URL.createObjectURL(file) }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    const result = await publishRecipe({
      ...form,
      ingredients: form.ingredients.split('\n').map((line) => line.trim()).filter(Boolean),
      instructions: form.instructions.split('\n').map((line) => line.trim()).filter(Boolean),
    })

    if (!result.ok) {
      setError(result.error || 'Falha ao publicar a receita.')
      return
    }

    navigate('/chef-profile')
  }

  return (
    <section className="recipe-form-card">
      <h2>Formulário de Receita</h2>
      <p>Preencha os dados abaixo para publicar sua receita.</p>
      <form onSubmit={handleSubmit}>
        <h3>Dados do Autor</h3>
        <div className="grid-2">
          <div>
            <label>Nome Completo:</label>
            <input type="text" value={user?.name ?? ''} readOnly />
          </div>
          <div>
            <label>Nome do Chefe:</label>
            <input type="text" value={user?.name ?? ''} readOnly />
          </div>
        </div>

        <h3>Detalhes da Receita</h3>
        <div>
          <label>Título da Receita</label>
          <input name="title" value={form.title} onChange={handleChange} placeholder="Ex: Risotto ai Funghi Porcini" required />
        </div>

        <div>
          <label>Descrição</label>
          <textarea name="description" rows="2" value={form.description} onChange={handleChange} placeholder="Breve descrição da receita" required />
        </div>

        <div className="grid-3">
          <div>
            <label>Categoria</label>
            <select name="category" value={form.category} onChange={handleChange}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label>Dificuldade</label>
            <select name="difficulty" value={form.difficulty} onChange={handleChange}>
              {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label>Tempo de Preparo</label>
            <input name="time" value={form.time} onChange={handleChange} placeholder="Ex: 45 min" required />
          </div>
        </div>

        <div>
          <label>Ingredientes</label>
          <textarea name="ingredients" rows="5" value={form.ingredients} onChange={handleChange} placeholder={"Liste os ingredientes, um por linha.\nEx: 300g de arroz arbóreo"} required />
        </div>

        <div>
          <label>Modo de Preparo</label>
          <textarea name="instructions" rows="5" value={form.instructions} onChange={handleChange} placeholder={"Descreva o passo a passo, um por linha.\nEx: 1. Refogue a cebola na manteiga."} required />
        </div>

        <div>
          <label>Dica do Chefe</label>
          <textarea name="chefTip" rows="4" value={form.chefTip} onChange={handleChange} placeholder="Compartilhe uma dica especial para essa receita..." />
        </div>

        <div>
          <label>Foto da Receita</label>
          <input type="file" className="file-input" accept="image/*" onChange={handleImage} />
        </div>

        {error && <p className="error-text">{error}</p>}
        <button type="submit">Publicar Receita</button>
      </form>
    </section>
  )
}

export default RecipeForm
