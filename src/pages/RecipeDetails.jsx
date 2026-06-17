import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useUser } from '../hooks/useUser.jsx'
import { useFavorites } from '../hooks/useFavorites.jsx'
import { FiArrowLeft, FiHeart, FiShare2, FiUser } from 'react-icons/fi'
import RecipeComments from '../components/RecipeComments'
import '../styles/recipeDetails.css'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=75'

function parseList(value) {
  if (!value) return []
  if (Array.isArray(value)) return value
  try { return JSON.parse(value) } catch { return [] }
}

function RecipeDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, recipes, recipesLoaded, favoritos, toggleFavorito  } = useUser()
  const recipe = recipes.find((item) => item.id === Number(id))
  const isChef = user?.role === 'Chefe'

  const { addToHistory } = useFavorites()
  const ingredients = parseList(recipe?.ingredients)
  const instructions = parseList(recipe?.instructions)
  const isFavorited = favoritos.some(f => String(f.receita?.codReceitas) === String(recipe.id))

  useEffect(() => {
    if (recipe) addToHistory(recipe.id)
  }, [recipe?.id])


  async function handleShare(recipeToShare) {
    const data = { title: recipeToShare.title, text: recipeToShare.description, url: window.location.href }
    if (navigator.share) {
      await navigator.share(data)
    } else {
      await navigator.clipboard.writeText(window.location.href)
      alert('Link copiado para a área de transferência!')
    }
  }

  if (!recipesLoaded) return <h1>Carregando receita...</h1>
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
            <span className="tag">{recipe.category || 'Geral'}</span>
            <span className="tag easy">{recipe.difficulty || 'Médio'}</span>
          </div>
          <div className="recipe-meta">
            <span><FiUser /> {recipe.chef}</span>
          </div>
          <p>{recipe.description}</p>
          {!isChef && (
            <div className="recipe-actions">
              <button
                className={`save-btn${isFavorited ? ' saved' : ''}`}
                onClick={() => toggleFavorito(recipe.id)}
              >
                <FiHeart /> {isFavorited ? 'Receita Salva' : 'Salvar Receita'}
              </button>
              <button className="share-btn" onClick={() => handleShare(recipe)}>
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
            {ingredients.map((item, index) => (
              <li key={index}>
                {typeof item === 'object'
                  ? `${item.quantidade} ${item.unidade} — ${item.nome}`
                  : item}
              </li>
            ))}
          </ul>
        </div>
        <div className="instructions">
          <h2>Modo de Preparo</h2>
          <ol>
            {instructions.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
      <RecipeComments recipeId={recipe.id} isUsuario={!isChef && !!user} />
    </section>
  )
}

export default RecipeDetails
