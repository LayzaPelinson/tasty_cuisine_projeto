import { useState, useEffect } from 'react'
import { useUser } from '../hooks/useUser'
import RecipeCard from './RecipeCard'
import '../styles/favoriteRecipes.css'
import '../styles/publishRecipe.css'
import '../styles/recipesSection.css'
import '../styles/login.css'

function ChefMyRecipes() {
  // 2. Pegamos a nova função que criamos no hook
  const { user, chefRecipes, deleteRecipe, editRecipe, loadChefRecipes,toggleRecipeStatus } = useUser()

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