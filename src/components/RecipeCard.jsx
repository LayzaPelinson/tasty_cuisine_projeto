import '../styles/recipeCard.css'
import { Link } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites.jsx'
import { FiHeart, FiClock, FiUser } from 'react-icons/fi'

function RecipeCard({ recipe }) {
  const { isFavorite, toggle } = useFavorites()
  const favorited = isFavorite(recipe.id)

  return (
    <Link to={`/recipe/${recipe.id}`} className="recipe-link">
      <div className="recipe-card">
        <div className="recipe-image">
          <img src={recipe.image} alt={recipe.title} />
          <span className="recipe-category">{recipe.category}</span>
          <button
            className={`favorite-btn${favorited ? ' favorited' : ''}`}
            onClick={(e) => { e.preventDefault(); toggle(recipe.id) }}
            title={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <FiHeart />
          </button>
        </div>
        <div className="recipe-content">
          <h3>{recipe.title}</h3>
          <div className="recipe-info">
            <span><FiClock /> {recipe.time}</span>
            <span><FiUser /> {recipe.chef}</span>
          </div>
          <span className={`difficulty difficulty--${recipe.difficulty.toLowerCase()}`}>{recipe.difficulty}</span>
        </div>
      </div>
    </Link>
  )
}

export default RecipeCard
