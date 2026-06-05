import { useUser } from '../hooks/useUser'
import { useFavorites } from '../hooks/useFavorites'
import '../styles/chefStatsPanel.css'

function ChefStatsPanel() {
  const { user, chefRecipes } = useUser()
  const { favorites, history } = useFavorites()

  const myRecipes = chefRecipes.filter(r => r.chefId === user?.id)
  const published = myRecipes.length
  const favorited = myRecipes.filter(r => favorites.includes(r.id)).length
  const visited = myRecipes.filter(r => history.includes(r.id)).length

  const stats = [
    { label: 'Receitas publicadas', sub: 'Total de receitas no ar', value: published },
    { label: 'Receitas favoritadas', sub: 'Salvas por utilizadores', value: favorited },
    { label: 'Receitas visualizadas', sub: 'Visitadas no histórico', value: visited },
  ]

  return (
    <div className="chef-stats-page">
      <div className="chef-stats-overview">
        <h2>Visão Geral</h2>
        <div className="chef-stats-cards">
          {stats.map(s => (
            <div key={s.label} className="chef-stat-card">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
              <span className="stat-sub">{s.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChefStatsPanel
