import RecipeCard from './RecipeCard'
import recipes from '../data/recipes'
import '../styles/recipesSection.css'
import { useEffect, useRef } from 'react'

function RecipesSection({ showHeader = true, category, limit, search }) {
  const norm = (str) => str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const q = norm(search || '')
  const sectionRef = useRef(null)

  const filtered = recipes
    .filter((r) => !q && category ? r.category === category : true)
    .filter((r) =>
      !q ||
      norm(r.title).includes(q) ||
      norm(r.category).includes(q) ||
      norm(r.difficulty).includes(q)
    )
  const displayed = limit ? filtered.slice(0, limit) : filtered

  useEffect(() => {
    if (!q) return
    const timer = setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 600)
    return () => clearTimeout(timer)
  }, [q])

  return (
    <section className="recipes-section" ref={sectionRef}>
      {showHeader && (
        <>
          <span className="recipes-subtitle">Receitas em Destaque</span>
          <h2>As mais populares da nossa comunidade.</h2>
        </>
      )}
      {filtered.length === 0 ? (
        <p className="no-results">Nenhuma receita encontrada para esta categoria.</p>
      ) : (
        <div className="recipes-grid">
          {displayed.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </section>
  )
}

export default RecipesSection
