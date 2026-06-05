import RecipeCard from './RecipeCard'
import { useUser } from '../hooks/useUser'
import '../styles/favoriteRecipes.css'

function ChefMyRecipes() {
  const { user, chefRecipes } = useUser()
  const myRecipes = chefRecipes.filter(r => r.chefId === user?.id)

  return (
    <section className="favorite-recipes">
      <h2>Minhas Receitas</h2>
      {myRecipes.length === 0 ? (
        <p className="no-favorites">Você ainda não publicou nenhuma receita.</p>
      ) : (
        <div className="favorite-grid">
          {myRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </section>
  )
}

export default ChefMyRecipes
