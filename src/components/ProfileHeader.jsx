import '../styles/profileHeader.css'

function ProfileHeader() {
  return (
    <section className="profile-header">
      <div className="profile-user">
        <div className="profile-avatar">
          👤
        </div>
        <div>
          <h1>Layza Pelinson</h1>
          <p>pelinsonlayza@gmail.com</p>
        </div>
      </div>
      <button className="edit-profile-btn">
        ✏️ Editar Perfil
      </button>
    </section>
  )
}

export default ProfileHeader