import RecipesHero from '../components/RecipesHero'
import RecipesSection from '../components/RecipesSection'
import Categories from '../components/Categories'

function Recipes() {
  return (
    <>
      <RecipesHero />
      <Categories />
      <RecipesSection showHeader={false} />
    </>
  )
}

export default Recipes
