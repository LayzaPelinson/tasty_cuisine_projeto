import '../styles/header.css'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser.jsx'

function Header() {
    const { user, logout, loadNotificacaoUsuario, enviarContestacao } = useUser()
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false)
    const [notificacoes, setNotificacoes] = useState([])
    const [selectedNotification, setSelectedNotification] = useState(null)
    const [respostaTexto, setRespostaTexto] = useState('')
    const [enviando, setEnviando] = useState(false)

    useEffect(() => {
        carregarNotificacoes()
    }, [user])

    async function carregarNotificacoes() {
        if (user && user.id) {
            const data = await loadNotificacaoUsuario(user.id)
            if (data) {
                setNotificacoes(Array.isArray(data) ? data : [data])
            } else {
                setNotificacoes([])
            }
        }
    }

    async function handleEnviarContestacao() {
        if (!respostaTexto.trim()) return

        setEnviando(true)
        const codNotificacao = selectedNotification.codNotificacao || selectedNotification.id
        const res = await enviarContestacao(codNotificacao, respostaTexto)

        if (res.ok) {
            alert('Sua resposta foi enviada ao Administrador!')
            setSelectedNotification(null)
            setRespostaTexto('')
            await carregarNotificacoes()
        } else {
            alert('Erro ao enviar resposta. Tente novamente.')
        }
        setEnviando(false)
    }

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
                        {user.funcao !== 'Chefe' && <Link to="/">Home</Link>}
                        <Link to="/recipes">Receitas</Link>
                        {user.funcao === 'Chefe' ? (
                            <>
                                <Link to="/publish">Publicar Receita</Link>
                                <Link to="/chef-profile">Perfil</Link>
                            </>
                        ) : (
                            <Link to="/profile">Perfil</Link>
                        )}

                        {/* Ícone de Notificação */}
                        <div className="notification-container">
                            <button 
                                className="notification-btn" 
                                onClick={() => setShowModal(!showModal)}
                                aria-label="Notificações"
                            >
                                🔔
                                {notificacoes.length > 0 && (
                                    <span className="notification-badge">{notificacoes.length}</span>
                                )}
                            </button>

                            {/* Dropdown de Notificações */}
                            {showModal && (
                                <div className="notification-modal">
                                    <div className="notification-header">
                                        <h3>Notificações</h3>
                                        <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
                                    </div>
                                    <div className="notification-body">
                                        {notificacoes.length === 0 ? (
                                            <p className="no-notifications">Nenhuma notificação por enquanto.</p>
                                        ) : (
                                            notificacoes.map((item) => (
                                                <div 
                                                    key={item.codNotificacao || item.id} 
                                                    className="notification-item clickable"
                                                    onClick={() => {
                                                        setSelectedNotification(item)
                                                        setRespostaTexto(item.respostaUsuario || item.resposta || '')
                                                        setShowModal(false)
                                                    }}
                                                >
                                                    <strong>{item.motivo || item.Motivo}</strong>
                                                    <p>{item.receita?.nomeReceita || item.descricao || item.Descricao}</p>
                                                    {item.dataEnvio && (
                                                        <span className="notification-date">
                                                            {new Date(item.dataEnvio).toLocaleDateString('pt-BR')}
                                                        </span>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button className="nav-logout" onClick={handleLogout}>Sair</button>
                    </>
                )}
            </nav>

            {/* Modal Grande de Detalhes da Notificação */}
            {selectedNotification && (
                <div className="notification-detail-overlay" onClick={() => setSelectedNotification(null)}>
                    <div className="notification-detail-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="notification-detail-header">
                            <h2>Detalhes do Bloqueio</h2>
                            <button className="close-btn" onClick={() => setSelectedNotification(null)}>✕</button>
                        </div>

                        <div className="notification-detail-content">
                            {selectedNotification.receita?.fotoReceita && (
                                <img 
                                    src={selectedNotification.receita.fotoReceita} 
                                    alt={selectedNotification.receita.nomeReceita} 
                                    className="notification-recipe-img"
                                />
                            )}

                            <h3>{selectedNotification.receita?.nomeReceita || 'Receita Desconhecida'}</h3>

                            <div className="detail-section reason-box">
                                <strong>Motivo do Bloqueio:</strong>
                                <p>{selectedNotification.motivo || selectedNotification.Motivo || 'Não informado.'}</p>
                            </div>

                            {(selectedNotification.descricao || selectedNotification.Descricao) && (
                                <div className="detail-section">
                                    <strong>Observações do Administrador:</strong>
                                    <p>{selectedNotification.descricao || selectedNotification.Descricao}</p>
                                </div>
                            )}

                            {/* Campo de Resposta / Contestação do Usuário */}
                            <div className="detail-section response-section">
                                <strong>Sua Resposta / Contestação:</strong>
                                {selectedNotification.respostaUsuario ? (
                                    <p className="user-response-text">{selectedNotification.respostaUsuario}</p>
                                ) : (
                                    <textarea
                                        rows="3"
                                        placeholder="Escreva aqui sua justificativa ou resposta para o administrador..."
                                        value={respostaTexto}
                                        onChange={(e) => setRespostaTexto(e.target.value)}
                                        className="response-textarea"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="notification-detail-footer">
                            {!selectedNotification.respostaUsuario && (
                                <button 
                                    className="send-response-btn" 
                                    onClick={handleEnviarContestacao}
                                    disabled={enviando || !respostaTexto.trim()}
                                >
                                    {enviando ? 'Enviando...' : 'Enviar Resposta'}
                                </button>
                            )}
                            <button className="close-modal-btn" onClick={() => setSelectedNotification(null)}>
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}

export default Header