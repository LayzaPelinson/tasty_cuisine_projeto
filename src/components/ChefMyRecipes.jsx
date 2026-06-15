import { useState } from 'react'
import { useUser } from '../hooks/useUser'
import RecipeCard from './RecipeCard'
import '../styles/favoriteRecipes.css'
import '../styles/publishRecipe.css'
import '../styles/recipesSection.css'
import '../styles/login.css'

const CATEGORIES = ['Almoço', 'Jantar', 'Sobremesas', 'Carnes', 'Peixes', 'Massas', 'Sem glúten', 'Vegetariana', 'Outras']
const DIFFICULTIES = ['Fácil', 'Médio', 'Difícil']

function EditModal({ recipe, onSave, onClose }) {
  const [form, setForm] = useState({
    title: recipe.title,
    description: recipe.description,
    category: recipe.category,
    difficulty: recipe.difficulty,
    ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.join('\n') : recipe.ingredients,
    instructions: Array.isArray(recipe.instructions) ? recipe.instructions.join('\n') : recipe.instructions,
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

          <label>Ingredientes</label>
          <textarea name="ingredients" rows="4" value={form.ingredients} onChange={handleChange} required />

          <label>Modo de Preparo</label>
          <textarea name="instructions" rows="4" value={form.instructions} onChange={handleChange} required />

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
  const [confirmDelete, setConfirmDelete] = useState(null) // recipe a excluir
  const [deleteError, setDeleteError] = useState('')

  async function handleDelete() {
    setDeleteError('')
    const res = await deleteRecipe(confirmDelete.id)
    if (res.ok) setConfirmDelete(null)
    else setDeleteError('Falha ao excluir a receita. Tente novamente.')
  }

  return (
    <section className="favorite-recipes">
      <h2>Minhas Receitas</h2>
      {myRecipes.length === 0 ? (
        <p className="no-favorites">Você ainda não publicou nenhuma receita.</p>
      ) : (
        <div className="recipes-grid">
          {myRecipes.map(recipe => (
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
          onSave={(updated) => { editRecipe(editing.id, updated); setEditing(null) }}
          onClose={() => setEditing(null)}
        />
      )}

      {confirmDelete && (
        <div className="reactivate-overlay">
          <div className="reactivate-modal">
            <h3>Excluir Receita</h3>
            <p>Tem certeza que deseja excluir <strong>{confirmDelete.title}</strong>? Esta ação não pode ser desfeita.</p>
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
