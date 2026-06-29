import { useUser } from '../hooks/useUser.jsx'
import { useState } from 'react'
import RecipeCard from "../components/RecipeCard.jsx";
import Categories from '../components/Categories.jsx'
import { FiSearch } from "react-icons/fi";
import '../styles/recipe.css'

function ChefRecipesView() {
  const { recipes, recipesLoaded } = useUser()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)

  const allRecipes = recipes || []

  const norm = (str) => String(str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const q = norm(search)

  const getCategoryText = (r) => {
    if (Array.isArray(r.category)) return r.category.map(c => c?.nomeCategoria || c).join(' ')
    return r.category || r.categoria_segura || ''
  }

  const filtered = allRecipes.filter(r => {
    const matchSearch = !q ||
      norm(r.title).includes(q) ||
      norm(r.chef).includes(q) ||
      norm(getCategoryText(r)).includes(q) ||
      norm(r.difficulty).includes(q)
    const matchCategory = !activeCategory || norm(getCategoryText(r)).includes(norm(activeCategory))
    return matchSearch && matchCategory
  })

  const byChef = filtered.reduce((acc, r) => {
    const key = r.chef && r.chef !== 'Chefe' ? r.chef : (r.usuario?.nome_completo || r.usuario?.nome_de_usuario || 'Desconhecido')
    if (!acc[key]) acc[key] = []
    acc[key].push(r)
    return acc
  }, {})

  if (!recipesLoaded) {
    return (
      <div className="chef-recipes-loading">
        Carregando receitas...
      </div>
    )
  }

  return (
    <section className="chef-recipes-page">
      <div className="chef-recipes-header">
        <span>Receitas Saudáveis</span>

        <h1>
          Receitas
        </h1>

        <p>
          Explore todas as receitas criadas pelos chefes da plataforma.
        </p>

        <div className="recipes-search chef-search">
          <FiSearch className="search-icon" />
          <input
            className='search-input'
            type="text"
            placeholder="Buscar por nome, chef, categoria ou dificuldade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <Categories
        active={activeCategory}
        onSelect={(cat) => setActiveCategory(prev => prev === cat ? null : cat)}
      />

      {Object.keys(byChef).length === 0 ? (
        <p className="chef-recipes-empty">
          Nenhuma receita encontrada.
        </p>
      ) : (
        Object.entries(byChef).map(([chefName, chefRecipesList]) => (
          <section
            key={chefName}
            className="chef-recipes-section"
          >
            <div className="recipes-grid">
              {chefRecipesList.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                />
              ))}
            </div>
          </section>
        ))
      )}
    </section>
  )
}
export default ChefRecipesView;