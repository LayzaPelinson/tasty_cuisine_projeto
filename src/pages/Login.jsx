import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthTabs from '../components/AuthTabs'
import { useUser } from '../hooks/useUser.jsx'
import '../styles/login.css'

function Login() {
  const [activeTab, setActiveTab] = useState('usuario') // 'usuario' ou 'Chefe'
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', age: '', preferences: [] })
  const [error, setError] = useState('')
  const [inactiveEmail, setInactiveEmail] = useState(null)
  const [blockedMessage, setBlockedMessage] = useState(false) // 💡 Novo estado para o modal de bloqueio
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
    setInactiveEmail(null)
    setBlockedMessage(false)
    
    if (mode === 'register') {
      register({ ...form, funcao: activeTab }).then(res => {
        if (res && res.ok) {
          navigate(activeTab === 'Chefe' ? '/chef-profile' : '/')
        } else {
          setError(res.error || 'Falha no cadastro')
        }
      })
    } else {
      // 💡 A lógica agora avalia primeiro se retornou 'blocked' vindo do seu interceptor/hook de login
      login(form.email, form.password, activeTab).then(result => {
        if (result === true) {
          navigate(activeTab === 'Chefe' ? '/chef-profile' : '/')
        } else if (result === 'blocked') { 
          // 💡 Verificação prioritária: Conta suspensa pelo ADM
          setBlockedMessage(true)
        } else if (result === 'inactive') {
          // Conta desativada voluntariamente pelo próprio usuário
          setInactiveEmail(form.email)
          setReactivatePwd('')
          setReactivateError('')
        } else {
          setError('E-mail ou senha inválidos.')
        }
      })
    }
  }

  async function handleReactivate(e) {
    e.preventDefault()
    setReactivateError('')
    const res = await reactivateAccount(inactiveEmail, reactivatePwd, activeTab)
    if (res.ok) {
      setInactiveEmail(null)
      navigate(activeTab === 'Chefe' ? '/chef-profile' : '/')
    } else {
      setReactivateError('Senha incorreta. Tente novamente.')
    }
  }

  const isChef = activeTab === 'Chefe'

  return (
    <main className="login-page">
      <button className="admin-access-btn" onClick={() => navigate('/admin')}>
        <i className="bi bi-shield-lock-fill"></i> Painel Admin
      </button>
      <div className="login-container">
        <AuthTabs activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setError('') }} />
        <div className="login-card">
          <div className="login-icon">{isChef ? '👨‍🍳' : '👤'}</div>
          <h1>{mode === 'login' ? 'Bem-vindo de volta' : isChef ? 'Seja um Chefe' : 'Criar Conta'}</h1>
          <p>
            {mode === 'login'
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

      {/* 💡 MODAL DE CONTA BLOQUEADA PELO ADMINISTRADOR */}
      {blockedMessage && (
        <div className="reactivate-overlay">
          <div className="reactivate-modal" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>⚠️</div>
            <h3>Acesso Bloqueado</h3>
            <p style={{ margin: '15px 0', color: '#666', lineHeight: '1.5' }}>
              Esta conta foi suspensa temporariamente por um administrador do sistema por violar os termos de uso.
            </p>
            <div className="reactivate-actions" style={{ justifyContent: 'center' }}>
              <button 
                type="button" 
                className="confirm-btn" 
                onClick={() => setBlockedMessage(false)}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

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