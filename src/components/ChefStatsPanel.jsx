import { useUser } from '../hooks/useUser'
import '../styles/chefStatsPanel.css'
import { useState, useEffect } from 'react'

function ChefStatsPanel() {
  const { 
    user, 
    chefRecipes, 
    loadChefRecipes, 
    getRecipeFavoritesCount, 
    getRecipeRatingStats 
  } = useUser()

  const [receipe, setReceipe] = useState('')
  const [fav, setFav] = useState('')
  const [detailedRecipes, setDetailedRecipes] = useState([])
  const [loadingTable, setLoadingTable] = useState(true)
  const [modalImage, setModalImage] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const API_BASE = 'http://localhost:8080'

  // Bloco original da Visão Geral
  const stats = [
    { label: 'Receitas publicadas', sub: 'Total de receitas no ar', value: receipe },
    { label: 'Favoritos recebidos', sub: 'Vezes que suas receitas foram salvas por usuários', value: fav },
  ]

  // Carrega as estatísticas do bloco superior
  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch(`${API_BASE}/receita/usuario/${user.id}`)
        if (res.ok) {
          const data = await res.json()
          setReceipe(data.length)
        }
      } catch (err) {
        console.error("Erro ao carregar quantidade de receitas:", err)
      }
    }

    async function loadFav() {
      try {
        const res = await fetch(`${API_BASE}/favorito/findAll`)
        if (res.ok) {
          const data = await res.json()
          const Filtered = data.filter(favItem => favItem.receita?.usuario?.codUser === user.id)
          setFav(Filtered.length)
        }
      } catch (err) {
        console.error("Erro ao carregar favoritos:", err)
      }
    }

    if (user?.id) {
      loadFav()
      loadStats()
      loadChefRecipes(user.id)
    }
  }, [user?.id])

  // Enriquece as receitas para a tabela
  useEffect(() => {
    async function enrichRecipes() {
      if (!chefRecipes || chefRecipes.length === 0) {
        setDetailedRecipes([])
        setLoadingTable(false)
        return
      }

      setLoadingTable(true)
      const enriched = await Promise.all(
        chefRecipes.map(async (recipe) => {
          const ratingData = await getRecipeRatingStats(recipe.id)
          const favCount = await getRecipeFavoritesCount(recipe.id)
          
          return {
            ...recipe,
            totalAvaliacoes: ratingData.total,
            mediaNota: ratingData.media,
            totalFavoritos: favCount
          }
        })
      )

      setDetailedRecipes(enriched)
      setLoadingTable(false)
    }

    enrichRecipes()
  }, [chefRecipes])

  const handleOpenImageModal = (imageUrl) => {
    setModalImage(imageUrl)
    setIsModalOpen(true)
  }

  const handleCloseImageModal = () => {
    setIsModalOpen(false)
    setModalImage(null)
  }

  return (
    <div className="chef-stats-page">
      {/* ── CARD 1: VISÃO GERAL (ORIGINAL RESTAURADO) ───────────────── */}
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

      {/* ── CARD 2: TABELA DE DESEMPENHO ────────────────────────────── */}
      <div className="chef-stats-overview">
        <h2>Desempenho das Receitas</h2>
        
        {loadingTable ? (
          <p style={{ color: '#888', padding: '10px 0' }}>Carregando estatísticas...</p>
        ) : detailedRecipes.length === 0 ? (
          <p style={{ color: '#888', padding: '10px 0' }}>Nenhuma receita publicada ainda.</p>
        ) : (
          <div className="chef-table-wrapper">
            <table className="chef-recipes-table">
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Nome</th>
                  <th style={{ textAlign: 'center' }}>Avaliações</th>
                  <th style={{ textAlign: 'center' }}>Média</th>
                  <th style={{ textAlign: 'center' }}>Favoritada</th>
                </tr>
              </thead>
              <tbody>
                {detailedRecipes.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <img 
                        src={item.image || 'https://via.placeholder.com/60'} 
                        alt={item.title} 
                        className="table-recipe-img clickable-img" 
                        onClick={() => handleOpenImageModal(item.image)}
                        title="Clique para ampliar"
                      />
                    </td>
                    <td className="table-recipe-name">{item.title}</td>
                    <td style={{ textAlign: 'center' }}>{item.totalAvaliacoes}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="rating-badge">★ {item.mediaNota}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>{item.totalFavoritos}x</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── MODAL DE IMAGEM ────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="img-modal-overlay" onClick={handleCloseImageModal}>
          <div className="img-modal-content" onClick={e => e.stopPropagation()}>
            <button className="img-modal-close" onClick={handleCloseImageModal}>✕</button>
            <img src={modalImage} alt="Visualização da Receita" className="img-modal-preview" />
          </div>
        </div>
      )}
    </div>
  )
}

export default ChefStatsPanel