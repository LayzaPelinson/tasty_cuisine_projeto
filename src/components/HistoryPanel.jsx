import RecipeCard from './RecipeCard'
import { useFavorites } from '../hooks/useFavorites.jsx'
import { useUser } from '../hooks/useUser'
import '../styles/favoriteRecipes.css'

function HistoryPanel() {
  const { history } = useFavorites()
  const { recipes } = useUser()
  const visited = history
    .map((id) => (recipes || []).find((r) => r.id === id))
    .filter(Boolean)

  return (
    <section className="favorite-recipes">
      <h2>Histórico de Receitas</h2>
      {visited.length === 0 ? (
        <p className="no-favorites">Você ainda não visualizou nenhuma receita.</p>
      ) : (
        <div className="favorite-grid">
          {visited.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </section>
  )
}

export default HistoryPanel
