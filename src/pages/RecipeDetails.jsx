import { useParams } from 'react-router-dom'

import recipes from '../data/recipes'

import '../styles/recipeDetails.css'

function RecipeDetails() {
  const { id } = useParams()
  const recipe = recipes.find(
    (item) => item.id === Number(id)
  )
  if (!recipe) {
    return <h1>Receita não encontrada</h1>
  }
  return (
    <section className="recipe-details">
      {/* TOPO */}
      <div className="recipe-header">
        <img
          src={recipe.image}
          alt={recipe.title}
        />
        <div className="recipe-info">
          {/* TÍTULO */}
          <h1>{recipe.title}</h1>
          {/* DESCRIÇÃO */}
          <p>{recipe.description}</p>
          <div className="recipe-meta">
            <span>⏱ {recipe.time}</span>
            <span>👨‍🍳 {recipe.chef}</span>
          </div>
        </div>
      </div>
      {/* CONTEÚDO */}
      <div className="recipe-content">
        {/* INGREDIENTES */}
        <div className="ingredients">
          <h2>Ingredientes</h2>
          <ul>
            {recipe.ingredients.map((item, index) => (
              <li key={index}>
                {item}
              </li>
            ))}
          </ul>
        </div>
        {/* MODO DE PREPARO */}
        <div className="instructions">
          <h2>Modo de Preparo</h2>
          <ol>
            {recipe.instructions.map((step, index) => (
              <li key={index}>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

export default RecipeDetails