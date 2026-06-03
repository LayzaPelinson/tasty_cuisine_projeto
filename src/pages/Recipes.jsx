import { useSearchParams } from 'react-router-dom'
import RecipesHero from '../components/RecipesHero'
import RecipesSection from '../components/RecipesSection'
import Categories from '../components/Categories'

function Recipes() {
  const [searchParams, setSearchParams] = useSearchParams()
  const active = searchParams.get('categoria') || ''
  const search = searchParams.get('busca') || ''

  function handleSelect(cat) {
    const params = {}
    if (active !== cat) params.categoria = cat
    if (search) params.busca = search
    setSearchParams(params)
  }

  function handleSearch(value) {
    const params = {}
    if (active) params.categoria = active
    if (value) params.busca = value
    setSearchParams(params)
  }

  return (
    <>
      <RecipesHero search={search} onSearch={handleSearch} />
      <Categories onSelect={handleSelect} active={active} />
      <RecipesSection showHeader={false} category={active || null} search={search} />
    </>
  )
}

export default Recipes