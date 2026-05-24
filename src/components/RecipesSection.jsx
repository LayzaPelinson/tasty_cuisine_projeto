import RecipeCard from './RecipeCard'
import recipes from '../data/recipes'

import '../styles/recipesSection.css'

function RecipesSection() {
  return (
    <section className="recipes-section">
      <span className="recipes-subtitle">
        Receitas em Destaque
      </span>
      <h2>
        As mais populares da nossa comunidade.
      </h2>
      <div className="recipes-grid">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
          />
        ))}
      </div>
    </section>
  )
}

export default RecipesSection