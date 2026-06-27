import { useState, useEffect } from 'react'
import { useUser } from '../hooks/useUser'
import { FiSave } from 'react-icons/fi'
import '../styles/editProfilePanel.css'

function ChefEditProfilePanel({ editing, setEditing }) {
  const { user, updateUserProfile } = useUser()
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    age: user?.age ?? '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (editing) {
      setForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        age: user?.age ?? '',
      })
      setError('')
    }
  }, [editing, user])

  async function handleSave() {
    setError('')
    const result = await updateUserProfile({
      name: form.name,
      email: form.email,
      age: form.age,
    })
    if (!result.ok) {
      setError(result.error || 'Falha ao salvar perfil')
      return
    }
    setEditing(false)
  }

  if (!editing) return null

  return (
    <div className="edit-profile-panel">
      <div className="edit-profile-fields">
        <label>
          Nome
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </label>
        <label>
          Email
          <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        </label>
        <label>
          Idade
          <input type="number" min="14" max="100" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} />
        </label>
      </div>
      {error && <p className="login-error">{error}</p>}
      <button className="edit-save-btn" onClick={handleSave}>
        <FiSave /> Salvar
      </button>
    </div>
  )
}

export default ChefEditProfilePanel
