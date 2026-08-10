import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser.jsx'
import '../styles/login.css'

function Login() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', age: '', preferences: [] })
  const [error, setError] = useState('')
  const [inactiveEmail, setInactiveEmail] = useState(null)
  const [blockedMessage, setBlockedMessage] = useState(false)
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
      register({ ...form, funcao: 'Chefe' }).then(res => { 
        if (res && res.ok) { 
          navigate('/chef-profile') 
        } else { 
          setError(res.error || 'Falha no cadastro') 
        } 
      }) 
    } else {
      login(form.email, form.password).then(result => {
        if (result === true) {
          navigate('/chef-profile')
        } else if (result === 'blocked') {
          setBlockedMessage(true)
        } else if (result === 'inactive') {
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
    const res = await reactivateAccount(inactiveEmail, reactivatePwd)
    if (res.ok) {
      setInactiveEmail(null)
      navigate('/chef-profile')
    } else {
      setReactivateError('Senha incorreta. Tente novamente.')
    }
  }

  const formatBirthDate = (value) => {
    const v = value.replace(/\D/g, '');
    if (v.length <= 2) return v;
    if (v.length <= 4) return `${v.slice(0, 2)}/${v.slice(2)}`;
    return `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4, 8)}`;
  };

  return (
    <main className="login-page">
      <button className="admin-access-btn" onClick={() => navigate('/admin')}>
        <i className="bi bi-shield-lock-fill"></i> Painel Admin
      </button>
      <div className="login-container">
        <div className="login-card">
          <div className="login-icon">👨‍🍳</div>
          <h1>{mode === 'login' ? 'Bem-vindo de volta' : 'Seja um Chefe'}</h1>
          <p>
            {mode === 'login'
              ? 'Acesse sua conta de chefe'
              : 'Compartilhe suas receitas com o mundo'}
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
                <label htmlFor="age">Data de Nascimento</label>
                <input
                  id="age"
                  name="age"
                  type="text"
                  placeholder="DD/MM/AAAA"
                  maxLength={10}
                  value={form.age || ''}
                  onChange={(e) => {
                    const txtFormatado = formatBirthDate(e.target.value);
                    setForm(prev => ({
                      ...prev,
                      age: txtFormatado
                    }));
                  }}
                  required
                />
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