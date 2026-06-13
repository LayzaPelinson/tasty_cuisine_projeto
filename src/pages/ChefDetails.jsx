import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import recipes from '../data/recipes'
import RecipeCard from '../components/RecipeCard'
import { useUser } from '../hooks/useUser.jsx'
import { FiArrowLeft, FiMapPin, FiBook, FiCoffee } from 'react-icons/fi'
import '../styles/chefDetails.css'


const API_BASE = 'http://localhost:8080'

function ChefDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [chefe, setChefe] = useState(null)
  const { recipes } = useUser()

  useEffect(() => {
    fetch(`${API_BASE}/chefe/${id}`)
      .then(r => r.json())
      .then(data => setChefe(data))
  }, [id])

  const chefRecipes = recipes.filter(r => r.chefId === Number(id))
  console.log(chefe);
  if (!chefe) return <h1>Chef não encontrado</h1>

  return (
    <section className="chef-details">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FiArrowLeft /> Voltar
      </button>

      <div className="chef-details-header">
        <img src={chefe.fotoPerfil} alt={chefe.nomeCompleto} className="chef-details-img" />
        <div className="chef-details-info">
          <h1>{chefe.nomeCompleto}</h1>
          <div className="chef-details-meta">
            <span><FiBook /> {chefe.recipes} receitas</span>
          </div>
          <p>{chefe.bio}</p>
        </div>
      </div>

      <div className="chef-details-recipes">
        <h2>Receitas de {chefe.nomeCompleto}</h2>
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
