import { useUser } from '../hooks/useUser'
import '../styles/chefStatsPanel.css'
import { useState, useEffect } from 'react'

function ChefStatsPanel() {
  const { user, chefRecipes, recipeStats } = useUser()
    const [receipe, setReceipe] = useState('')
    const [fav, setFav] = useState('')

const API_BASE = 'http://localhost:8080'

  let stats = [
    { label: 'Receitas publicadas', sub: 'Total de receitas no ar', value: receipe },
    { label: 'Receitas favoritadas', sub: 'Salvas por utilizadores', value: fav},
  ]

  useEffect(() => {
      async function loadStats() {
        try {
          const res = await fetch(`${API_BASE}/receita/usuario/${user.id}`)
          if (res.ok) {
            const data = await res.json()
            setReceipe(data.length)
          }
        } catch (err) {
          console.error("Erro ao imagem do banco:", err)
        }
      }
      async function loadFav(){
        try{
          const res = await fetch(`${API_BASE}/favorito/findAll`)
          if(res.ok){
            const data = await res.json()
            const Filtered = data.filter(fav => fav.receita.usuario.codUser === user.id)
            setFav(Filtered.length)
          }
        } catch (err){
          console.error("Couldn't load favoritos", err)
        }
      }
      loadFav()
      loadStats()
    }, [])

  return (
    <div className="chef-stats-page">
      <div className="chef-stats-overview">
        <h2>Visão Geral</h2>
        <div className="chef-stats-cards">
          {stats.map(s => (
            <div key={s.label} className="chef-stat-card">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChefStatsPanel
