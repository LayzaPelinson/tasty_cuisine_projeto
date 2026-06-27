import RecipeCard from './RecipeCard'
import '../styles/recipesSection.css'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser'

function RecipesSection({ showHeader = true, category, limit, search, locked = false, onGuestClick }) {
  const navigate = useNavigate()
  const { recipes, recipesLoaded } = useUser()
  const allRecipes = recipes || []

  const norm = (str) => String(str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const q = String(search || '').toLowerCase()
  const sectionRef = useRef(null)

  // 1. LIMPEZA DOS DADOS BRUTOS (Evita que objetos brutos cheguem ao Filter ou Map)
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

    // 💡 TRATAMENTO DOS INGREDIENTES: Garante mapeamento correto para português/inglês e snake_case
    const rawIngredients = r.ingredientes || r.itens || r.ingredients || []
    const ingredientes_seguros = Array.isArray(rawIngredients)
      ? rawIngredients.map(ing => {
        if (typeof ing === 'object' && ing !== null) {
          return {
            // Mapeia caso o back-end mande com outros nomes de coluna (ex: qtd, qnt, etc)
            quantidade: ing.quantidade ?? ing.qtd ?? ing.qtdIngrediente ?? '',
            unidade: ing.unidade ?? ing.uniMedida ?? ing.medida ?? '',
            nome: ing.nome ?? ing.nomeIngrediente ?? ing.name ?? ''
          }
        }
        return ing // Se for string pura, mantém
      })
      : []

    return {
      ...r,
      id_seguro: r.codReceitas || r.id || Math.random(),
      titulo_seguro: r.nomeReceita || r.title || 'Receita sem título',
      categoria_segura: String(catText),
      chef_seguro: r.usuario?.nome_completo || r.usuario?.nome_de_usuario || r.chef || 'Anônimo',
      dificuldade_segura: r.difficulty || '',
      ingredientes_seguros // 💡 Nova propriedade higienizada anexada ao objeto
    }
  })

  // 2. FILTRAGEM SEGURA (Agora com validação de Bloqueio e Status)
  const filtered = sanitizedRecipes
    .filter((r) => {
      return r.activeUser === "ATIVO";
    })
    .filter((r) => {
      console.log(r)
      return r.blockedUser === 0;
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
      <section className="chef-recipes-page" ref={sectionRef}>
        {showHeader && (
          <div className="chef-recipes-header">
            <span>Receitas em Destaque</span>
            <h1>As mais populares da nossa comunidade.</h1>
          </div>
        )}
        <p className="chef-recipes-empty">Carregando receitas...</p>
      </section>
    )
  }

  return (
    <section className="chef-recipes-page" ref={sectionRef}>
      {showHeader && (
        <div className="chef-recipes-header">
          <span>Receitas em Destaque</span>
          <h1>As mais populares da nossa comunidade.</h1>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="chef-recipes-empty">Nenhuma receita encontrada.</p>
      ) : (
        <div className="recipes-grid">
          {displayed.map((recipe) => (
            <div
              key={recipe.id_seguro}
              onClick={() => locked ? onGuestClick?.() : navigate(`/receita/${recipe.id_seguro}`)}
              style={{ cursor: 'pointer' }}
            >
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default RecipesSection