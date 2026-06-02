import '../styles/profileTabs.css'

function ProfileTabs({
  activeTab,
  setActiveTab
}) {
  return (
    <div className="profile-tabs">

      <button
        className={
          activeTab === 'favorites'
            ? 'active'
            : ''
        }
        onClick={() =>
          setActiveTab('favorites')
        }
      >
        💗 Favoritos
      </button>
      <button
        className={
          activeTab === 'history'
            ? 'active'
            : ''
        }
        onClick={() =>
          setActiveTab('history')
        }
      >
        🕘 Histórico
      </button>
      <button
        className={
          activeTab === 'preferences'
            ? 'active'
            : ''
        }
        onClick={() =>
          setActiveTab('preferences')
        }
      >
        ⚙️ Preferências
      </button>
    </div>
  )
}

export default ProfileTabs