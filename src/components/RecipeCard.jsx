import '../styles/recipeCard.css'
import { Link } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites.jsx'
import { useUser } from '../hooks/useUser.jsx'
import { FiHeart, FiClock, FiUser } from 'react-icons/fi'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=75'

function RecipeCard({ recipe, actions }) {
  const { isFavorite, toggle } = useFavorites()
  const { user } = useUser()
  const favorited = isFavorite(recipe.id)
  const isChef = user?.role === 'chef'

  return (
    <Link to={`/recipe/${recipe.id}`} className="recipe-link">
      <div className="recipe-card">
        <div className="recipe-image">
          <img src={recipe.image || PLACEHOLDER} alt={recipe.title} />
          <span className="recipe-category">{recipe.category}</span>
          {!isChef && (
            <button
              className={`favorite-btn${favorited ? ' favorited' : ''}`}
              onClick={(e) => { e.preventDefault(); toggle(recipe.id) }}
              title={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              <FiHeart />
            </button>
          )}
        </div>
        <div className="recipe-content">
          <h3>{recipe.title}</h3>
          <div className="recipe-info">
            <span><FiClock /> {recipe.time}</span>
            <span><FiUser /> {recipe.chef}</span>
          </div>
          <span className={`difficulty difficulty--${(recipe.difficulty || '').toLowerCase()}`}>{recipe.difficulty}</span>
          {actions && <div className="recipe-card-actions" onClick={e => e.preventDefault()}>{actions}</div>}
        </div>
      </div>
    </Link>
  )
}

export default RecipeCard
