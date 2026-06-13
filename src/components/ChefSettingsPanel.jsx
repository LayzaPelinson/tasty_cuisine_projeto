import { useState } from 'react'
import { useUser } from '../hooks/useUser'
import { useNavigate } from 'react-router-dom'
import '../styles/chefStatsPanel.css'
import '../styles/preferencesPanel.css'
import '../styles/login.css'

function ChefSettingsPanel() {
  const { user, logout, changePassword, deactivateAccount } = useUser()
  const navigate = useNavigate()
  const [changingPwd, setChangingPwd] = useState(false)
  const [pwdForm, setPwdForm] = useState({ current: '', next: '', confirm: '' })
  const [pwdError, setPwdError] = useState('')
  const [confirmDeactivate, setConfirmDeactivate] = useState(false)
  const [deactivateError, setDeactivateError] = useState('')

  function handleLogout() {
    logout()
    navigate('/login')
  }

  async function handleChangePassword(e) {
    e.preventDefault()
    setPwdError('')
    if (pwdForm.next !== pwdForm.confirm) return setPwdError('As senhas não coincidem.')
    const res = await changePassword(pwdForm.current, pwdForm.next)
    if (!res.ok) return setPwdError('Falha ao alterar senha. Tente novamente.')
    setChangingPwd(false)
    setPwdForm({ current: '', next: '', confirm: '' })
  }

  async function handleDeactivate() {
    setDeactivateError('')
    const res = await deactivateAccount()
    if (res.ok) { logout(); navigate('/login') }
    else setDeactivateError('Falha ao inativar conta. Tente novamente.')
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
      ) : confirmDeactivate ? (
        <div className="deactivate-confirm">
          <p>Tem certeza que deseja inativar sua conta? Você poderá reativá-la no login.</p>
          {deactivateError && <p className="login-error">{deactivateError}</p>}
          <div className="account-actions">
            <button className="deactivate" onClick={handleDeactivate}>Confirmar Inativação</button>
            <button onClick={() => { setConfirmDeactivate(false); setDeactivateError('') }}>Cancelar</button>
          </div>
        </div>
      ) : (
        <div className="account-actions">
          <button onClick={() => setChangingPwd(true)}>Alterar Senha</button>
          <button className="deactivate" onClick={() => setConfirmDeactivate(true)}>Inativar Conta</button>
          <button className="logout" onClick={handleLogout}>Sair da Conta</button>
        </div>
      )}
    </div>
  )
}

export default ChefSettingsPanel
