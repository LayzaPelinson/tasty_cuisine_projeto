import { useRef, useState } from 'react'
import { useUser } from '../hooks/useUser'
import { FiUser, FiCamera, FiEdit2 } from 'react-icons/fi'
import '../styles/profileHeader.css' // 

function ProfileHeader({ setActiveTab, isChefe }) {
  const { user, setUser } = useUser()
  const [aberto, setAberto] = useState(false)
  const [linkFoto, setLinkFoto] = useState('')
  const endpoint = isChefe ? `/chefe/${user.id}` : `/usuario/${user.id}`

async function handleConfirmarFoto() {
  console.log(user)
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

      <div className="profile-user">
        <div className="profile-avatar" onClick={isChefe ? () => setAberto(true) : undefined}>
          {user.photo
            ? <img src={user.photo} alt="avatar" className="profile-avatar-img" />
            : <FiUser />}
          {isChefe ? <span className="avatar-edit-overlay"><FiCamera /></span> : null}
          <div className="modal">

          </div>
        </div>
        <div>
          <h1>{user.name ?? user.fullName ?? user.nomeCompleto ?? user.nomeUsuario}</h1>
          <p>{user.email ?? user.gmail}</p>
        </div>
      </div>
      <button className="edit-profile-btn" onClick={() => setActiveTab()}>
        <FiEdit2 /> Editar Perfil
      </button>

    </section>
          {aberto && (
        <div className='edit-profile-photo'>
          <h3 className='edit-profile-h3'>Troque sua foto</h3>
          <input
          type='url'
          className='edit-profile-input'
            placeholder="https://exemplo.com/foto.jpg"
            value={linkFoto}
            onChange={e => setLinkFoto(e.target.value)}
          />
          <div className='button'>
          <button className='edit-profile-confirm' onClick={() => handleConfirmarFoto()} >Confirmar</button>
          <button className='edit-profile-cancel' onClick={() => setAberto(false)}>Cancelar</button>
            </div>
        </div>
      )}

    </>
  )

}
export default ProfileHeader
