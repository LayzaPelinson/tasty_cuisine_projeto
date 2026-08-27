import { useState, useEffect } from 'react'
import { useUser } from '../hooks/useUser'
import { FiSave } from 'react-icons/fi'
import '../styles/editProfilePanel.css'

// 1. Mascara a digitação para DD/MM/AAAA
const formatBirthDate = (value) => {
  if (!value) return ''
  const v = value.replace(/\D/g, '').slice(0, 8)
  if (v.length <= 2) return v
  if (v.length <= 4) return `${v.slice(0, 2)}/${v.slice(2)}`
  return `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4, 8)}`
}

// 2. Converte YYYY-MM-DD (backend) -> DD/MM/AAAA (exibição)
const convertToDisplayFormat = (dbDate) => {
  if (!dbDate) return ''
  // Se já estiver com barra (DD/MM/AAAA), retorna direto
  if (dbDate.includes('/')) return dbDate 
  const parts = dbDate.split('-') // Assumindo YYYY-MM-DD
  if (parts.length !== 3) return dbDate
  const [year, month, day] = parts
  return `${day}/${month}/${year}`
}

// 3. Converte DD/MM/AAAA (exibição) -> YYYY-MM-DD (backend)
const convertToDatabaseFormat = (displayDate) => {
  if (!displayDate) return null
  const cleanDate = displayDate.replace(/\D/g, '')
  if (cleanDate.length !== 8) return null
  const day = cleanDate.slice(0, 2)
  const month = cleanDate.slice(2, 4)
  const year = cleanDate.slice(4, 8)
  return `${year}-${month}-${day}`
}

function EditProfilePanel({ editing, setEditing }) {
  const { user, updateUserProfile, DIET_OPTIONS } = useUser()
  const [form, setForm] = useState({ name: '', email: '', age: '' })
  const [prefs, setPrefs] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (editing) {
      setForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        // Converte a data do BD para DD/MM/AAAA ao abrir a edição
        age: convertToDisplayFormat(user?.age) 
      })
      setPrefs(user?.preferences ?? [])
      setError('')
    }
  }, [editing, user])

  function togglePref(pref) {
    setPrefs(p => p.includes(pref) ? p.filter(x => x !== pref) : [...p, pref])
  }

  async function handleSave() {
    setError('')
    
    // Converte de volta para YYYY-MM-DD antes de salvar
    const formattedAge = convertToDatabaseFormat(form.age)

    const result = await updateUserProfile({
      name: form.name,
      email: form.email,
      age: formattedAge,
      preferences: prefs,
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
          <input 
            value={form.name} 
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
          />
        </label>

        <label>
          Email
          <input 
            value={form.email} 
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))} 
          />
        </label>
      </div>

      {error && <p className="login-error">{error}</p>}

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