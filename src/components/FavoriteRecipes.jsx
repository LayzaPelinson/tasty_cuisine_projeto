import RecipeCard from './RecipeCard'
import { useUser } from '../hooks/useUser'
import '../styles/favoriteRecipes.css'

function FavoriteRecipes() {
  const { recipes, favoritos, toggleFavorito } = useUser()
  
  // ── Exemplo de encadeamento direto ─────────────────────────────────────────
const favorited = (recipes || [])
  .filter(r => favoritos.some(f => String(f.receita?.codReceitas) === String(r.id)))
  .filter(r => r.active)
  .filter(r => r.activeUser === "ATIVO")
  .filter(r => r.blockedUser === 0)

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