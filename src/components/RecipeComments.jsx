import { useState, useEffect } from 'react'
import { useUser } from '../hooks/useUser'
import '../styles/recipeComments.css'

const API_BASE = 'http://localhost:8080'

function Stars({ value, onChange }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="stars-input">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          className={n <= (hovered || value) ? 'star active' : 'star'}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
        >★</button>
      ))}
    </div>
  )
}

function StarsDisplay({ value }) {
  return (
    <span className="stars-display">
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} className={n <= value ? 'star active' : 'star'}>★</span>
      ))}
    </span>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function RecipeComments({ recipeId}) {
  const { user } = useUser()
  const [comments, setComments] = useState([])
  const [nota, setNota] = useState(0)
  const [texto, setTexto] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const jaAvaliou = comments.some(c => c.usuario?.codUser === user.id)
  const isChef = user?.funcao === 'Chefe'

useEffect(() => {
  fetch(`${API_BASE}/comentario/receita/${recipeId}`)
    .then(r => r.ok ? r.json() : [])
    .then(data => {
      if (Array.isArray(data)) {
        // 💡 Filtra para manter apenas os comentários com status_comentarios "ATIVO"
        const ativos = data.filter(c => c.status_comentarios === 'ATIVO')
        setComments(ativos)
      } else {
        setComments([])
      }
    })
    .catch(() => setComments([]))
}, [recipeId])

  async function handleSubmit(e) {
  e.preventDefault()
  
  // Validações iniciais permanecem iguais
  if (nota === 0) return setError('Selecione uma nota.')
  if (!texto.trim()) return setError('Escreva um comentário.')
  
  setError('')
  setSubmitting(true)
  
  try {
    // 💡 AGORA É UMA REQUISIÇÃO ÚNICA! 
    // Enviamos a nota e o texto juntos para o @PostMapping do seu ComentarioController
    const resCom = await fetch(`${API_BASE}/comentario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        texto, 
        nota: String(nota), // Convertido para String porque sua Entidade mapeia a 'Nota' como String
        usuario: { codUser: user.id }, 
        receita: { codReceitas: recipeId } 
      })
    })

    if (!resCom.ok) throw new Error()
    
    const saved = await resCom.json()
    
    // Atualiza o estado local para renderizar o novo comentário imediatamente na tela
    setComments(prev => [{
      ...saved,
      usuario: {
        codUser: user.id,
        nomeDeUsuario: user.name,
        nomeCompleto: user.name
      }
    }, ...prev])
    
    // Limpa os campos do formulário e exibe sucesso
    setNota(0)
    setTexto('')
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
    
  } catch {
    setError('Falha ao enviar comentário. Tente novamente.')
  } finally {
    setSubmitting(false)
  }
}

  return (
    <div className="recipe-comments">
      <h2>Comentários</h2>


      {!isChef && !jaAvaliou && (
        <form className="comment-form" onSubmit={handleSubmit}>
          <p className="comment-form-label">Sua avaliação</p>
          <Stars value={nota} onChange={v => { setNota(v); setError('') }} />
          {nota > 0 && (
            <textarea
              placeholder="Compartilhe sua opinião sobre essa receita..."
              value={texto}
              onChange={e => setTexto(e.target.value)}
              rows={3}
              maxLength={300}
            />
          )}
          {error && <p className="comment-error">{error}</p>}
          {success && <p className="comment-success">✓ Comentário enviado com sucesso!</p>}
          {nota > 0 && (
            <button type="submit" className="comment-submit" disabled={submitting}>
              {submitting ? 'Enviando...' : 'Enviar Comentário'}
            </button>
          )}
        </form>
      )}
      {jaAvaliou && (
        <div>
          <p className="already-comment">Já Avaliou</p>
        </div>
      )}

      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="no-comments">
            <span>💬</span>
            
            <p>Nenhum comentário ainda.{isChef ? '' : ' Seja o primeiro a comentar!'}</p>
          </div>
        ) : (
          comments.map(c => (
            <div key={c.codComentarios} className="comment-card">
              <div className="comment-header">
                <span className="comment-author">
                  {c.usuario?.nomeCompleto ?? 'Usuário'}
                </span>
                {c.nota > 0 && <StarsDisplay value={c.nota} />}
                <span className="comment-date">{formatDate(c.dataComentario)}</span>
              </div>
              <p className="comment-text">{c.texto}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default RecipeComments
