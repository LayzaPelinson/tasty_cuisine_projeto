import '../styles/home.css'
import '../styles/global.css'

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser.jsx'

import Categories from '../components/Categories'
import RecipesSection from '../components/RecipesSection'

import food1 from '../assets/img/food1.jpg'
import food2 from '../assets/img/food2.jpg'
import food3 from '../assets/img/food3.jpg'

function GuestModal({ onClose }) {
    return (
        <div className="guest-overlay" onClick={onClose}>
            <div className="guest-modal" onClick={e => e.stopPropagation()}>
                <p>Faça login ou crie uma conta para ter acesso a tudo!</p>
                <div className="guest-modal-actions">
                    <Link to="/login"><button className="primary-btn">Entrar / Cadastrar</button></Link>
                    <button className="secondary-btn" onClick={onClose}>Fechar</button>
                </div>
            </div>
        </div>
    )
}



function Home() {
    const { user } = useUser()
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false)
    return (
        <>
            {showModal && <GuestModal onClose={() => setShowModal(false)} />}
            <section className="home">
                <div className="home-text">
                    <span>Receitas Saudáveis</span>
                    <h1>Bem-vindo à <br />Tasty Cuisine!</h1>
                    <p>Descubra receitas saudáveis que elevam o simples ao especial.</p>
                    <p>Feitas para tornar cada momento mais especial.</p>
                    <div className="home-buttons">
                        <button className="primary-btn" onClick={user ? () => navigate('/recipes') : () => setShowModal(true)}>Explore Receitas</button>
                        <button className="secondary-btn" onClick={user ? () => navigate('/chefs') : () => setShowModal(true)}>Conhecer Chefes</button>
                    </div>
                </div>
                <div className="home-images">
                    <img src={food1} alt="Deliciosa refeição" className="img-large" loading="eager" />
                    <div className="image-column">
                        <img src={food2} alt="Deliciosa refeição" loading="lazy" />
                        <img src={food3} alt="Deliciosa refeição" loading="lazy" />
                    </div>
                </div>
            </section>
            <Categories
                onSelect={(cat) => {
                    if (!user) { setShowModal(true); return }
                    navigate(`/recipes?categoria=${encodeURIComponent(cat)}`)
                }}
            />
            <RecipesSection limit={10} onGuestClick={() => setShowModal(true)} locked={!user} />
        </>
    )
}
export default Home
