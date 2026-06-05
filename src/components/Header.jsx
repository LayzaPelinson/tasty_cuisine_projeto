import '../styles/header.css'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser.jsx'

function Header() {
    const { user, logout } = useUser()
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        navigate('/')
    }

    return (
        <header className="header">
            <div className="logo">Tasty Cuisine</div>
            <nav className="nav">
                {!user ? (
                    <Link to="/login">Login</Link>
                ) : (
                    <>
                        {user.role !== 'chef' && <Link to="/">Home</Link>}
                        <Link to="/recipes">Receitas</Link>
                        {user.role !== 'chef' && <Link to="/chefs">Chefes</Link>}
                        {user.role === 'chef' ? (
                            <>
                                <Link to="/publish">Publicar Receita</Link>
                                <Link to="/chef-profile">Perfil</Link>
                            </>
                        ) : (
                            <Link to="/profile">Perfil</Link>
                        )}
                    </>
                )}
            </nav>
        </header>
    )
}

export default Header
