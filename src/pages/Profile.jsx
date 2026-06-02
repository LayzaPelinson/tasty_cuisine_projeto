import { useState } from 'react'

import '../styles/global.css'
import '../styles/profile.css'

import ProfileHeader from '../components/ProfileHeader'
import ProfileTabs from '../components/ProfileTabs'
import FavoriteRecipes from '../components/FavoriteRecipes'
import PreferencesPanel from '../components/PreferencesPanel'

function Profile() {
  const [activeTab, setActiveTab] = useState('favorites')
  return (
    <main className="profile-page">
      <ProfileHeader />
      <ProfileTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {activeTab === 'favorites' && (
        <FavoriteRecipes />
      )}
      {activeTab === 'preferences' && (
        <PreferencesPanel />
      )}
    </main>
  )
}

export default Profile