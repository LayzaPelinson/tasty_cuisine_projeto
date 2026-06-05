import { useState } from 'react'
import { useUser } from '../hooks/useUser'
import { useNavigate } from 'react-router-dom'
import '../styles/chefStatsPanel.css'
import '../styles/preferencesPanel.css'

function ChefSettingsPanel() {
  const { logout, changePassword } = useUser()
  const navigate = useNavigate()
  const [changingPwd, setChangingPwd] = useState(false)
  const [pwdForm, setPwdForm] = useState({ current: '', next: '', confirm: '' })
  const [pwdError, setPwdError] = useState('')

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function handleChangePassword(e) {
    e.preventDefault()
    setPwdError('')
    if (pwdForm.next !== pwdForm.confirm) return setPwdError('As senhas não coincidem.')
    const ok = changePassword(pwdForm.current, pwdForm.next)
    if (!ok) return setPwdError('Senha atual incorreta.')
    setChangingPwd(false)
    setPwdForm({ current: '', next: '', confirm: '' })
  }

  return (
    <div className="chef-settings-card">
      <h2>Configurações</h2>
      {changingPwd ? (
        <form onSubmit={handleChangePassword} className="pwd-form">
          {pwdError && <p className="login-error">{pwdError}</p>}
          <label>Senha atual<input type="password" value={pwdForm.current} onChange={e => setPwdForm(f => ({ ...f, current: e.target.value }))} required /></label>
          <label>Nova senha<input type="password" value={pwdForm.next} onChange={e => setPwdForm(f => ({ ...f, next: e.target.value }))} required /></label>
          <label>Confirmar nova senha<input type="password" value={pwdForm.confirm} onChange={e => setPwdForm(f => ({ ...f, confirm: e.target.value }))} required /></label>
          <div className="account-actions">
            <button type="submit">Salvar</button>
            <button type="button" onClick={() => { setChangingPwd(false); setPwdError('') }}>Cancelar</button>
          </div>
        </form>
      ) : (
        <div className="account-actions">
          <button onClick={() => setChangingPwd(true)}>Alterar Senha</button>
          <button className="logout" onClick={handleLogout}>Sair da Conta</button>
        </div>
      )}
    </div>
  )
}

export default ChefSettingsPanel
