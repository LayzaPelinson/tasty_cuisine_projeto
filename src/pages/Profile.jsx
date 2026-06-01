import '../styles/global.css'

import '../styles/profile.css'

import ProfileHeader from '../components/ProfileHeader'
import ProfileTabs from '../components/ProfileTabs'
import FavoriteRecipes from '../components/FavoriteRecipes'

function Profile() {
  return (
    <main className="profile-page">
      <ProfileHeader />
      <ProfileTabs />
      <FavoriteRecipes />

    </main>
  )
}

export default Profile