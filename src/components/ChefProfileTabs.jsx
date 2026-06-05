import { FiBookOpen, FiBarChart2, FiSettings } from 'react-icons/fi'
import '../styles/profileTabs.css'

function ChefProfileTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { key: 'recipes', label: 'Minhas Receitas', icon: <FiBookOpen /> },
    { key: 'stats', label: 'Estatísticas', icon: <FiBarChart2 /> },
    { key: 'settings', label: 'Configurações', icon: <FiSettings /> },
  ]

  return (
    <div className="profile-tabs">
      {tabs.map(t => (
        <button
          key={t.key}
          className={activeTab === t.key ? 'active' : ''}
          onClick={() => setActiveTab(t.key)}
        >
          {t.icon} {t.label}
        </button>
      ))}
    </div>
  )
}

export default ChefProfileTabs
