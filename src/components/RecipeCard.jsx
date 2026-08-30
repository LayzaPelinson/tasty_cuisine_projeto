import { useEffect, useState } from 'react'
import '../styles/recipeCard.css'
import { Link } from 'react-router-dom'
import { useUser } from '../hooks/useUser.jsx'
import { FiClock, FiHeart, FiUser } from 'react-icons/fi'

const PLACEHOLDER = 'https://plus.unsplash.com/premium_vector-1753066875872-1ab399ac58c4?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

const API_BASE = 'http://localhost:8080'

function RecipeCard({ recipe, actions }) {
  const { user, favoritos, toggleFavorito } = useUser()
  const [recipeData, setRecipeData] = useState(null)

  useEffect(() => {
    async function loadRecipe() {
      try {
        const res = await fetch(`${API_BASE}/receita/${recipe.id}`)
        if (!res.ok) throw new Error('Erro ao buscar receita')

        const data = await res.json()
        setRecipeData(data)
      } catch (err) {
        console.error(err)
      }
    }

    if (recipe?.id) {
      loadRecipe()
    }
  }, [recipe.id])

  if (!recipeData) return null

  const isFavorited = favoritos.some(
    f => String(f.receita?.codReceitas) === String(recipe.id)
  )

  const isChef = user?.funcao === 'Chefe'

  return (
    <Link
      to={`/recipe/${recipeData.codReceitas}`}
      className="recipe-link"
      state={recipeData}
    >
      <div className="recipe-card">
        <div className="recipe-image">
          <img
            src={recipeData.fotoReceita || PLACEHOLDER}
            alt={recipeData.nomeReceita}
          />

          <span className="recipe-category">
            {recipeData.categoria && recipeData.categoria.length > 0
              ? recipeData.categoria[0].nomeCategoria
              : 'Sem Categoria'}
          </span>

          {!isChef && (
            <button
              className={`favorite-btn${isFavorited ? ' favorited' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation(); // 👈 Impede que o clique suba para o <Link>
                toggleFavorito(recipeData.codReceitas);
              }}
              title={
                isFavorited
                  ? 'Remover dos favoritos'
                  : 'Adicionar aos favoritos'
              }
            >
              <FiHeart />
            </button>
          )}
        </div>

        <div className="recipe-content">
          <h3 className="recipe-title">{recipeData.nomeReceita}</h3>

          <div className="recipe-info">
            <span className="info-item">
              <FiUser className="info-icon" /> {recipeData.usuario?.nome_completo || 'Anônimo'}
            </span>
            <span className="info-item">
              <FiClock className="info-icon" /> {recipeData.tempoPreparo || 'N/A'}
            </span>
          </div>

          {actions && (
            <div
              className="recipe-card-actions"
              onClick={(e) => e.preventDefault()}
            >
              {actions}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default RecipeCard