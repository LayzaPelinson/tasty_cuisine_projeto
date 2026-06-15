import '../styles/chefs.css'

import '../styles/global.css'

import ChefCard from '../components/ChefCard'

import chefKitchen from '../assets/img/food1.jpg'

import foodTable from '../assets/img/food2.jpg'
import { useState, useEffect } from 'react'

const API_BASE = 'http://localhost:8080'


function Chefs({ chefeId }) {
  var [chefs, setChefes] = useState([])

  useEffect(() => {
    fetch(`${API_BASE}/chefe/findAll`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setChefes(Array.isArray(data) ? data : []))
      .catch(() => setChefes([]))
  }, [chefeId])

  return (
    <section className="chefs-page">
      {/* CARDS */}

      <div className="chefs-grid">
        {chefs.length === 0 ? (
          <div className="no-chefs">
            <span>💬</span>
            <p>Nenhum Chefe ainda. Seja o primeiro a avaliar essa receita!</p>
          </div>
        ) : (
          chefs.map(c => (
  <ChefCard key={c.codChefe} chef={c} />
))
        )}
      </div>





      {/* CONTEÚDO */}
      <section className="chef-story">
        {/* TEXTO */}
        <div className="story-text">
          <h1>
            A tradição encontra a inovação
          </h1>
          <p>
            Nossos chefs são profissionais experientes
            que combinam técnicas clássicas da culinária
            francesa e italiana com uma abordagem contemporânea
            focada em saúde e bem-estar.
          </p>
          <p>
            Cada receita é cuidadosamente desenvolvida
            para oferecer o equilíbrio perfeito entre sabor,
            nutrição e praticidade.
          </p>
          <p>
            Da Provence à Toscana, trazemos os melhores
            elementos da gastronomia europeia para a sua cozinha.
          </p>
        </div>
        {/* IMAGENS */}
        <div className="story-images">
          <img
            src={chefKitchen}
            alt="Chef cozinhando"
            className="large-img"
          />
          <img
            src={foodTable}
            alt="Mesa gastronômica"
            className="small-img"
          />
        </div>
      </section>
    </section>
  )
}

export default Chefs