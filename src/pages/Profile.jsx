import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { FiHeart, FiSliders } from 'react-icons/fi'

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
      <ProfileHeader setActiveTab={() => setEditing(e => !e)} activeTab={activeTab} setTab={setActiveTab}>
        <div className="profile-tabs">
          <button className={activeTab === 'favorites' ? 'active' : ''} onClick={() => setActiveTab('favorites')}>
            <FiHeart /> Favoritos
          </button>
          <button className={activeTab === 'preferences' ? 'active' : ''} onClick={() => setActiveTab('preferences')}>
            <FiSliders /> Preferências
          </button>
        </div>
        <EditProfilePanel editing={editing} setEditing={setEditing} />
        {activeTab === 'favorites' && <FavoriteRecipes />}
        {activeTab === 'history' && <HistoryPanel />}
        {activeTab === 'preferences' && <PreferencesPanel />}
      </ProfileHeader>
    </div>
  )
}

export default Profile