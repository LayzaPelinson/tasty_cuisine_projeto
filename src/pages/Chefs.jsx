import '../styles/chefs.css'

import '../styles/global.css'

import { chefs } from '../data/chefs'

import ChefCard from '../components/ChefCard'

import chefKitchen from '../assets/img/food1.jpg'

import foodTable from '../assets/img/food2.jpg'

function Chefs() {
  return (
    <section className="chefs-page">
      {/* TOPO */}
      <div className="chefs-grid">
        {chefs.map((chef) => (
          <ChefCard
            key={chef.id}
            chef={chef}
          />
        ))}
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