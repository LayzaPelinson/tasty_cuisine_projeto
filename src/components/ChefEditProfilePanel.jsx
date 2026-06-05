import { useState, useEffect } from 'react'
import { useUser } from '../hooks/useUser'
import { FiSave } from 'react-icons/fi'
import '../styles/editProfilePanel.css'

function ChefEditProfilePanel({ editing, setEditing }) {
  const { user, setUser } = useUser()
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    specialty: user?.specialty ?? '',
    location: user?.location ?? '',
  })

  useEffect(() => {
    if (editing) {
      setForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        specialty: user?.specialty ?? '',
        location: user?.location ?? '',
      })
    }
  }, [editing])

  function handleSave() {
    setUser(u => ({ ...u, ...form }))
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
          Especialidade
          <input value={form.specialty} onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))} />
        </label>
        <label>
          Localização
          <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
        </label>
      </div>
      <button className="edit-save-btn" onClick={handleSave}>
        <FiSave /> Salvar
      </button>
    </div>
  )
}

export default ChefEditProfilePanel
