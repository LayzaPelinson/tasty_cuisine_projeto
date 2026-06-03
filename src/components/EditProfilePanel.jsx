import { useState, useEffect } from 'react'
import { useUser } from '../hooks/useUser'
import { FiSave } from 'react-icons/fi'
import '../styles/editProfilePanel.css'

function EditProfilePanel({ editing, setEditing }) {
  const { user, setUser, DIET_OPTIONS } = useUser()
  const [form, setForm] = useState({ name: user.name, email: user.email })
  const [prefs, setPrefs] = useState(user.preferences)

  useEffect(() => {
    if (editing) {
      setForm({ name: user.name, email: user.email })
      setPrefs(user.preferences)
    }
  }, [editing])

  function togglePref(pref) {
    setPrefs(p => p.includes(pref) ? p.filter(x => x !== pref) : [...p, pref])
  }

  function handleSave() {
    setUser(u => ({ ...u, name: form.name, email: form.email, preferences: prefs }))
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
      </div>
      <div className="edit-profile-prefs">
        <span className="edit-prefs-label">Preferências</span>
        <div className="edit-diet-tags">
          {DIET_OPTIONS.map(opt => (
            <button
              key={opt}
              className={prefs.includes(opt) ? 'active' : ''}
              onClick={() => togglePref(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
      <button className="edit-save-btn" onClick={handleSave}>
        <FiSave /> Salvar
      </button>
    </div>
  )
}

export default EditProfilePanel
