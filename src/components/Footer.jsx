import '../styles/footer.css'

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <h2>Tasty Cuisine</h2>
                <p>
                    Sua plataforma de receitas saudáveis favorita.
                </p>

                <nav className="footer-links">
                    <a href="#">Termos de Serviço</a>
                    <a href="#">Política de Privacidade</a>
                    <a href="#">Contato</a>
                </nav>
            </div>

            <div className="footer-bottom">
                <p>&copy; 2026 Tasty Cuisine. Todos os direitos reservados.</p>
            </div>
        </footer>
    )
}

export default Footer