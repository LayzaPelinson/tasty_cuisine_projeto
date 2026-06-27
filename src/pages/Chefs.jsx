import '../styles/chefs.css'
import '../styles/global.css'
import ChefCard from '../components/ChefCard'
import chefKitchen from '../assets/img/food1.jpg'
import foodTable from '../assets/img/food2.jpg'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE = 'http://localhost:8080'

function Chefs({ chefeId }) {
  const navigate = useNavigate()
  const [chefs, setChefes] = useState([])

  useEffect(() => {
  // 💡 Alterado para o endpoint correto de usuários
  fetch(`${API_BASE}/usuario/findAll`)
    .then(r => r.ok ? r.json() : [])
    .then(data => {
      if (Array.isArray(data)) {
        // Filtra apenas os usuários que são Chefes válidos, ativos e não bloqueados
        const chefesValidos = data.filter(u => 
          u.funcao?.toLowerCase() === 'chefe' && 
          u.bloqueado === 0 && 
          u.status_Usuario === 'ATIVO'
        )
        setChefes(chefesValidos)
      } else {
        setChefes([])
      }
    })
    .catch(() => setChefes([]))
}, [chefeId])

  const featured = chefs.slice(0, 4)

  return (
    <section className="chefs-page">
      <div className="chefs-section-header">
        <button className="chefs-ver-mais-btn" onClick={() => navigate('/chefs/todos')}>
          Ver todos os chefes
        </button>
      </div>

      <div className="chefs-grid">
        {featured.length === 0 ? (
          <div className="no-chefs">
            <p>Nenhum Chefe cadastrado ainda.</p>
          </div>
        ) : (
          featured.map(c => (
            <ChefCard key={c.codChefe} chef={c} />
          ))
        )}
      </div>

      <section className="chef-story">
        <div className="story-text">
          <h1>A tradição encontra a inovação</h1>
          <p>Nossos chefs são profissionais experientes que combinam técnicas clássicas da culinária francesa e italiana com uma abordagem contemporânea focada em saúde e bem-estar.</p>
          <p>Cada receita é cuidadosamente desenvolvida para oferecer o equilíbrio perfeito entre sabor, nutrição e praticidade.</p>
          <p>Da Provence à Toscana, trazemos os melhores elementos da gastronomia europeia para a sua cozinha.</p>
        </div>
        <div className="story-images">
          <img src={chefKitchen} alt="Chef cozinhando" className="large-img" />
          <img src={foodTable} alt="Mesa gastronômica" className="small-img" />
        </div>
      </section>
    </section>
  )
}

export default Chefs
