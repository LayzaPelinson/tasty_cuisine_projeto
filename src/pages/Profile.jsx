import { useState } from 'react'

import '../styles/global.css'
import '../styles/profile.css'

import ProfileHeader from '../components/ProfileHeader'
import ProfileTabs from '../components/ProfileTabs'
import EditProfilePanel from '../components/EditProfilePanel'
import FavoriteRecipes from '../components/FavoriteRecipes'
import PreferencesPanel from '../components/PreferencesPanel'
import HistoryPanel from '../components/HistoryPanel'

function Profile() {
  const [activeTab, setActiveTab] = useState('favorites')
  const [editing, setEditing] = useState(false)

  return (
    <main className="profile-page">
      <ProfileHeader setActiveTab={() => setEditing(e => !e)} />
      <EditProfilePanel editing={editing} setEditing={setEditing} />
      <ProfileTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {activeTab === 'favorites' && <FavoriteRecipes />}
      {activeTab === 'history' && <HistoryPanel />}
      {activeTab === 'preferences' && <PreferencesPanel />}
    </main>
  )
}

export default Profile