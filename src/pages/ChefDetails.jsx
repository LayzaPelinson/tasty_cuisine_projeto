import { useParams, useNavigate } from 'react-router-dom'
import chefs from '../data/chefs'
import recipes from '../data/recipes'
import RecipeCard from '../components/RecipeCard'
import '../styles/chefDetails.css'

function ChefDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const chef = chefs.find(c => c.id === Number(id))
  const chefRecipes = recipes.filter(r => r.chefId === Number(id))

  if (!chef) return <h1>Chef não encontrado</h1>

  return (
    <section className="chef-details">
      <button className="back-btn" onClick={() => navigate(-1)}>← Voltar</button>

      <div className="chef-details-header">
        <img src={chef.image} alt={chef.name} className="chef-details-img" />
        <div className="chef-details-info">
          <h1>{chef.name}</h1>
          <div className="chef-details-meta">
            <span>🍽 {chef.specialty}</span>
            <span>📍 {chef.location}</span>
            <span>📖 {chef.recipes} receitas</span>
          </div>
          <p>{chef.bio}</p>
        </div>
      </div>

      <div className="chef-details-recipes">
        <h2>Receitas de {chef.name}</h2>
        {chefRecipes.length === 0 ? (
          <p className="no-recipes">Nenhuma receita publicada ainda.</p>
        ) : (
          <div className="chef-recipes-grid">
            {chefRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default ChefDetails
