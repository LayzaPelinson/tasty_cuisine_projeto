import { useState, useEffect } from 'react'
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
  const [blockedMessage, setBlockedMessage] = useState(false)
  const [reactivatePwd, setReactivatePwd] = useState('')
  const [reactivateError, setReactivateError] = useState('')
  const { login, register, reactivateAccount } = useUser()
  const navigate = useNavigate()

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Máscara para formatar a data de nascimento como DD/MM/AAAA
  const formatBirthDate = (value) => {
    const v = value.replace(/\D/g, '').slice(0, 8) 
    if (v.length <= 2) return v
    if (v.length <= 4) return `${v.slice(0, 2)}/${v.slice(2)}`
    return `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4, 8)}`
  }

  const convertToDatabaseFormat = (displayDate) => {
  if (!displayDate) return null

  // Remove qualquer caractere que não seja número
  const cleanDate = displayDate.replace(/\D/g, '')

  // Garante que temos exatamente 8 dígitos (DDMMYYYY)
  if (cleanDate.length !== 8) return null

  const day = cleanDate.slice(0, 2)
  const month = cleanDate.slice(2, 4)
  const year = cleanDate.slice(4, 8)

  return `${year}-${month}-${day}` // Retorna no formato YYYY-MM-DD
}

  // Validador inteligente focado em e-mail, senha e na regra estrita de idade (> 14 anos)
  function validateForm() {
    if (mode === 'register') {
      // Validação de formato básico de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(form.email)) {
        return '❌ **E-mail inválido:** Verifique se digitou corretamente (exemplo: seu-email@dominio.com).'
      }

      // Validação do formato da data de nascimento (DD/MM/AAAA)
      if (form.age.length !== 10) {
        return '❌ **Data incompleta:** O campo de Data de Nascimento deve estar no formato completo DD/MM/AAAA.'
      }

      const [dia, mes, ano] = form.age.split('/').map(Number)
      const dataNasc = new Date(ano, mes - 1, dia)
      const hoje = new Date()

      // Verifica se a data é real e válida
      if (
        dataNasc.getDate() !== dia ||
        dataNasc.getMonth() !== mes - 1 ||
        dataNasc.getFullYear() !== ano ||
        ano < 1900 ||
        dataNasc > hoje
      ) {
        return '❌ **Data inválida:** A data informada não existe ou está no futuro. Por favor, insira uma data real.'
      }

      // 💡 Cálculo rigoroso da idade (maior que 14 anos)
      let idade = hoje.getFullYear() - dataNasc.getFullYear()
      const m = hoje.getMonth() - dataNasc.getMonth()
      if (m < 0 || (m === 0 && hoje.getDate() < dataNasc.getDate())) {
        idade--
      }

      if (idade <= 14) {
        return '❌ **Idade não permitida:** Você precisa ter mais de 14 anos para se cadastrar nesta plataforma.'
      }

      if (form.password.length < 6) {
        return '❌ **Senha curta:** A senha de segurança precisa ter pelo menos 6 caracteres.'
      }
    }
    return null
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setInactiveEmail(null)
    setBlockedMessage(false)

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }
    form.age = convertToDatabaseFormat(form.age)
    if (mode === 'register') {
      register({ ...form, funcao: activeTab }).then(res => {
        if (res && res.ok) {
          navigate(activeTab === 'Chefe' ? '/chef-profile' : '/')
        } else {
          let customMsg = res.error || 'Falha no cadastro.'
          if (customMsg.toLowerCase().includes('email') || customMsg.toLowerCase().includes('já cadastrado')) {
            customMsg = '⚠️ **E-mail já em uso:** Este endereço de e-mail já possui uma conta cadastrada. Tente fazer login ou recuperar sua senha.'
          }
          setError(customMsg)
        }
      })

      
    } else {
      login(form.email, form.password, activeTab).then(result => {
        if (result === true) {
          navigate(activeTab === 'Chefe' ? '/chef-profile' : '/')
        } else if (result === 'blocked') {
          setBlockedMessage(true)
        } else if (result === 'inactive') {
          setInactiveEmail(form.email)
          setReactivatePwd('')
          setReactivateError('')
        } else if(result === 'Incorrect') {
          setError('O e-mail ou a senha informados não conferem. Verifique se há erros de digitação.')
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
      setReactivateError('❌ **Senha incorreta:** A senha informada para reativação não confere com esta conta.')
    }
  }

  const isChef = activeTab === 'Chefe'

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.ctrlKey && e.shiftKey && e.key === 'H') {
        navigate('/admin')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  return (
    <main className="login-page">
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

          {error && (
            <div style={{ backgroundColor: '#fff3f3', border: '1px solid #ffcdd2', padding: '10px 12px', borderRadius: '6px', marginBottom: '15px', color: '#c62828', fontSize: '13px', lineHeight: '1.4' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <>
                <label>Nome</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Seu nome" required />
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
                    const txtFormatado = formatBirthDate(e.target.value)
                    setForm(prev => ({
                      ...prev,
                      age: txtFormatado
                    }))
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
            {reactivateError && <div style={{ color: '#c62828', fontSize: '13px', marginBottom: '10px' }}>{reactivateError}</div>}
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