import RecipeCard from './RecipeCard'
import recipes from '../data/recipes'
import '../styles/recipesSection.css'

function RecipesSection({ showHeader = true, category }) {
  const filtered = category
    ? recipes.filter((r) => r.category === category)
    : recipes

  return (
    <section className="recipes-section">
      {showHeader && (
        <>
          <span className="recipes-subtitle">Receitas em Destaque</span>
          <h2>As mais populares da nossa comunidade.</h2>
        </>
      )}
      {filtered.length === 0 ? (
        <p className="no-results">Nenhuma receita encontrada para esta categoria.</p>
      ) : (
        <div className="recipes-grid">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </section>
  )
}

export default RecipesSection
