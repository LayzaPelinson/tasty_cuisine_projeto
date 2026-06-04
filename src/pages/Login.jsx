import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthTabs from '../components/AuthTabs'
import { useUser } from '../hooks/useUser.jsx'
import '../styles/login.css'

const DIET_OPTIONS = ['Vegetariano', 'Vegano', 'Sem Glúten', 'Low Carb', 'Proteína Alta']

function Login() {
  const [activeTab, setActiveTab] = useState('usuario')
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '', specialty: '', location: '', preferences: [] })
  const [error, setError] = useState('')
  const { login, register } = useUser()
  const navigate = useNavigate()

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function togglePreference(pref) {
    setForm(prev => ({
      ...prev,
      preferences: prev.preferences.includes(pref)
        ? prev.preferences.filter(p => p !== pref)
        : [...prev.preferences, pref]
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (mode === 'register') {
      register({ ...form, role: activeTab })
      navigate('/')
    } else {
      const ok = login(form.email, form.password, activeTab)
      if (ok) navigate('/')
      else setError('E-mail ou senha inválidos.')
    }
  }

  const isChef = activeTab === 'chef'

  return (
    <main className="login-page">
      <div className="login-container">
        <AuthTabs activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setError('') }} />
        <div className="login-card">
          <div className="login-icon">{isChef ? '👨‍🍳' : '👤'}</div>
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

            <label>Senha</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />

            {mode === 'register' && isChef && (
              <>
                <label>Especialidade</label>
                <input name="specialty" value={form.specialty} onChange={handleChange} placeholder="ex: Culinária Italiana" required />
                <label>Localização</label>
                <input name="location" value={form.location} onChange={handleChange} placeholder="ex: São Paulo, Brasil" required />
              </>
            )}


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
    </main>
  )
}

export default Login
