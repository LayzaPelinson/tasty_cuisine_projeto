import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser'

import '../styles/global.css'
import '../styles/profile.css'

import ProfileHeader from '../components/ProfileHeader'
import ChefEditProfilePanel from '../components/ChefEditProfilePanel'
import ChefProfileTabs from '../components/ChefProfileTabs'
import ChefMyRecipes from '../components/ChefMyRecipes'
import ChefStatsPanel from '../components/ChefStatsPanel'
import ChefSettingsPanel from '../components/ChefSettingsPanel'

function ChefProfile() {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState('recipes')
  const [editing, setEditing] = useState(false)

  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="profile-page">
      <ProfileHeader setActiveTab={() => setEditing(e => !e)} />
      <ChefEditProfilePanel editing={editing} setEditing={setEditing} />
      <ChefProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'recipes' && <ChefMyRecipes />}
      {activeTab === 'stats' && <ChefStatsPanel />}
      {activeTab === 'settings' && <ChefSettingsPanel />}
    </div>
  )
}

export default ChefProfile
