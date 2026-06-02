import '../styles/recipeCard.css'

import { Link } from 'react-router-dom'

function RecipeCard({ recipe }) {
  return (
    <Link
      to={`/recipe/${recipe.id}`}
      className="recipe-link"
    >
    <div className="recipe-card">
      <div className="recipe-image">
        <img
          src={recipe.image}
          alt={recipe.title}
        />
        <span className="recipe-category">
          {recipe.category}
        </span>
        <button className="favorite-btn">
          ♥
        </button>
      </div>
      <div className="recipe-content">
        <h3>{recipe.title}</h3>
        <div className="recipe-info">
          <span>⏱ {recipe.time}</span>
          <span>👨‍🍳 {recipe.chef}</span>
        </div>
        <span className={`difficulty`}>
          {recipe.difficulty}
        </span>
      </div>
    </div>
  </Link>
)
}

export default RecipeCard