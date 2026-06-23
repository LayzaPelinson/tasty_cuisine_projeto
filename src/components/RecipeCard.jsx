import '../styles/recipeCard.css'
import { Link } from 'react-router-dom'
import { useUser } from '../hooks/useUser.jsx'
import { FiHeart, FiClock, FiUser } from 'react-icons/fi'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=75'

function RecipeCard({ recipe, actions }) {
  const { user, favoritos, toggleFavorito } = useUser()
  
  const isFavorited = favoritos.some(f => String(f.receita?.codReceitas) === String(recipe.id))
  const isChef = user?.funcao === 'Chefe'
  return (
    <Link to={`/recipe/${recipe.id}`} className="recipe-link" state={recipe}>
      <div className="recipe-card">
        <div className="recipe-image">
          <img src={recipe.image || PLACEHOLDER} alt={recipe.title} />
          <span className="recipe-category">{recipe.category?.[0]?.nomeCategoria || 'Sem Categoria'}</span>
          {!isChef && (
            <button
              className={`favorite-btn${isFavorited ? ' favorited' : ''}`}
              onClick={(e) => { e.preventDefault(); toggleFavorito(recipe.id) }}
              title={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              <FiHeart />
            </button>
          )}
        </div>
        <div className="recipe-content">
          <h3>{recipe.title}</h3>
          <div className="recipe-info">
            
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