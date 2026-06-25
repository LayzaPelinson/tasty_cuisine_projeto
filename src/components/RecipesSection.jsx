import RecipeCard from './RecipeCard'
import '../styles/recipesSection.css'
import { useEffect, useRef } from 'react'
import { useUser } from '../hooks/useUser'

function RecipesSection({ showHeader = true, category, limit, search, locked = false, onGuestClick }) {
  const { recipes, recipesLoaded } = useUser()
  const allRecipes = recipes || []
  
  const norm = (str) => String(str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const q = String(search || '').toLowerCase()
  const sectionRef = useRef(null)

  // 1. LIMPEZA DOS DADOS BRUTOS (Evita que objetos brutos cheguem ao Filter ou Map)
const sanitizedRecipes = allRecipes.map(r => {
  let catText = ''
  if (Array.isArray(r.categoria)) {
    catText = r.categoria[0]?.nomeCategoria || ''
  } else if (r.categoria && typeof r.categoria === 'object') {
    catText = r.categoria.nomeCategoria || ''
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

// 2. FILTRAGEM SEGURA (Agora com validação de Bloqueio e Status)
const filtered = sanitizedRecipes
  .filter((r) => {
    return r.activeUser === "ATIVO";
  })
  .filter((r) => {
    console.log(r)
    return r.blockedUser === 1;
  })
  // 💡 PRIMEIRO FILTRO: Segurança e Status da Receita/Dono
  .filter((r) => {
    return r.active;
  })
  // SEGUNDO FILTRO: Por Categoria selecionada
  .filter((r) => {
    if (!q && category) {
      return norm(r.categoria_segura) === norm(category)
    }
    return true
  })
  // TERCEIRO FILTRO: Pelo termo de busca da barra de pesquisa (q)
  .filter((r) => {
    if (!q) return true
    return (
      norm(r.titulo_seguro).includes(q) ||
      norm(r.categoria_segura).includes(q) ||
      norm(r.chef_seguro).includes(q) ||
      norm(r.dificuldade_segura).includes(q)
    )
  })

  // 3. EXIBIÇÃO (Garante o fatiamento correto da lista)
  const displayed = limit ? filtered.slice(0, limit) : filtered

  useEffect(() => {
    if (!q) return
    const timer = setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 600)
    return () => clearTimeout(timer)
  }, [q])

  if (!recipesLoaded) {
    return (
      <section className="recipes-section" ref={sectionRef}>
        {showHeader && (
          <>
            <span className="recipes-subtitle">Receitas em Destaque</span>
            <h2>As mais populares da nossa comunidade.</h2>
          </>
        )}
        <p className="no-results">Carregando receitas...</p>
      </section>
    )
  }

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
            <div 
              key={recipe.id_seguro} 
              onClick={locked ? onGuestClick : undefined} 
              style={locked ? { cursor: 'pointer' } : {}}
            >
              {/* Passamos o objeto tratado para o Card não quebrar internamente */}
              <RecipeCard recipe={{
                ...recipe,
                id: recipe.id_seguro,
                title: recipe.titulo_seguro,
                category: recipe.categoria_segura,
                chef: recipe.chef_seguro,
                difficulty: recipe.dificuldade_segura
              }} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default RecipesSection