import { useUser } from '../hooks/useUser'
import '../styles/chefStatsPanel.css'

function ChefSettingsPanel() {
  const { logout } = useUser()

  return (
    <div className="chef-settings-card">
      <h2>Configurações</h2>
      <div className="account-actions">
        <button>Alterar Senha</button>
        <button className="logout" onClick={logout}>Sair da Conta</button>
      </div>
    </div>
  )
}

export default ChefSettingsPanel
