import '../styles/preferencesPanel.css'

function PreferencesPanel() {
  return (
    <div className="preferences-page">
      <div className="preferences-card">
        <h2>Preferências Alimentares</h2>
        <p>
          Selecione suas preferências para receber
          sugestões personalizadas.
        </p>
        <div className="diet-tags">
          <button className="active">
            Vegetariano
          </button>
          <button>
            Vegano
          </button>
          <button className="active">
            Sem Glúten
          </button>
          <button>
            Low Carb
          </button>
          <button>
            Proteína Alta
          </button>
        </div>
      </div>
      <div className="account-card">
        <h2>Conta</h2>
        <div className="account-actions">
          <button>
            Alterar Senha
          </button>
          <button className="logout">
            Sair da Conta
          </button>
        </div>
      </div>
    </div>
  )
}

export default PreferencesPanel