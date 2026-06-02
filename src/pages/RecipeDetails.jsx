import { Link, useParams, useNavigate } from 'react-router-dom'

import recipes from '../data/recipes'

import '../styles/recipeDetails.css'

function RecipeDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const recipe = recipes.find(
    item => item.id === Number(id)
  )
  if (!recipe) {
    return <h1>Receita não encontrada</h1>
  }
  return (
    <section className="recipe-details">
      <button
        className="back-btn"
        onClick={() => navigate(-1)}
      >
        ← Voltar
      </button>
      <div className="recipe-header">
        <img
          src={recipe.image}
          alt={recipe.title}
        />
        <div className="recipe-info">
          <h1>{recipe.title}</h1>
          <div className="recipe-tags">
            <span className="tag">
              {recipe.category}
            </span>
            <span className="tag easy">
              {recipe.difficulty}
            </span>
          </div>
          <div className="recipe-meta">
            <span>
              ⏱ {recipe.time}
            </span>
            <span>
              👨‍🍳 {recipe.chef}
            </span>
          </div>
          <p>
            {recipe.description}
          </p>
          <div className="recipe-actions">
            <button className="save-btn">
              ♥ Receita Salva
            </button>
            <button className="share-btn">
              ↗ Compartilhar
            </button>
          </div>
        </div>
      </div>
      <div className="recipe-content">
        <div className="ingredients">
          <h2>Ingredientes</h2>
          <ul>
            {recipe.ingredients.map(
              (item, index) => (
                <li key={index}>
                  {item}
                </li>
              )
            )}
          </ul>
        </div>
        <div className="instructions">
          <h2>Modo de Preparo</h2>
          <ol>
            {recipe.instructions.map(
              (step, index) => (
                <li key={index}>
                  {step}
                </li>
              )
            )}
          </ol>
          <div className="chef-tip">
            <h3>💡 Dica do Chef</h3>
            <p>{recipe.chefTip}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RecipeDetails