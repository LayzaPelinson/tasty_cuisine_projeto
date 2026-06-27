import { useNavigate } from 'react-router-dom'
import { FiMapPin, FiBook } from 'react-icons/fi'
import { use, useState } from 'react'
import imagemPadrao from "../assets/img/chef.png"

function ChefCard({ chef }) {
  const navigate = useNavigate()
  console.log(chef)
  return (
    // 💡 Alterado para chef.codUser na rota de navegação
    <div className="chef-card" onClick={() => navigate(`/chef/${chef.codUser}`)} style={{ cursor: 'pointer' }}>
      
      {/* 💡 Corrigido para chef.foto_perfil e chef.nome_completo */}
      <img src={chef.foto_perfil ?? imagemPadrao} alt={chef.nome_completo} />
      
      <div className="chef-overlay">
        <h3>{chef.nome_completo}</h3>
      </div>
      
      <div className="chef-footer">
        {chef.recipes > 0 ? (
          <span><FiBook /> {chef.recipes} receitas</span>
        ) : (
          <span>Sem receitas publicadas</span>
        )}
      </div>
    </div>
  )
}

export default ChefCard
