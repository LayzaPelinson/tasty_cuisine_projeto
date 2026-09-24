import { useState } from 'react'
import { Navigate } from 'react-router-dom'

import '../styles/global.css'
import '../styles/profile.css'

import ProfileHeader from '../components/ProfileHeader'
import EditProfilePanel from '../components/EditProfilePanel'
import FavoriteRecipes from '../components/FavoriteRecipes'
import HistoryPanel from '../components/HistoryPanel'
import PreferencesPanel from '../components/PreferencesPanel'
import { useUser } from '../hooks/useUser'

function Profile() {
  const { user, loading } = useUser()
  const [activeTab, setActiveTab] = useState('favorites')
  const [editing, setEditing] = useState(false)

  if (!user && !loading) return <Navigate to="/login" replace />

  return (
    <div className="profile-page">
      <ProfileHeader setActiveTab={() => setEditing(e => !e)} activeTab={activeTab} setTab={setActiveTab} />
      <EditProfilePanel editing={editing} setEditing={setEditing} />
      {activeTab === 'favorites' && <FavoriteRecipes />}
      {activeTab === 'history' && <HistoryPanel />}
      {activeTab === 'preferences' && <PreferencesPanel />}
    </div>
  )
}

export default Profile