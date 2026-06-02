import { useSearchParams, useNavigate } from 'react-router-dom'
import RecipesHero from '../components/RecipesHero'
import RecipesSection from '../components/RecipesSection'
import Categories from '../components/Categories'

function Recipes() {
  const [searchParams, setSearchParams] = useSearchParams()
  const active = searchParams.get('categoria') || ''

  function handleSelect(cat) {
    setSearchParams(active === cat ? {} : { categoria: cat })
  }

  return (
    <>
      <RecipesHero />
      <Categories onSelect={handleSelect} active={active} />
      <RecipesSection showHeader={false} category={active || null} />
    </>
  )
}

export default Recipes
