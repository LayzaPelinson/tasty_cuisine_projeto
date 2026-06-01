import RecipeCard from './RecipeCard'

import recipes from '../data/recipes'

import '../styles/favoriteRecipes.css'

function FavoriteRecipes() {
  return (
    <section className="favorite-recipes">
      <h2>Receitas Favoritas</h2>
      <div className="favorite-grid">
        {recipes.slice(0, 2).map(recipe => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
          />
        ))}
      </div>
    </section>
  )
}

export default FavoriteRecipes