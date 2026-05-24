import '../styles/header.css'

import { Link } from 'react-router-dom'

function Header() {
    return (
        <header  className="header">
            <div className="logo">
                Tasty Cuisine
            </div>

            <nav className="nav">
                <Link to="/">Home</Link>
                <Link to="/recipes">Receitas</Link>
                <Link to="/chefs">Chefes</Link>
                <Link to="/profile">Perfil</Link>
            </nav>
            </header>
    )
}
export default Header
