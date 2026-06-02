import '../styles/home.css'
import '../styles/global.css'

import { Link, useNavigate } from 'react-router-dom'

import Categories from '../components/Categories'
import RecipesSection from '../components/RecipesSection'

import food1 from '../assets/img/food1.jpg'
import food2 from '../assets/img/food2.jpg'
import food3 from '../assets/img/food3.jpg'

function Home() {
    const navigate = useNavigate()
    return (
        <>
            <section className="home">
                <div className="home-text">
                    <span>Receitas Saudáveis</span>
                    <h1>
                        Bem-vindo à <br />
                        Tasty Cuisine!
                    </h1>
                    <p>
                        Descubra receitas saudáveis que elevam o simples ao especial.
                    </p>
                    <p>
                        Feitas para tornar cada momento mais especial.
                    </p>
            <div className="home-buttons">
                <Link to="/recipes">
                    <button className="primary-btn">
                        Explore Receitas
                    </button>
                    </Link>
                <Link to="/chefs">
                    <button className="secondary-btn">
                        Conhecer Chefes
                    </button>
                </Link>
            </div>
                </div>
                <div className="home-images">
                    <img
                        src={food1}
                        alt="Deliciosa refeição"
                        className="img-large"
                        loading="eager"
                    />
                    <div className="image-column">
                        <img
                            src={food2}
                            alt="Deliciosa refeição"
                            loading="lazy"
                        />
                        <img
                            src={food3}
                            alt="Deliciosa refeição"
                            loading="lazy"
                        />
                    </div>
                </div>
            </section>
            <Categories onSelect={(cat) => navigate(`/recipes?categoria=${encodeURIComponent(cat)}`)} />
            <RecipesSection limit={4} />
        </>
    )
}

export default Home