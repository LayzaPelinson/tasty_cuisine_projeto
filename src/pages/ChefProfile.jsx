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
  const { user,loading } = useUser()
  const [activeTab, setActiveTab] = useState('recipes')
  const [editing, setEditing] = useState(false)

  if (!user && !loading) return <Navigate to="/login" replace />

  return (
    <div className="profile-page">
  <ProfileHeader
    setActiveTab={() => setEditing(e => !e)}
    isChefe={true}
  >
    <ChefProfileTabs
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    />
    <ChefEditProfilePanel
      editing={editing}
      setEditing={setEditing}
    />
    {activeTab === 'recipes' && <ChefMyRecipes />}
    {activeTab === 'stats' && <ChefStatsPanel />}
    {activeTab === 'settings' && <ChefSettingsPanel />}
  </ProfileHeader>
</div>
  )
}

export default ChefProfile
