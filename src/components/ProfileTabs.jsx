import { FiHeart, FiClock, FiSliders } from 'react-icons/fi'
import '../styles/profileTabs.css'

function ProfileTabs({ activeTab, setActiveTab }) {
  return (
    <div className="profile-tabs">
      <button
        className={activeTab === 'favorites' ? 'active' : ''}
        onClick={() => setActiveTab('favorites')}
      >
        <FiHeart /> Favoritos
      </button>
      <button
        className={activeTab === 'history' ? 'active' : ''}
        onClick={() => setActiveTab('history')}
      >
        <FiClock /> Histórico
      </button>
      <button
        className={activeTab === 'preferences' ? 'active' : ''}
        onClick={() => setActiveTab('preferences')}
      >
        <FiSliders /> Preferências
      </button>
    </div>
  )
}

export default ProfileTabs
