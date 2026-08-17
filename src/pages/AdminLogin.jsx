import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser.jsx'
import '../styles/login.css'

function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const { login } = useUser()
  const navigate = useNavigate()

  // 💡 Busca as informações iniciais no endpoint ao carregar a página
  useEffect(() => {
    fetch('http://localhost:8080/usuario/ADMIN')
      .then(response => {
        if (!response.ok) {
          throw new Error('Não foi possível carregar os dados do administrador.')
        }
        return response.json()
      })
      .then(data => {
        // Se o endpoint retornar o email do admin cadastrado automaticamente,
        // podemos pré-preencher o campo de e-mail para facilitar!
        if (data && data.email) {
          setForm(prev => ({ ...prev, email: data.email }))
        }
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError('Erro ao conectar com o servidor para buscar dados do Admin.')
        setLoading(false)
      })
  }, [])

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // Realiza o login informando o e-mail, senha e especificando o tipo/perfil 'ADMIN'
    const result = await login(form.email, form.password, 'ADMIN')

    if (result === true) {
      navigate('/admin') // Redireciona para o painel administrativo
    } else if (result === 'blocked') {
      setError('Esta conta de administrador está bloqueada.')
    } else {
      setError('E-mail ou senha do administrador inválidos.')
    }
  }

  return (
    <main className="login-page">
      <div className="login-container">
        <div className="login-card" style={{ maxWidth: '400px', width: '100%' }}>
          <div className="login-icon">🛡️</div>
          <h1>Acesso Administrativo</h1>
          <p>Entre com as credenciais geradas pelo sistema</p>

          {error && <p className="login-error">{error}</p>}

          {loading ? (
            <p style={{ textAlign: 'center', margin: '20px 0', color: '#666' }}>
              Carregando dados do administrador...
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <label>E-mail do Administrador</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@tastycuisine.com"
                required
              />

              <label>Senha Temporária (6 dígitos)</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••"
                maxLength={6}
                required
              />

              <button type="submit" className="login-btn">
                Entrar no Painel
              </button>
            </form>
          )}

          <div className="register-link" style={{ marginTop: '20px' }}>
            <span onClick={() => navigate('/login')} style={{ cursor: 'pointer', color: '#e67e22' }}>
              ← Voltar para o login principal
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}

export default AdminLogin