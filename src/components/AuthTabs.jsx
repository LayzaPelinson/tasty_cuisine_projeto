function AuthTabs({ activeTab, setActiveTab }) {
  return (
    <div className="auth-tabs">
      <button
        className={activeTab === 'usuario' ? 'active' : ''}
        onClick={() => setActiveTab('usuario')}
      >
        Usuário
      </button>

      <button
        className={activeTab === 'Chefe' ? 'active' : ''}
        onClick={() => setActiveTab('Chefe')}
      >
        Chefe
      </button>
    </div>
  )
}

export default AuthTabs