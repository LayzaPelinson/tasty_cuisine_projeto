import { useUser } from '../hooks/useUser.jsx'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RecipeCard from "../components/RecipeCard.jsx"
import Categories from '../components/Categories.jsx'
import { FiSearch } from "react-icons/fi"
import '../styles/recipe.css'

function ChefRecipesView() {
  const navigate = useNavigate()
  const { recipes, recipesLoaded } = useUser()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)

  const allRecipes = recipes || []

  const norm = (str) => String(str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const q = norm(search)

  // 1. HIGIENIZAÇÃO DOS DADOS
  const sanitizedRecipes = allRecipes.map(r => {
    let catText = ''
    if (Array.isArray(r.categoria)) {
      catText = r.categoria[0]?.nomeCategoria || ''
    } else if (r.categoria && typeof r.categoria === 'object') {
      catText = r.categoria.nomeCategoria || ''
    } else if (Array.isArray(r.category)) {
      catText = r.category.map(c => c?.nomeCategoria || c).join(' ')
    } else {
      catText = r.category || ''
    }

    return {
      ...r,
      id_seguro: r.codReceitas || r.id || Math.random(),
      titulo_seguro: r.nomeReceita || r.title || 'Receita sem título',
      categoria_segura: String(catText),
      chef_seguro: r.usuario?.nome_completo || r.usuario?.nome_de_usuario || r.chef || 'Anônimo',
      dificuldade_segura: r.difficulty || ''
    }
  })

  // 2. FILTRAGEM SEGURA (Status + Busca + Categoria)
  const filtered = sanitizedRecipes
    .filter((r) => r.activeUser === "ATIVO")
    .filter((r) => r.blockedUser === 0)
    .filter((r) => r.active)
    .filter((r) => {
      const matchSearch = !q ||
        norm(r.titulo_seguro).includes(q) ||
        norm(r.chef_seguro).includes(q) ||
        norm(r.categoria_segura).includes(q) ||
        norm(r.dificuldade_segura).includes(q)

      const matchCategory = !activeCategory || norm(r.categoria_segura).includes(norm(activeCategory))

      return matchSearch && matchCategory
    })

  // 3. AGRUPAMENTO POR CHEF
  const byChef = filtered.reduce((acc, r) => {
    const key = r.chef_seguro
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
        <h1>Receitas</h1>
        <p>Explore todas as receitas criadas pelos chefes da plataforma.</p>

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

      {/* 
      {<Categories
        active={activeCategory}
        onSelect={(cat) => setActiveCategory(prev => prev === cat ? null : cat)}
      />} 
      */}

      {Object.keys(byChef).length === 0 ? (
        <p className="chef-recipes-empty">
          Nenhuma receita encontrada.
        </p>
      ) : (
        Object.entries(byChef).map(([chefName, chefRecipesList]) => (
          <section key={chefName} className="chef-recipes-section">
            <h2>{chefName}</h2>
            <div className="recipes-grid">
              {chefRecipesList.map((recipe) => (
                <RecipeCard key={recipe.id_seguro} recipe={recipe} />
              ))}
            </div>
          </section>
        ))
      )}
    </section>
  )
}

export default ChefRecipesView