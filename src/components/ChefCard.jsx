import { useNavigate } from 'react-router-dom'
import { FiMapPin, FiBook } from 'react-icons/fi'
import { use, useState } from 'react'
import imagemPadrao from '../assets/hero.png'
function ChefCard({ chef }) {
  const navigate = useNavigate()

  return (
    <div className="chef-card" onClick={() => navigate(`/chef/${chef.codChefe}`)} style={{ cursor: 'pointer' }}>
      <img src={chef.fotoPerfil ?? imagemPadrao} alt={chef.nomeCompleto} />
      <div className="chef-overlay">
        <h3>{chef.nomeCompleto}</h3>
      </div>
      <div className="chef-footer">
        {chef.recipes > 0 ? <span><FiBook /> {chef.recipes} receitas</span> : <span>Sem receitas publicadas</span>}
      </div>
    </div>
  )
}

export default ChefCard
