import RecipeCard from './RecipeCard'
import { useFavorites } from '../hooks/useFavorites.jsx'
import { useUser } from '../hooks/useUser'
import '../styles/favoriteRecipes.css'

function FavoriteRecipes() {
  const { favorites } = useFavorites()
  const { recipes } = useUser()
  const favorited = (recipes || []).filter((r) => favorites.includes(r.id))

  return (
    <section className="favorite-recipes">
      <h2>Receitas Favoritas</h2>
      {favorited.length === 0 ? (
        <p className="no-favorites">Você ainda não salvou nenhuma receita.</p>
      ) : (
        <div className="favorite-grid">
          {favorited.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </section>
  )
}

export default FavoriteRecipes
