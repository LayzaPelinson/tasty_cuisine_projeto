import { useUser } from '../hooks/useUser'
import '../styles/chefStatsPanel.css'

function ChefStatsPanel() {
  const { user, chefRecipes, recipeStats } = useUser()

  const myRecipes = chefRecipes.filter(r => r.chefId === user?.id)
  const published = myRecipes.length
  const favorited = myRecipes.reduce((sum, r) => sum + (recipeStats[r.id]?.favorites || 0), 0)
  const visited = myRecipes.reduce((sum, r) => sum + (recipeStats[r.id]?.views || 0), 0)

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
