import '../styles/recipesHero.css'
import heroBg from '../assets/img/TastyCuisine_Banner.jpg'
import { FiSearch } from 'react-icons/fi'

function RecipesHero({ search, onSearch }) {
  return (
    <section
      className="recipes-hero"
      style={{ backgroundImage: `url(${heroBg})` }}
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
            placeholder="Buscar por nome, categoria ou dificuldade..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
    </section>
  )
}

export default RecipesHero
