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
        className={activeTab === 'chef' ? 'active' : ''}
        onClick={() => setActiveTab('chef')}
      >
        Chefe
      </button>
    </div>
  )
}

export default AuthTabs