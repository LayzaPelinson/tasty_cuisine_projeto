import { useRef } from 'react'
import { useUser } from '../hooks/useUser'
import { FiUser, FiCamera, FiEdit2 } from 'react-icons/fi'
import '../styles/profileHeader.css'

function ProfileHeader({ setActiveTab }) {
  const { user, setUser } = useUser()
  const inputRef = useRef()

  function handlePhotoChange(e) {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setUser(u => ({ ...u, photo: url }))
  }

  return (
    <section className="profile-header">
      <div className="profile-user">
        <div className="profile-avatar" onClick={() => inputRef.current.click()}>
          {user.photo
            ? <img src={user.photo} alt="avatar" className="profile-avatar-img" />
            : <FiUser />}
          <span className="avatar-edit-overlay"><FiCamera /></span>
          <input ref={inputRef} type="file" accept="image/*" hidden onChange={handlePhotoChange} />
        </div>
        <div>
          <h1>{user.name}</h1>
          <p>{user.email}</p>
        </div>
      </div>
      <button className="edit-profile-btn" onClick={() => setActiveTab()}>
        <FiEdit2 /> Editar Perfil
      </button>
    </section>
  )
}

export default ProfileHeader
