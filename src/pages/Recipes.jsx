import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import RecipesHero from '../components/RecipesHero'
import RecipesSection from '../components/RecipesSection'
import Categories from '../components/Categories'
import RecipeCard from '../components/RecipeCard'
import { useUser } from '../hooks/useUser'
import '../styles/recipesSection.css'
import '../styles/recipesHero.css'
import { FiSearch } from 'react-icons/fi'

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

function ChefRecipesView() {
  const { user, recipes, recipesLoaded } = useUser()
  const [search, setSearch] = useState('')
  const allRecipes = recipes || []
  const q = norm(search)

  const filtered = q
    ? allRecipes.filter((r) =>
        norm(r.title).includes(q) ||
        norm(r.category).includes(q) ||
        norm(r.chef || '').includes(q) ||
        norm(r.difficulty || '').includes(q)
      )
    : allRecipes

  const byChef = filtered.reduce((acc, r) => {
    const key = r.chef || 'Desconhecido'
    if (!acc[key]) acc[key] = []
    acc[key].push(r)
    return acc
  }, {})

  if (!recipesLoaded) {
    return <p style={{ textAlign: 'center', color: '#888', fontSize: '18px' }}>Carregando receitas...</p>
  }

  return (
    <div style={{ background: '#f4efe6', minHeight: '100vh', padding: '60px 8%' }}>
      <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '56px', color: '#f47c20', textAlign: 'center', marginBottom: '32px' }}>
        Receitas por Chef
      </h1>
      <div className="recipes-search" style={{ maxWidth: '600px', margin: '0 auto 52px' }}>
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Buscar por nome, chef, categoria ou dificuldade..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {Object.keys(byChef).length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888', fontSize: '18px' }}>Nenhuma receita encontrada.</p>
      ) : (
        Object.entries(byChef).map(([chefName, chefRecipesList]) => (
          <div key={chefName} style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '28px', color: '#2c1d18', marginBottom: '24px', borderBottom: '2px solid #f47c20', paddingBottom: '10px' }}>
              {chefName}
            </h2>
            <div className="recipes-grid">
              {chefRecipesList.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

function Recipes() {
  const { user } = useUser()
  const [searchParams, setSearchParams] = useSearchParams()
  const active = searchParams.get('categoria') || ''
  const search = searchParams.get('busca') || ''

  if (user?.role === 'chef') return <ChefRecipesView />

  function handleSelect(cat) {
    const params = {}
    if (active !== cat) params.categoria = cat
    if (search) params.busca = search
    setSearchParams(params)
  }

  function handleSearch(value) {
    const params = {}
    if (active) params.categoria = active
    if (value) params.busca = value
    setSearchParams(params)
  }

  return (
    <>
      <RecipesHero search={search} onSearch={handleSearch} />
      <Categories onSelect={handleSelect} active={active} />
      <RecipesSection showHeader={false} category={active || null} search={search} />
    </>
  )
}

export default Recipes
