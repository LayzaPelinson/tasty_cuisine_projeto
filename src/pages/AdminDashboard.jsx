import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser'
import '../styles/admin.css'

const TABS = [
  { key: 'users', label: 'Usuários', icon: 'bi-people-fill' },
  { key: 'chefs', label: 'Chefes', icon: 'bi-person-badge-fill' },
  { key: 'recipes', label: 'Receitas', icon: 'bi-journal-richtext' },
  { key: 'categorias', label: 'Categorias', icon: 'bi-tags-fill' },
  { key: 'notificacoes', label: 'Notificações & Respostas', icon: 'bi-bell-fill' },
]

const OPCOES_MOTIVOS = [
  'Conteúdo impróprio ou ofensivo',
  'Violação dos Termos de Uso',
  'Spam ou comportamento suspeito',
  'Informações falsas ou enganosas',
  'Outro'
]

function StatusBadge({ active }) {
  return (
    <span className={`admin-badge ${active ? 'admin-badge-active' : 'admin-badge-inactive'}`}>
      <i className={`bi ${active ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}`}></i>
      {active ? 'Ativo' : 'Inativo'}
    </span>
  )
}

function ToggleBtn({ active, onToggle, disabled }) {
  return (
    <button
      className={`admin-toggle-btn ${active ? 'admin-toggle-deactivate' : 'admin-toggle-activate'}`}
      onClick={onToggle}
      disabled={disabled}
    >
      <i className={`bi ${active ? 'bi-slash-circle' : 'bi-arrow-counterclockwise'}`}></i>
      {active ? 'Desativar' : 'Reativar'}
    </button>
  )
}

function SearchBar({ placeholder, value, onChange }) {
  return (
    <div className="admin-search">
      <i className="bi bi-search"></i>
      <input placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  )
}

function ModalBloqueio({ item, type, onClose, onConfirm }) {
  const [motivoSelecionado, setMotivoSelecionado] = useState(OPCOES_MOTIVOS[0])
  const [outroMotivo, setOutroMotivo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const nomeExibicao = type === 'recipe' ? item.title : item.name

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    const motivoFinal = motivoSelecionado === 'Outro' ? outroMotivo.trim() : motivoSelecionado

    if (motivoSelecionado === 'Outro' && !motivoFinal) {
      return setError('Por favor, especifique o motivo.')
    }

    if (!descricao.trim()) {
      return setError('A descrição do bloqueio é obrigatória.')
    }

    setSubmitting(true)

    const payload = {
      targetId: item.id,
      tipoEntidade: type === 'recipe' ? 'RECEITA' : (type === 'chef' ? 'CHEFE' : 'USUARIO'),
      motivo: motivoFinal,
      descricao: descricao.trim()
    }

    const res = await onConfirm(payload)
    setSubmitting(false)

    if (res?.ok) {
      onClose()
    } else {
      setError(res?.error || 'Erro ao registrar bloqueio.')
    }
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={e => e.stopPropagation()}>
        <div className="admin-modal-header" style={{ borderBottom: '1px solid #fee2e2' }}>
          <span className="admin-modal-icon" style={{ color: '#dc2626' }}>
            <i className="bi bi-shield-slash-fill"></i>
          </span>
          <div>
            <h3 style={{ margin: 0, color: '#991b1b' }}>Confirmar Bloqueio</h3>
            <small style={{ color: '#4b5563', fontSize: '0.9rem' }}>
              Alvo: <strong>{nomeExibicao}</strong> (#{item.id})
            </small>
          </div>
          <button className="admin-modal-close" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-modal-body">
          {error && <p className="admin-error-text" style={{ marginBottom: '1rem' }}>{error}</p>}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Motivo do Bloqueio:
            </label>
            <select
              value={motivoSelecionado}
              onChange={e => setMotivoSelecionado(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc' }}
            >
              {OPCOES_MOTIVOS.map((m, idx) => (
                <option key={idx} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {motivoSelecionado === 'Outro' && (
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Especifique o motivo..."
                value={outroMotivo}
                onChange={e => setOutroMotivo(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Descrição Detalhada:
            </label>
            <textarea
              rows={4}
              placeholder="Explique o motivo para que o usuário entenda o que aconteceu..."
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc', resize: 'vertical' }}
            />
          </div>

          <div className="admin-modal-footer">
            <button type="button" className="admin-cancel-btn" onClick={onClose} disabled={submitting}>
              Cancelar
            </button>
            <button 
              type="submit" 
              className="admin-toggle-btn admin-toggle-deactivate" 
              disabled={submitting}
              style={{ padding: '0.6rem 1.2rem', cursor: 'pointer' }}
            >
              {submitting ? 'Bloqueando...' : 'Confirmar Bloqueio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ModalDetalhesNotificacao({ notificacao, onClose, onDesbloquear }) {
  const [submitting, setSubmitting] = useState(false)
  if (!notificacao) return null

  const idNotificacao = notificacao.codNotificacao || notificacao.id_notificacao || notificacao.id
  const usuario = notificacao.usuario || {}
  const nomeUsuario = usuario.nome_completo || usuario.nome || usuario.gmail || 'Usuário'
  const idUsuario = usuario.codUser || usuario.id
  const motivo = notificacao.motivo || notificacao.Motivo || 'Não informado'
  const descricao = notificacao.descricao || notificacao.Descricao || 'Sem descrição'
  const resposta = notificacao.respostaUsuario || notificacao.resposta || notificacao.resposta_usuario
  const data = notificacao.dataEnvio || notificacao.data_envio || notificacao.createdAt

  async function handleAcaoDesbloquear() {
    setSubmitting(true)
    await onDesbloquear(idUsuario, idNotificacao)
    setSubmitting(false)
    onClose()
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={e => e.stopPropagation()}>
        <div className="admin-modal-header" style={{ borderBottom: '1px solid #e5e7eb' }}>
          <span className="admin-modal-icon" style={{ color: '#0284c7' }}>
            <i className="bi bi-bell-fill"></i>
          </span>
          <div>
            <h3 style={{ margin: 0 }}>Detalhes da Contestação</h3>
            <small style={{ color: '#6b7280' }}>Notificação #{idNotificacao}</small>
          </div>
          <button className="admin-modal-close" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="admin-modal-body">
          <div className="admin-detail-row"><span>Usuário:</span><strong>{nomeUsuario} (#{idUsuario || 'N/A'})</strong></div>
          <div className="admin-detail-row"><span>Data do Envio:</span><strong>{data ? new Date(data).toLocaleDateString('pt-BR') : '-'}</strong></div>
          <div className="admin-detail-row"><span>Motivo do Bloqueio:</span><span className="admin-badge admin-badge-inactive">{motivo}</span></div>
          
          <div style={{ marginTop: '1rem' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>Descrição do Bloqueio (Admin):</label>
            <div style={{ background: '#f9fafb', padding: '0.8rem', borderRadius: '6px', border: '1px solid #e5e7eb', fontSize: '0.9rem' }}>
              {descricao}
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>Resposta / Contestação do Usuário:</label>
            {resposta ? (
              <div className="admin-user-response-bubble" style={{ width: '100%', display: 'block', boxSizing: 'border-box' }}>
                <i className="bi bi-chat-left-text-fill"></i> {resposta}
              </div>
            ) : (
              <span style={{ color: '#999', italic: 'true' }}>O usuário ainda não respondeu a esta notificação.</span>
            )}
          </div>
        </div>

        <div className="admin-modal-footer">
          <button className="admin-cancel-btn" onClick={onClose} disabled={submitting}>
            Fechar
          </button>
          <button 
            type="button" 
            className="admin-view-btn" 
            onClick={handleAcaoDesbloquear} 
            disabled={submitting || !idUsuario}
            style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none' }}
          >
            <i className="bi bi-check-circle-fill"></i> {submitting ? 'Processando...' : 'Desbloquear Usuário & Deletar'}
          </button>
        </div>
      </div>
    </div>
  )
}

function AdminNotificacoes({ notificacoes = [], onSelectNotificacao }) {
  const [search, setSearch] = useState('')
  const [filtroResposta, setFiltroResposta] = useState('todas')

  const filtered = notificacoes.filter(n => {
    const usuarioNome = n.usuario?.nome_completo || n.usuario?.nome || n.usuario?.gmail || ''
    const motivo = n.motivo || n.Motivo || ''
    const matchSearch = usuarioNome.toLowerCase().includes(search.toLowerCase()) || 
                        motivo.toLowerCase().includes(search.toLowerCase())

    const resposta = n.respostaUsuario || n.resposta || n.resposta_usuario
    if (filtroResposta === 'com_resposta') return matchSearch && Boolean(resposta)
    if (filtroResposta === 'sem_resposta') return matchSearch && !resposta
    return matchSearch
  })

  return (
    <div>
      <div className="admin-section-header">
        <h2><i className="bi bi-bell-fill"></i> Central de Contestações</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select 
            value={filtroResposta} 
            onChange={e => setFiltroResposta(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
          >
            <option value="todas">Todas</option>
            <option value="com_resposta">Com Resposta do Usuário</option>
            <option value="sem_resposta">Pendente de Resposta</option>
          </select>
          <SearchBar placeholder="Buscar por usuário ou motivo..." value={search} onChange={setSearch} />
        </div>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Usuário</th>
              <th>Motivo do Bloqueio</th>
              <th>Descrição (Admin)</th>
              <th>Resposta / Contestação</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="admin-empty">Nenhuma notificação encontrada.</td></tr>
            ) : (
              filtered.map(n => {
                const id = n.codNotificacao || n.id_notificacao || n.id
                const usuario = n.usuario?.nome_completo || n.usuario?.nome || n.usuario?.gmail || 'Usuário'
                const motivo = n.motivo || n.Motivo || 'Não informado'
                const descricao = n.descricao || n.Descricao || '-'
                const resposta = n.respostaUsuario || n.resposta || n.resposta_usuario
                const data = n.dataEnvio || n.data_envio || n.createdAt

                return (
                  <tr 
                    key={id} 
                    onClick={() => onSelectNotificacao(n)} 
                    style={{ cursor: 'pointer' }}
                    className="admin-table-row-hover"
                  >
                    <td className="admin-id">{id}</td>
                    <td><strong>{usuario}</strong></td>
                    <td><span className="admin-badge admin-badge-inactive">{motivo}</span></td>
                    <td>{descricao}</td>
                    <td>
                      {resposta ? (
                        <div className="admin-user-response-bubble">
                          <i className="bi bi-chat-left-text-fill"></i> {resposta}
                        </div>
                      ) : (
                        <span style={{ color: '#999', fontSize: '0.85rem' }}>Aguardando usuário...</span>
                      )}
                    </td>
                    <td>{data ? new Date(data).toLocaleDateString('pt-BR') : '-'}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AdminUsers({ data, onView, onToggle, onOpenImage }) {
  const [search, setSearch] = useState('')
  const filtered = data.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div>
      <div className="admin-section-header">
        <h2><i className="bi bi-people-fill"></i> Usuários Gerais</h2>
        <SearchBar placeholder="Buscar usuário..." value={search} onChange={setSearch} />
      </div>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th><th>Foto</th><th>Nome</th><th>E-mail</th><th>Data de Nascimento</th><th>Status</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={7} className="admin-empty">Nenhum usuário encontrado.</td></tr>}
            {filtered.map(u => (
              <tr key={u.id}>
                <td className="admin-id">{u.id}</td>
                <td>
                  <div className="admin-thumb-circle" onClick={() => u.photo && onOpenImage(u.photo)}>
                    {u.photo ? <img src={u.photo} alt={u.name} /> : <i className="bi bi-person"></i>}
                  </div>
                </td>
                <td>
                  <button className="admin-link-btn" onClick={() => onView(u)}>
                    {u.name}
                  </button>
                </td>
                <td>{u.email}</td>
                <td>{u.birthDate}</td>
                <td><StatusBadge active={u.active} /></td>
                <td>
                  <ToggleBtn active={u.active} onToggle={() => onToggle(u, 'user')} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AdminChefs({ data, onView, onToggle, onOpenImage }) {
  const [search, setSearch] = useState('')
  const filtered = data.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div>
      <div className="admin-section-header">
        <h2><i className="bi bi-person-badge-fill"></i> Chefes</h2>
        <SearchBar placeholder="Buscar chefe..." value={search} onChange={setSearch} />
      </div>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th><th>Foto</th><th>Nome</th><th>E-mail</th><th>Receitas</th><th>Status</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={7} className="admin-empty">Nenhum chefe encontrado.</td></tr>}
            {filtered.map(c => (
              <tr key={c.id}>
                <td className="admin-id">{c.id}</td>
                <td>
                  <div className="admin-thumb-circle" onClick={() => c.photo && onOpenImage(c.photo)}>
                    {c.photo ? <img src={c.photo} alt={c.name} /> : <i className="bi bi-person-badge"></i>}
                  </div>
                </td>
                <td>
                  <button className="admin-link-btn" onClick={() => onView(c)}>
                    {c.name}
                  </button>
                </td>
                <td>{c.email}</td>
                <td><span className="admin-count"><i className="bi bi-journal-richtext"></i> {c.recipes}</span></td>
                <td><StatusBadge active={c.active} /></td>
                <td>
                  <ToggleBtn active={c.active} onToggle={() => onToggle(c, 'chef')} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AdminRecipes({ data, onView, onToggle, onOpenImage }) {
  const [search, setSearch] = useState('')
  const filtered = data.filter(r =>
    (r.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.chef || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="admin-section-header">
        <h2><i className="bi bi-journal-richtext"></i> Receitas</h2>
        <SearchBar placeholder="Buscar receita ou chefe..." value={search} onChange={setSearch} />
      </div>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th><th>Foto</th><th>Título</th><th>Chefe</th><th>Categoria</th><th>Status</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={7} className="admin-empty">Nenhuma receita encontrada.</td></tr>}
            {filtered.map(r => (
              <tr key={r.id}>
                <td className="admin-id">{r.id}</td>
                <td>
                  <div className="admin-thumb-circle" onClick={() => r.photo && onOpenImage(r.photo)}>
                    {r.photo ? <img src={r.photo} alt={r.title} /> : <i className="bi bi-journal-text"></i>}
                  </div>
                </td>
                <td>
                  <button className="admin-link-btn" onClick={() => onView(r)}>
                    {r.title}
                  </button>
                </td>
                <td>{r.chef}</td>
                <td>
                  <span className="admin-category">
                    {r.categoryName}
                  </span>
                </td>
                <td><StatusBadge active={r.active} /></td>
                <td>
                  <ToggleBtn active={r.active} onToggle={() => onToggle(r, 'recipe')} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AdminCategorias({ categorias = [], onCreate }) {
  const [nome, setNome] = useState('')
  const [grupo, setGrupo] = useState('neutro')
  const [search, setSearch] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [saving, setSaving] = useState(false)

  const catList = Array.isArray(categorias) ? categorias : []
  const filtered = catList.filter(c =>
    (c.nomeCategoria || '').toLowerCase().includes(search.toLowerCase())
  )

  const vegCats = filtered.filter(c => (c.grupoCategoria || '').toLowerCase() === 'vegetariano' || (c.grupoCategoria || '').toLowerCase() === 'vegano')
  const neutroCats = filtered.filter(c => (c.grupoCategoria || '').toLowerCase() === 'neutro' || !c.grupoCategoria)
  const carnesCats = filtered.filter(c => (c.grupoCategoria || '').toLowerCase() === 'carnes')

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    const nomeTrim = nome.trim()
    if (!nomeTrim) return setError('Digite um nome para a categoria.')

    setSaving(true)
    const result = await onCreate(nomeTrim, grupo)
    setSaving(false)

    if (!result?.ok) return setError(result?.error || 'Falha ao criar categoria.')
    setNome('')
    setGrupo('neutro')
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2500)
  }

  return (
    <div>
      <div className="admin-section-header">
        <h2><i className="bi bi-tags-fill"></i> Categorias</h2>
        <SearchBar placeholder="Buscar categoria..." value={search} onChange={setSearch} />
      </div>

      <form className="admin-category-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome da categoria (ex: Camarao)"
          value={nome}
          onChange={e => setNome(e.target.value)}
        />
        <select
          className="admin-category-select"
          value={grupo}
          onChange={e => setGrupo(e.target.value)}
        >
          <option value="vegetariano">Vegetariano / Vegano</option>
          <option value="neutro">Neutro</option>
          <option value="carnes">Carnes</option>
        </select>
        <button type="submit" className="admin-view-btn" disabled={saving}>
          <i className="bi bi-plus-lg"></i> {saving ? 'Salvando...' : 'Adicionar'}
        </button>
      </form>

      {error && <p className="admin-error-text">{error}</p>}
      {success && <p className="admin-success-text">✓ Categoria adicionada com sucesso!</p>}

      <div className="admin-categories-grid">
        <div className="admin-category-col col-vegetariano">
          <h3><i className="bi bi-flower1"></i> Vegetariano / Vegano</h3>
          <div className="admin-category-list">
            {vegCats.length === 0 ? (
              <p className="admin-category-empty">Nenhuma categoria</p>
            ) : (
              vegCats.map(c => (
                <div key={c.codCategoria || c.id} className="admin-category-card">
                  <span className="admin-category-id">#{c.codCategoria || c.id}</span>
                  <span className="admin-category-name">{c.nomeCategoria}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="admin-category-col col-neutro">
          <h3><i className="bi bi-circle"></i> Neutro</h3>
          <div className="admin-category-list">
            {neutroCats.length === 0 ? (
              <p className="admin-category-empty">Nenhuma categoria</p>
            ) : (
              neutroCats.map(c => (
                <div key={c.codCategoria || c.id} className="admin-category-card">
                  <span className="admin-category-id">#{c.codCategoria || c.id}</span>
                  <span className="admin-category-name">{c.nomeCategoria}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="admin-category-col col-carnes">
          <h3><i className="bi bi-egg-fried"></i> Carnes</h3>
          <div className="admin-category-list">
            {carnesCats.length === 0 ? (
              <p className="admin-category-empty">Nenhuma categoria</p>
            ) : (
              carnesCats.map(c => (
                <div key={c.codCategoria || c.id} className="admin-category-card">
                  <span className="admin-category-id">#{c.codCategoria || c.id}</span>
                  <span className="admin-category-name">{c.nomeCategoria}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ImageZoomModal({ imageSrc, onClose }) {
  if (!imageSrc) return null
  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-image-zoom-card" onClick={e => e.stopPropagation()}>
        <button className="admin-zoom-close-btn" onClick={onClose}>
          <i className="bi bi-x-lg"></i>
        </button>
        <img src={imageSrc} alt="Zoom" className="admin-zoom-img" />
      </div>
    </div>
  )
}

function parseRecipeList(value) {
  if (!value) return []
  if (Array.isArray(value)) return value
  try { return JSON.parse(value) } catch { return [] }
}

function DetailModal({ item, type, onClose, navigate }) {
  if (!item) return null
  function goTo() {
    if (type === 'chef') navigate(`/chef/${item.id}`)
    else if (type === 'user') navigate('/profile')
    onClose()
  }

  const PLACEHOLDER = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=75'
  const fotoReceita = item.photo || item.foto || item.fotoReceita || PLACEHOLDER
  const descricao = item.descricao || item.description || 'Sem descrição cadastrada.'
  
  const rawIngredientes = item.ingredients || item.itens || []
  const listaIngredientes = typeof rawIngredientes === 'string'
    ? parseRecipeList(rawIngredientes)
    : (Array.isArray(rawIngredientes) ? rawIngredientes : [])

  const rawModoPreparo = item.modo_preparo || item.modoPreparo || item.instructions || ''
  const listaModoPreparo = typeof rawModoPreparo === 'string'
    ? parseRecipeList(rawModoPreparo)
    : (Array.isArray(rawModoPreparo) ? rawModoPreparo : [])

  const titles = { recipe: 'Detalhes da Receita', chef: 'Chefe', user: 'Usuário' }
  const icons = { recipe: 'bi-journal-richtext', chef: 'bi-person-badge-fill', user: 'bi-person-circle' }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className={`admin-modal ${type === 'recipe' ? 'admin-modal-large' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="admin-modal-header">
          <span className="admin-modal-icon"><i className={`bi ${icons[type]}`}></i></span>
          <h3>{titles[type]}</h3>
          <button className="admin-modal-close" onClick={onClose}><i className="bi bi-x-lg"></i></button>
        </div>

        <div className="admin-modal-body">
          {type === 'recipe' && (
            <div className="admin-recipe-preview">
              <div className="admin-recipe-header">
                <img src={fotoReceita} alt={item.title} className="admin-recipe-img" />
                <div className="admin-recipe-header-info">
                  <h2>{item.title}</h2>
                  <div className="admin-recipe-tags">
                    <span className="admin-category">{item.categoryName}</span>
                    <StatusBadge active={item.active} />
                  </div>
                  <p className="admin-recipe-chef"><i className="bi bi-person"></i> Por: <strong>{item.chef}</strong></p>
                  <p className="admin-recipe-desc">{descricao}</p>
                </div>
              </div>

              <div className="admin-recipe-grid">
                <div className="admin-recipe-box">
                  <h4><i className="bi bi-basket-fill"></i> Ingredientes</h4>
                  {listaIngredientes.length === 0 ? (
                    <p className="admin-empty-text">Nenhum ingrediente informado.</p>
                  ) : (
                    <ul>
                      {listaIngredientes.map((ing, idx) => (
                        <li key={idx}>
                          {typeof ing === 'object' && ing !== null
                            ? `${ing.quantidade ?? ing.qtdIngrediente ?? ''} ${ing.unidade ?? ing.uniMedida ?? ''} — ${ing.nome ?? ing.nomeIngrediente ?? ''}`
                            : ing}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="admin-recipe-box">
                  <h4><i className="bi bi-list-ol"></i> Modo de Preparo</h4>
                  {listaModoPreparo.length === 0 ? (
                    <p className="admin-empty-text">Nenhum passo a passo informado.</p>
                  ) : (
                    <ol>
                      {listaModoPreparo.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  )}
                </div>
              </div>
            </div>
          )}

          {type === 'chef' && (
            <>
              <div className="admin-detail-row"><span>Nome</span><strong>{item.name}</strong></div>
              <div className="admin-detail-row"><span>E-mail</span><strong>{item.email}</strong></div>
              <div className="admin-detail-row"><span>Receitas</span><strong>{item.recipes}</strong></div>
              <div className="admin-detail-row"><span>Status</span><StatusBadge active={item.active} /></div>
            </>
          )}

          {type === 'user' && (
            <>
              <div className="admin-detail-row"><span>Nome</span><strong>{item.name}</strong></div>
              <div className="admin-detail-row"><span>E-mail</span><strong>{item.email}</strong></div>
              <div className="admin-detail-row"><span>Nascimento</span><strong>{item.birthDate}</strong></div>
              <div className="admin-detail-row"><span>Status</span><StatusBadge active={item.active} /></div>
            </>
          )}
        </div>

        <div className="admin-modal-footer">
          <button className="admin-cancel-btn" onClick={onClose}>Fechar</button>
          {type !== 'recipe' && (
            <button className="admin-view-btn" onClick={goTo}>
              <i className="bi bi-box-arrow-up-right"></i> Ver no site
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function AdminDashboard() {
  const navigate = useNavigate()
  const {
    recipes,
    categorias,
    loadCategorias,
    createCategoria,
    loadAllUsers,
    logout,
    loadRecipes,
    toggleUserBlock,
    registrarBloqueio,
    loadTodasNotificacoes,
    notificacoesRaw,
  } = useUser()

  const [zoomImage, setZoomImage] = useState(null)
  const [activeTab, setActiveTab] = useState('users')
  const [rawUsers, setRawUsers] = useState([])
  const [notificacoes, setNotificacoes] = useState([])
  const [modal, setModal] = useState(null)
  const [modalBloqueio, setModalBloqueio] = useState(null)
  const [loadingData, setLoadingData] = useState(true)
  const [notificacaoSelecionada, setNotificacaoSelecionada] = useState(null)
  const { deleteNotificacao } = useUser() // Pega do hook

  async function carregarTudo() {
    setLoadingData(true)
    const [usersData, notifsData] = await Promise.all([
      loadAllUsers(),
      loadCategorias(),
      loadTodasNotificacoes()
    ])
    setRawUsers(Array.isArray(usersData) ? usersData : [])
    setNotificacoes(Array.isArray(notifsData) ? notifsData : [])
    setLoadingData(false)
  }

  useEffect(() => {
    carregarTudo()
    loadRecipes()
  }, [])

  async function handleDesbloquearEDeletar(idUsuario, idNotificacao) {
  // 1. Alterna o status de bloqueio do usuário (desbloqueia)
  await toggleUserBlock(idUsuario)
  
  // 2. Deleta a notificação
  if (deleteNotificacao) {
    await deleteNotificacao(idNotificacao)
  }
  
  // 3. Atualiza a tela
  await carregarTudo()
}
  function formatDate(dateString) {
    if (!dateString) return 'N/A'
    const cleanString = dateString.split('T')[0].replace(/\//g, '-')
    const parts = cleanString.split('-')
    
    if (parts.length === 3) {
      const [year, month, day] = parts
      return `${day}/${month}/${year}`
    }

    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' })
  }

  const recipesNormalized = recipes.map(r => {
    let catName = 'Não especificado'
    const rawCat = r.category || r.categorias || r.categoria
    if (Array.isArray(rawCat) && rawCat.length > 0) {
      catName = rawCat[0]?.nomeCategoria || 'Não especificado'
    } else if (typeof rawCat === 'object' && rawCat !== null) {
      catName = rawCat.nomeCategoria || 'Não especificado'
    } else if (typeof rawCat === 'string' && rawCat) {
      catName = rawCat
    }

    const resolvedChefId = r.usuario?.codUser || r.usuario?.id || r.chefId || r.codUser

    return {
      ...r,
      id: r.codReceitas || r.id,
      title: r.nomeReceita || r.title || 'Sem título',
      chef: r.usuario?.nome_completo || r.chef || 'Anônimo',
      chefId: resolvedChefId,
      photo: r.fotoReceita || r.foto || r.image || r.photo,
      ingredientes: r.ingredientes || r.ingredientes_receita || r.itens || [],
      categoryName: catName,
      active: r.statusReceita ? r.statusReceita.toUpperCase() === 'ATIVO' : (r.active ?? true)
    }
  })

  const users = rawUsers
    .filter(u => u.funcao !== 'Chefe')
    .filter(u => u.funcao !== 'ADMIN')
    .map(u => ({
      id: u.codUser,
      name: u.nome_completo,
      email: u.gmail,
      birthDate: formatDate(u.idade || u.data_nascimento || u.nascimento || u.dataNascimento),
      photo: u.fotoPerfil || u.photo || u.foto,
      active: u.bloqueado === 0,
    }))

  const chefs = rawUsers
    .filter(u => u.funcao === 'Chefe')
    .filter(u => u.funcao !== 'ADMIN')
    .map(u => {
      const totalReceitas = recipesNormalized.filter(r => 
        String(r.chefId) === String(u.codUser)
      ).length
      return {
        id: u.codUser,
        name: u.nome_completo,
        email: u.gmail,
        recipes: totalReceitas,
        photo: u.fotoPerfil || u.photo || u.foto,
        active: u.bloqueado === 0,
      }
    })

  const stats = [
    { label: 'Usuários', value: users.length, active: users.filter(u => u.active).length, icon: 'bi-people-fill', tab: 'users' },
    { label: 'Chefes', value: chefs.length, active: chefs.filter(c => c.active).length, icon: 'bi-person-badge-fill', tab: 'chefs' },
    { label: 'Receitas', value: recipesNormalized.length, active: recipesNormalized.filter(r => r.active).length, icon: 'bi-journal-richtext', tab: 'recipes' },
  ]

  function handleSolicitarToggle(item, type) {
    if (item.active) {
      setModalBloqueio({ item, type })
    } else {
      toggleUserBlock(item.id).then(() => {
        carregarTudo()
        loadRecipes()
      })
    }
  }

  async function handleConfirmarBloqueio(payload) {
    const result = await registrarBloqueio(payload)
    if (result.ok) {
      await carregarTudo()
      await loadRecipes()
    }
    return result
  }

  async function handleCreateCategoria(nome, grupo) {
    const res = await createCategoria(nome, grupo)
    await loadCategorias()
    return res
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.ctrlKey && e.key === 'R') {
        logout()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header-left">
          <h1>Painel Administrativo</h1>
          <p>Gerencie usuários, chefes, receitas, categorias e contestações</p>
        </div>
        <div className="admin-header-right">
          <div className="admin-header-badge">
            <i className="bi bi-shield-fill-check"></i> Administrador
          </div>
          <button className="admin-exit-btn" onClick={() => { logout(); navigate('/login') }}>
            <i className="bi bi-box-arrow-left"></i> Sair
          </button>
        </div>
      </header>

      <div className="admin-stats">
        {stats.map(s => (
          <button key={s.tab} className={`admin-stat-card ${activeTab === s.tab ? 'selected' : ''}`} onClick={() => setActiveTab(s.tab)}>
            <div className="admin-stat-icon"><i className={`bi ${s.icon}`}></i></div>
            <div className="admin-stat-info">
              <span className="admin-stat-label">{s.label}</span>
              <span className="admin-stat-value">{s.value}</span>
              <span className="admin-stat-sub">{s.active} ativos</span>
            </div>
          </button>
        ))}
      </div>

      <div className="admin-tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`admin-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <i className={`bi ${tab.icon}`}></i> {tab.label}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {loadingData ? (
          <p className="admin-empty">Carregando dados...</p>
        ) : (
          <>
            {activeTab === 'users' && (
              <AdminUsers
                data={users}
                onView={u => setModal({ item: u, type: 'user' })}
                onToggle={handleSolicitarToggle}
                onOpenImage={setZoomImage}
              />
            )}

            {activeTab === 'chefs' && (
              <AdminChefs
                data={chefs}
                onView={c => setModal({ item: c, type: 'chef' })}
                onToggle={handleSolicitarToggle}
                onOpenImage={setZoomImage}
              />
            )}

            {activeTab === 'recipes' && (
              <AdminRecipes
                data={recipesNormalized}
                onView={r => setModal({ item: r, type: 'recipe' })}
                onToggle={handleSolicitarToggle}
                onOpenImage={setZoomImage}
              />
            )}

            {activeTab === 'categorias' && (
              <AdminCategorias
                categorias={categorias}
                onCreate={handleCreateCategoria}
              />
            )}

            {activeTab === 'notificacoes' && (
              <AdminNotificacoes
                notificacoes={notificacoesRaw}
                onRefresh={carregarTudo}
                onSelectNotificacao={setNotificacaoSelecionada}
              />
            )}
            {/* Modal de Detalhes da Notificação */}
            {notificacaoSelecionada && (
              <ModalDetalhesNotificacao
                notificacao={notificacaoSelecionada}
                onClose={() => setNotificacaoSelecionada(null)}
                onDesbloquear={handleDesbloquearEDeletar}
              />
            )}
          </>
        )}
      </div>

      {modal && (
        <DetailModal item={modal.item} type={modal.type} onClose={() => setModal(null)} navigate={navigate} />
      )}

      {modalBloqueio && (
        <ModalBloqueio
          item={modalBloqueio.item}
          type={modalBloqueio.type}
          onClose={() => setModalBloqueio(null)}
          onConfirm={handleConfirmarBloqueio}
        />
      )}

      <ImageZoomModal imageSrc={zoomImage} onClose={() => setZoomImage(null)} />
    </div>
  )
}

export default AdminDashboard