import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthTabs from '../components/AuthTabs'
import { useUser } from '../hooks/useUser.jsx'
import '../styles/login.css'

function Login() {
  const [activeTab, setActiveTab] = useState('usuario')
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', age: '', preferences: [] })
  const [error, setError] = useState('')
  const [inactiveEmail, setInactiveEmail] = useState(null)
  const [reactivatePwd, setReactivatePwd] = useState('')
  const [reactivateError, setReactivateError] = useState('')
  const { login, register, reactivateAccount } = useUser()
  const navigate = useNavigate()

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (mode === 'register') {
      register({ ...form, role: activeTab }).then(res => {
        if (res && res.ok) navigate(activeTab === 'chef' ? '/chef-profile' : '/')
        else setError(res.error || 'Falha no cadastro')
      })
    } else {
      login(form.email, form.password, activeTab).then(result => {
        if (result === true) navigate(activeTab === 'chef' ? '/chef-profile' : '/')
        else if (result === 'inactive') { setInactiveEmail(form.email); setReactivatePwd(''); setReactivateError('') }
        else setError('E-mail ou senha inválidos.')
      })
    }
  }

  async function handleReactivate(e) {
    e.preventDefault()
    setReactivateError('')
    const res = await reactivateAccount(inactiveEmail, reactivatePwd, activeTab)
    if (res.ok) { setInactiveEmail(null); navigate(activeTab === 'chef' ? '/chef-profile' : '/') }
    else setReactivateError('Senha incorreta. Tente novamente.')
  }

  const isChef = activeTab === 'chef'

  return (
    <main className="login-page">
      <div className="login-container">
        <AuthTabs activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setError('') }} />
        <div className="login-card">
          <div className="login-icon">{isChef ? '👨🍳' : '👤'}</div>
          <h1>{mode === 'login' ? 'Bem-vindo de volta' : isChef ? 'Seja um Chefe' : 'Criar Conta'}</h1>
          <p>{mode === 'login'
            ? `Acesse sua conta de ${isChef ? 'chefe' : 'usuário'}`
            : isChef ? 'Compartilhe suas receitas com o mundo' : 'Salve e descubra novas receitas'}
          </p>

          {error && <p className="login-error">{error}</p>}

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <>
                <label>Nome</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Seu nome completo" required />
              </>
            )}
            <label>E-mail</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="seu@email.com" required />
            {mode === 'register' && (
              <>
                <label>Idade</label>
                <input name="age" type="number" min="14" max="100" value={form.age} onChange={handleChange} placeholder="Sua idade" required />
              </>
            )}
            <label>Senha</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
            <button type="submit" className="login-btn">
              {mode === 'login' ? 'Entrar' : 'Cadastrar'}
            </button>
          </form>

          <div className="register-link">
            {mode === 'login' ? 'Não tem conta?' : 'Já tem conta?'}
            <span onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>
              {mode === 'login' ? ' Cadastre-se' : ' Fazer login'}
            </span>
          </div>
        </div>
      </div>

      {inactiveEmail && (
        <div className="reactivate-overlay">
          <div className="reactivate-modal">
            <h3>Conta Inativa</h3>
            <p>Sua conta está desativada. Confirme sua senha para reativá-la.</p>
            {reactivateError && <p className="login-error">{reactivateError}</p>}
            <form onSubmit={handleReactivate}>
              <input
                type="password"
                placeholder="Sua senha"
                value={reactivatePwd}
                onChange={e => setReactivatePwd(e.target.value)}
                required
                autoFocus
              />
              <div className="reactivate-actions">
                <button type="submit" className="login-btn">Reativar Conta</button>
                <button type="button" onClick={() => setInactiveEmail(null)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

export default Login
