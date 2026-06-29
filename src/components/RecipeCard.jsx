import { useEffect, useState } from 'react'
import '../styles/recipeCard.css'
import { Link } from 'react-router-dom'
import { useUser } from '../hooks/useUser.jsx'
import { FiHeart, FiUser } from 'react-icons/fi'

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=75'

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
        console.log(res)
      }
    }

    if (recipe?.id) {
      loadRecipe()
      console.log(recipe)
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
            {recipeData.categoria.length > 0
              ? recipeData.categoria[0].nomeCategoria
              : 'Sem Categoria'}
          </span>

          {!isChef && (
            <button
              className={`favorite-btn${isFavorited ? ' favorited' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                toggleFavorito(recipeData.codReceitas)
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
          <h3>{recipeData.nomeReceita}</h3>

          <div className="recipe-info">
            <span>
              <FiUser /> {recipeData.usuario.nome_de_usuario}
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