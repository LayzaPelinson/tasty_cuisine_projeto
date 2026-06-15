import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ChefCard from '../components/ChefCard'
import { FiSearch, FiArrowLeft } from 'react-icons/fi'
import '../styles/chefs.css'
import '../styles/allChefs.css'

const API_BASE = 'http://localhost:8080'
const norm = (s = '') => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

function AllChefs() {
  const navigate = useNavigate()
  const [chefs, setChefs] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch(`${API_BASE}/chefe/findAll`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setChefs(Array.isArray(data) ? data : []))
      .catch(() => setChefs([]))
  }, [])

  const filtered = search
    ? chefs.filter(c => norm(c.nomeCompleto).includes(norm(search)))
    : chefs

  return (
    <div className="all-chefs-page">
      <div className="all-chefs-hero-content">
        <h1>Nossos Chefes</h1>
        <p>Conheça os talentos por trás de cada receita extraordinária.</p>
        <div className="all-chefs-search">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar chefe pelo nome..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="all-chefs-content">
        <button className="back-to-chefs-btn" onClick={() => navigate('/chefs')}>
          <FiArrowLeft /> Voltar
        </button>

        {filtered.length === 0 ? (
          <p className="no-chefs-msg">Nenhum chefe encontrado.</p>
        ) : (
          <div className="chefs-grid">
            {filtered.map(c => (
              <ChefCard key={c.codChefe} chef={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AllChefs
