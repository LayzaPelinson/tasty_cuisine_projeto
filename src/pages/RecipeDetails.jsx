import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useFavorites } from '../hooks/useFavorites.jsx'
import { useUser } from '../hooks/useUser.jsx'
import recipes from '../data/recipes'
import { FiArrowLeft, FiHeart, FiShare2, FiClock, FiUser, FiInfo } from 'react-icons/fi'
import '../styles/recipeDetails.css'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=75'

function RecipeDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isFavorite, toggle, addToHistory } = useFavorites()
  const { user, chefRecipes } = useUser()
  const allRecipes = [...recipes, ...(chefRecipes || [])]
  const recipe = allRecipes.find(item => item.id === Number(id))
  const isChef = user?.role === 'chef'

  useEffect(() => {
    if (recipe) addToHistory(recipe.id)
  }, [recipe?.id])

  async function handleShare() {
    const data = { title: recipe.title, text: recipe.description, url: window.location.href }
    if (navigator.share) {
      await navigator.share(data)
    } else {
      await navigator.clipboard.writeText(window.location.href)
      alert('Link copiado para a área de transferência!')
    }
  }

  if (!recipe) return <h1>Receita não encontrada</h1>

  return (
    <section className="recipe-details">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FiArrowLeft /> Voltar
      </button>
      <div className="recipe-header">
        <img src={recipe.image || PLACEHOLDER} alt={recipe.title} />
        <div className="recipe-details-info">
          <h1>{recipe.title}</h1>
          <div className="recipe-tags">
            <span className="tag">{recipe.category}</span>
            <span className="tag easy">{recipe.difficulty}</span>
          </div>
          <div className="recipe-meta">
            <span><FiClock /> {recipe.time}</span>
            <span><FiUser /> {recipe.chef}</span>
          </div>
          <p>{recipe.description}</p>
          {!isChef && (
            <div className="recipe-actions">
              <button
                className={`save-btn${isFavorite(recipe.id) ? ' saved' : ''}`}
                onClick={() => toggle(recipe.id)}
              >
                <FiHeart /> {isFavorite(recipe.id) ? 'Receita Salva' : 'Salvar Receita'}
              </button>
              <button className="share-btn" onClick={handleShare}>
                <FiShare2 /> Compartilhar
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="recipe-details-content">
        <div className="ingredients">
          <h2>Ingredientes</h2>
          <ul>
            {recipe.ingredients.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="instructions">
          <h2>Modo de Preparo</h2>
          <ol>
            {recipe.instructions.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
          {recipe.chefTip && (
            <div className="chef-tip">
              <h3><FiInfo /> Dica do Chef</h3>
              <p>{recipe.chefTip}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default RecipeDetails
