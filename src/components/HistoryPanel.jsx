import RecipeCard from './RecipeCard'
import recipes from '../data/recipes'
import { useFavorites } from '../hooks/useFavorites.jsx'
import '../styles/favoriteRecipes.css'

function HistoryPanel() {
  const { history } = useFavorites()
  const visited = history.map((id) => recipes.find((r) => r.id === id)).filter(Boolean)

  return (
    <div className="favorite-recipes">
      <h2>Histórico</h2>
      {visited.length === 0 ? (
        <p className="no-favorites">Nenhuma receita visitada ainda.</p>
      ) : (
        <div className="favorite-grid">
          {visited.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  )
}

export default HistoryPanel
