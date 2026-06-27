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
  //const q = norm(search)

  /*const filtered =
      allRecipes.filter((r) =>
        norm(r.title).includes(q) ||
        norm(r.category).includes(q) ||
        norm(r.chef || '').includes(q) ||
        norm(r.difficulty || '').includes(q)
      )*/

  const byChef = allRecipes.reduce((acc, r) => {
    const key = r.chef || 'Desconhecido'
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
            <h2>{chefName}</h2>

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