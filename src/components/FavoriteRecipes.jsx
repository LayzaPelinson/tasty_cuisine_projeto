import RecipeCard from './RecipeCard'
import { useUser } from '../hooks/useUser'
import '../styles/favoriteRecipes.css'

function FavoriteRecipes() {
  const { recipes, favoritos } = useUser()
  
  // Apenas cruza os dados com a lista de favoritos, sem remover as desabilitadas
  const favorited = (recipes || []).filter(r => 
    favoritos.some(f => String(f.receita?.codReceitas) === String(r.id))
  )

  return (
    <section className="favorite-recipes">
      <h2>Receitas Favoritas</h2>
      {favorited.length === 0 ? (
        <p className="no-favorites">Você ainda não salvou nenhuma receita.</p>
      ) : (
        <div className="favorite-grid">
          {favorited.map((recipe) => {
            // Checa todas as condições de bloqueio
            const isDesabilitada = 
              !recipe.active || 
              recipe.activeUser !== "ATIVO" || 
              recipe.blockedUser !== 0

            return (
              <div 
                key={recipe.id} 
                className={`recipe-card-wrapper ${isDesabilitada ? 'disabled' : ''}`}
                style={isDesabilitada ? { opacity: 0.6, pointerEvents: 'none', relative: 'position' } : {}}
              >
                {isDesabilitada && (
                  <span className="badge-indisponivel">
                    Receita indisponível
                  </span>
                )}
                <RecipeCard recipe={recipe} />
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default FavoriteRecipes