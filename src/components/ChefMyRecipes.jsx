import { useState } from 'react'
import { useUser } from '../hooks/useUser'
import '../styles/favoriteRecipes.css'
import '../styles/publishRecipe.css'

const CATEGORIES = ['Almoço', 'Jantar', 'Sobremesas', 'Carnes', 'Peixes', 'Massas', 'Sem glúten', 'Vegetariana']
const DIFFICULTIES = ['Fácil', 'Médio', 'Difícil']

function EditModal({ recipe, onSave, onClose }) {
  const [form, setForm] = useState({
    title: recipe.title,
    description: recipe.description,
    category: recipe.category,
    difficulty: recipe.difficulty,
    time: recipe.time,
    ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.join('\n') : recipe.ingredients,
    instructions: Array.isArray(recipe.instructions) ? recipe.instructions.join('\n') : recipe.instructions,
    chefTip: recipe.chefTip || '',
  })

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSave({
      ...form,
      ingredients: form.ingredients.split('\n').filter(Boolean),
      instructions: form.instructions.split('\n').filter(Boolean),
    })
  }

  return (
    <div className="guest-overlay" onClick={onClose}>
      <div className="edit-modal" onClick={e => e.stopPropagation()}>
        <h2>Editar Receita</h2>
        <form onSubmit={handleSubmit}>
          <label>Título</label>
          <input name="title" value={form.title} onChange={handleChange} required />

          <label>Descrição</label>
          <textarea name="description" rows="2" value={form.description} onChange={handleChange} required />

          <div className="grid-3">
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
            <div>
              <label>Tempo</label>
              <input name="time" value={form.time} onChange={handleChange} required />
            </div>
          </div>

          <label>Ingredientes</label>
          <textarea name="ingredients" rows="4" value={form.ingredients} onChange={handleChange} required />

          <label>Modo de Preparo</label>
          <textarea name="instructions" rows="4" value={form.instructions} onChange={handleChange} required />

          <label>Dica do Chefe</label>
          <textarea name="chefTip" rows="2" value={form.chefTip} onChange={handleChange} />

          <div className="edit-modal-actions">
            <button type="submit" className="btn-save">Salvar</button>
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ChefMyRecipes() {
  const { user, chefRecipes, deleteRecipe, editRecipe } = useUser()
  const myRecipes = chefRecipes.filter(r => r.chefId === user?.id)
  const [editing, setEditing] = useState(null)

  return (
    <section className="favorite-recipes">
      <h2>Minhas Receitas</h2>
      {myRecipes.length === 0 ? (
        <p className="no-favorites">Você ainda não publicou nenhuma receita.</p>
      ) : (
        <div className="chef-recipes-grid">
          {myRecipes.map(recipe => (
            <div key={recipe.id} className="chef-recipe-item">
              {recipe.image && <img src={recipe.image} alt={recipe.title} className="chef-recipe-img" />}
              <div className="chef-recipe-info">
                <h3>{recipe.title}</h3>
                <p>{recipe.category} · {recipe.difficulty} · {recipe.time}</p>
                <p className="chef-recipe-desc">{recipe.description}</p>
              </div>
              <div className="chef-recipe-actions">
                <button className="btn-edit" onClick={() => setEditing(recipe)}>Editar</button>
                <button className="btn-delete" onClick={() => deleteRecipe(recipe.id)}>Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {editing && (
        <EditModal
          recipe={editing}
          onSave={(updated) => { editRecipe(editing.id, updated); setEditing(null) }}
          onClose={() => setEditing(null)}
        />
      )}
    </section>
  )
}

export default ChefMyRecipes
