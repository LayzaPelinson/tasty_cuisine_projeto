import '../styles/recipesHero.css'

import heroBg from '../assets/img/TastyCuisine_Banner.jpg'

import {FiSearch} from 'react-icons/fi'


function RecipesHero() {
  return (
    <section
      className="recipes-hero"
      style={{
        backgroundImage: `url(${heroBg})`
      }}
    >
      <div className="recipes-content">
        <h1>
          Descubra Receitas <br />
          de laticínios
        </h1>
        <p>
          Encontre as receitas perfeitas
          de queijo, leite e iogurte.
        </p>
        <div className="recipes-search">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar receitas..."
          />
        </div>
      </div>
    </section>
  )
}

export default RecipesHero