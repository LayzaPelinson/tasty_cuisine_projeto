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


    return (
        <header className="header">
            <div className="logo">Tasty Cuisine</div>
            <nav className="nav">
                {!user ? (
                    <Link to="/login">Login</Link>
                ) : (
                    <>
                        <>
                    {user.funcao == 'Chefe' ? (<>
                        {/* Ícone de Notificação */}
                         <div className="notification-container">
                            <button 
                                className="notification-btn" 
                                onClick={() => setShowModal(!showModal)}
                                aria-label="Notificações"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="white" class="bi bi-bell-fill" viewBox="0 0 16 16">
                                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901"/>
                                </svg>
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
                    </> 
                        
                    ): (null)
                    }
                    
                       
                    </>
                    
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