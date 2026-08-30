import { useState } from 'react'
import { useUser } from '../hooks/useUser'
import { FiUser, FiCamera, FiEdit2 } from 'react-icons/fi'
import '../styles/profileHeader.css'

function ProfileHeader({ setActiveTab, isChefe }) {
  const { user, setUser } = useUser()
  const [aberto, setAberto] = useState(false)
  const [linkFoto, setLinkFoto] = useState('')

  if (!user) return null

  async function handleConfirmarFoto() {
    await fetch(`http://localhost:8080/chefe/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...user, fotoPerfil: linkFoto })
    })
    setUser(u => ({ ...u, photo: linkFoto, fotoPerfil: linkFoto }))
    setAberto(false)
  }

  return (
    <>
      <section className="profile-header">
        {/* Elemento decorativo extra para espelhar o blob 3 do mobile */}
        <span className="hero-blob-3" />

        <div className="profile-user">
          <div 
            className={`profile-avatar ${isChefe ? 'clickable' : ''}`} 
            onClick={isChefe ? () => setAberto(true) : undefined}
          >
            {user.photo || user.fotoPerfil ? (
              <img src={user.photo || user.fotoPerfil} alt="avatar" className="profile-avatar-img" />
            ) : (
              <FiUser className="avatar-placeholder-icon" />
            )}
            {isChefe && (
              <span className="avatar-edit-overlay">
                <FiCamera />
              </span>
            )}
          </div>
          <div className="profile-info-text">
            <h1>{user.name ?? user.fullName ?? user.nomeCompleto}</h1>
            <p>{user.email ?? user.gmail}</p>
          </div>
        </div>

        <button className="edit-profile-btn" onClick={() => setActiveTab && setActiveTab()}>
          <FiEdit2 /> Editar Perfil
        </button>
      </section>

      {aberto && (
        <div className="edit-profile-modal-overlay">
          <div className="edit-profile-photo">
            <h3 className="edit-profile-h3">Troque sua foto</h3>
            <input
              type="url"
              className="edit-profile-input"
              placeholder="https://exemplo.com/foto.jpg"
              value={linkFoto}
              onChange={e => setLinkFoto(e.target.value)}
            />
            <div className="button-group">
              <button className="edit-profile-confirm" onClick={handleConfirmarFoto}>
                Confirmar
              </button>
              <button className="edit-profile-cancel" onClick={() => setAberto(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProfileHeader