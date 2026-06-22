import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser'
import '../styles/admin.css'

const TABS = [
  { key: 'users',      label: 'Usuários',     icon: 'bi-people-fill' },
  { key: 'chefs',      label: 'Chefes',       icon: 'bi-person-badge-fill' },
  { key: 'recipes',    label: 'Receitas',     icon: 'bi-journal-richtext' },
  { key: 'comments',   label: 'Comentários',  icon: 'bi-chat-dots-fill' },
  { key: 'categorias', label: 'Categorias',   icon: 'bi-tags-fill' },
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

function AdminUsers({ data, onView, onToggle }) {
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
              <th>#</th><th>Nome</th><th>E-mail</th><th>Idade</th><th>Status</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={6} className="admin-empty">Nenhum usuário encontrado.</td></tr>}
            {filtered.map(u => (
              <tr key={u.id}>
                <td className="admin-id">{u.id}</td>
                <td>
                  <button className="admin-link-btn" onClick={() => onView(u)}>
                    <i className="bi bi-person-circle"></i> {u.name}
                  </button>
                </td>
                <td>{u.email}</td>
                <td>{u.age} anos</td>
                <td><StatusBadge active={u.active} /></td>
                <td>
                  <ToggleBtn active={u.active} onToggle={() => onToggle(u)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AdminChefs({ data, onView, onToggle }) {
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
              <th>#</th><th>Nome</th><th>E-mail</th><th>Receitas</th><th>Status</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={6} className="admin-empty">Nenhum chefe encontrado.</td></tr>}
            {filtered.map(c => (
              <tr key={c.id}>
                <td className="admin-id">{c.id}</td>
                <td>
                  <button className="admin-link-btn" onClick={() => onView(c)}>
                    <i className="bi bi-person-badge"></i> {c.name}
                  </button>
                </td>
                <td>{c.email}</td>
                <td><span className="admin-count"><i className="bi bi-journal-richtext"></i> {c.recipes}</span></td>
                <td><StatusBadge active={c.active} /></td>
                <td>
                  <ToggleBtn active={c.active} onToggle={() => onToggle(c)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AdminRecipes({ data, onView, onToggle }) {
  const [search, setSearch] = useState('')
  const filtered = data.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.chef.toLowerCase().includes(search.toLowerCase())
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
              <th>#</th><th>Título</th><th>Chefe</th><th>Categoria</th><th>Status</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={6} className="admin-empty">Nenhuma receita encontrada.</td></tr>}
            {filtered.map(r => (
              <tr key={r.id}>
                <td className="admin-id">{r.id}</td>
                <td>
                  <button className="admin-link-btn" onClick={() => onView(r)}>
                    <i className="bi bi-book"></i> {r.title}
                  </button>
                </td>
                <td>{r.chef}</td>
                <td><span className="admin-category">{r.category}</span></td>
                <td><StatusBadge active={r.active} /></td>
                <td>
                  <ToggleBtn active={r.active} onToggle={() => onToggle(r)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AdminComments({ data, onView, onToggle }) {
  const [search, setSearch] = useState('')
  const filtered = data.filter(c =>
    c.text.toLowerCase().includes(search.toLowerCase()) ||
    c.user.toLowerCase().includes(search.toLowerCase()) ||
    c.recipe.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div>
      <div className="admin-section-header">
        <h2><i className="bi bi-chat-dots-fill"></i> Comentários</h2>
        <SearchBar placeholder="Buscar por usuário, receita ou texto..." value={search} onChange={setSearch} />
      </div>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th><th>Comentário</th><th>Usuário</th><th>Receita</th><th>Nota</th><th>Status</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={7} className="admin-empty">Nenhum comentário encontrado.</td></tr>}
            {filtered.map(c => (
              <tr key={c.id}>
                <td className="admin-id">{c.id}</td>
                <td>
                  <button className="admin-link-btn comment-text-btn" onClick={() => onView(c)}>
                    <i className="bi bi-chat-quote"></i>
                    <span className="admin-comment-preview">{c.text}</span>
                  </button>
                </td>
                <td>{c.user}</td>
                <td>{c.recipe}</td>
                <td>
                  <span className="admin-rating">
                    {Array.from({ length: 5 }, (_, i) => (
                      <i key={i} className={`bi ${i < c.rating ? 'bi-star-fill' : 'bi-star'}`}></i>
                    ))}
                  </span>
                </td>
                <td><StatusBadge active={c.active} /></td>
                <td>
                  <ToggleBtn active={c.active} onToggle={() => onToggle(c)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AdminCategorias({ categorias, onCreate }) {
  const [nome, setNome] = useState('')
  const [search, setSearch] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [saving, setSaving] = useState(false)

  const filtered = categorias.filter(c =>
    (c.nomeCategoria || '').toLowerCase().includes(search.toLowerCase())
  )

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    const nomeTrim = nome.trim()
    if (!nomeTrim) return setError('Digite um nome para a categoria.')

    setSaving(true)
    const result = await onCreate(nomeTrim)
    setSaving(false)

    if (!result.ok) return setError(result.error || 'Falha ao criar categoria.')
    setNome('')
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
          placeholder="Nome da nova categoria (ex: Vegano)"
          value={nome}
          onChange={e => setNome(e.target.value)}
        />
        <button type="submit" className="admin-view-btn" disabled={saving}>
          <i className="bi bi-plus-lg"></i> {saving ? 'Salvando...' : 'Adicionar'}
        </button>
      </form>
      {error && <p className="admin-error-text">{error}</p>}
      {success && <p className="admin-success-text">✓ Categoria adicionada com sucesso!</p>}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr><th>#</th><th>Nome</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={2} className="admin-empty">Nenhuma categoria encontrada.</td></tr>}
            {filtered.map(c => (
              <tr key={c.codCategoria}>
                <td className="admin-id">{c.codCategoria}</td>
                <td>{c.nomeCategoria}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function DetailModal({ item, type, onClose, navigate }) {
  if (!item) return null

  function goTo() {
    if (type === 'recipe') navigate(`/recipe/${item.id}`)
    else if (type === 'chef') navigate(`/chef/${item.id}`)
    else if (type === 'comment') navigate(`/recipe/${item.recipeId}`)
    else if (type === 'user') navigate('/profile')
    onClose()
  }

  const titles = { recipe: 'Receita', chef: 'Chefe', comment: 'Comentário', user: 'Usuário' }
  const icons  = { recipe: 'bi-book', chef: 'bi-person-badge-fill', comment: 'bi-chat-quote-fill', user: 'bi-person-circle' }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={e => e.stopPropagation()}>
        <div className="admin-modal-header">
          <span className="admin-modal-icon"><i className={`bi ${icons[type]}`}></i></span>
          <h3>{titles[type]}</h3>
          <button className="admin-modal-close" onClick={onClose}><i className="bi bi-x-lg"></i></button>
        </div>
        <div className="admin-modal-body">
          {type === 'recipe' && <>
            <div className="admin-detail-row"><span>Título</span><strong>{item.title}</strong></div>
            <div className="admin-detail-row"><span>Chefe</span><strong>{item.chef}</strong></div>
            <div className="admin-detail-row"><span>Categoria</span><strong>{item.category}</strong></div>
            <div className="admin-detail-row"><span>Status</span><StatusBadge active={item.active} /></div>
          </>}
          {type === 'chef' && <>
            <div className="admin-detail-row"><span>Nome</span><strong>{item.name}</strong></div>
            <div className="admin-detail-row"><span>E-mail</span><strong>{item.email}</strong></div>
            <div className="admin-detail-row"><span>Receitas</span><strong>{item.recipes}</strong></div>
            <div className="admin-detail-row"><span>Status</span><StatusBadge active={item.active} /></div>
          </>}
          {type === 'comment' && <>
            <div className="admin-detail-row"><span>Usuário</span><strong>{item.user}</strong></div>
            <div className="admin-detail-row"><span>Receita</span><strong>{item.recipe}</strong></div>
            <div className="admin-detail-row"><span>Nota</span>
              <span className="admin-rating">
                {Array.from({ length: 5 }, (_, i) => (
                  <i key={i} className={`bi ${i < item.rating ? 'bi-star-fill' : 'bi-star'}`}></i>
                ))}
              </span>
            </div>
            <div className="admin-detail-row comment-full"><span>Texto</span><p>{item.text}</p></div>
            <div className="admin-detail-row"><span>Status</span><StatusBadge active={item.active} /></div>
          </>}
          {type === 'user' && <>
            <div className="admin-detail-row"><span>Nome</span><strong>{item.name}</strong></div>
            <div className="admin-detail-row"><span>E-mail</span><strong>{item.email}</strong></div>
            <div className="admin-detail-row"><span>Idade</span><strong>{item.age} anos</strong></div>
            <div className="admin-detail-row"><span>Status</span><StatusBadge active={item.active} /></div>
          </>}
        </div>
        <div className="admin-modal-footer">
          <button className="admin-cancel-btn" onClick={onClose}>Fechar</button>
          <button className="admin-view-btn" onClick={goTo}>
            <i className="bi bi-box-arrow-up-right"></i> Ver no site
          </button>
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
    loadAllComments,
    toggleUserStatus,
    toggleRecipeStatus,
    toggleCommentStatus,
    logout,loadRecipes
  } = useUser()

  const [activeTab, setActiveTab] = useState('users')
  const [rawUsers, setRawUsers] = useState([])
  const [rawComments, setRawComments] = useState([])
  const [modal, setModal] = useState(null)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    async function carregarTudo() {
      setLoadingData(true)
      const [usersData] = await Promise.all([loadAllUsers(), loadCategorias()])
      const commentsData = await loadAllComments()
      setRawUsers(Array.isArray(usersData) ? usersData : [])
      setRawComments(Array.isArray(commentsData) ? commentsData : [])
      setLoadingData(false)
    }
    carregarTudo()
    loadRecipes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── normalização para o formato que os componentes esperam ──────────────
  const users = rawUsers
    .filter(u => u.funcao !== 'Chefe')
    .map(u => ({
      id: u.codUser,
      name: u.nome_completo,
      email: u.gmail,
      age: u.idade,
      active: u.status_Usuario === 'ATIVO',
    }))

  const chefs = rawUsers
    .filter(u => u.funcao === 'Chefe')
    .map(u => ({
      id: u.codUser,
      name: u.nome_completo,
      email: u.gmail,
      recipes: recipes.filter(r => r.chefId === u.codUser).length,
      active: u.status_Usuario === 'ATIVO',
    }))

  const recipesNormalized = recipes.map(r => ({
    id: r.id,
    title: r.title,
    chef: r.chef,
    chefId: r.chefId,
    category: Array.isArray(recipes.categorias)
  ? recipes.categorias.map(c => c.nomeCategoria).join(', ')
  : (recipes.category ?? 'Geral'),
    active: r.active ?? false
  }))

  const comments = rawComments.map(c => ({
    id: c.cod_comentarios,
    text: c.texto,
    user: c.usuario?.nome_completo || 'Usuário',
    userId: c.usuario?.codUser,
    recipe: c.receita?.nomeReceita || c.receita?.nome_receita || 'Receita',
    recipeId: c.receita?.codReceitas,
    rating: Number(c.nota) || 0,
    active: c.status_Comentario ? c.status_Comentario === 'ATIVO' : true,
  }))

  const stats = [
    { label: 'Usuários',    value: users.length,    active: users.filter(u => u.active).length,    icon: 'bi-people-fill',       tab: 'users' },
    { label: 'Chefes',      value: chefs.length,    active: chefs.filter(c => c.active).length,    icon: 'bi-person-badge-fill', tab: 'chefs' },
    { label: 'Receitas',    value: recipesNormalized.length,  active: recipesNormalized.filter(r => r.active).length,  icon: 'bi-journal-richtext',  tab: 'recipes' },
    { label: 'Comentários', value: comments.length, active: comments.filter(c => c.active).length, icon: 'bi-chat-dots-fill',    tab: 'comments' },
  ]

  // ── toggles ───────────────────────────────────────────────────────────────
  async function handleToggleUser(u) {
    const result = await toggleUserStatus(u.id, u.active)
    if (result.ok) {
      setRawUsers(prev => prev.map(x => x.codUser === u.id
        ? { ...x, status_Usuario: u.active ? 'INATIVO' : 'ATIVO' }
        : x))
    }
  }

  async function handleToggleRecipe(r) {
    await toggleRecipeStatus(r.id, r.active)
    await loadRecipes()
  }

  async function handleToggleComment(c) {
    const result = await toggleCommentStatus(c.id, c.active)
    if (result.ok) {
      setRawComments(prev => prev.map(x => x.cod_comentarios === c.id
        ? { ...x, status_Comentario: c.active ? 'INATIVO' : 'ATIVO' }
        : x))
    }
  }

  async function handleCreateCategoria(nome) {
    return await createCategoria(nome)
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header-left">
          <h1>Painel Administrativo</h1>
          <p>Gerencie usuários, chefes, receitas, comentários e categorias</p>
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
            {activeTab === 'users'      && <AdminUsers      data={users}     onView={u => setModal({ item: u, type: 'user' })}    onToggle={handleToggleUser} />}
            {activeTab === 'chefs'      && <AdminChefs      data={chefs}     onView={c => setModal({ item: c, type: 'chef' })}    onToggle={handleToggleUser} />}
            {activeTab === 'recipes'    && <AdminRecipes    data={recipesNormalized} onView={r => setModal({ item: r, type: 'recipe' })} onToggle={handleToggleRecipe} />}
            {activeTab === 'comments'   && <AdminComments   data={comments}  onView={c => setModal({ item: c, type: 'comment' })} onToggle={handleToggleComment} />}
            {activeTab === 'categorias' && <AdminCategorias categorias={categorias} onCreate={handleCreateCategoria} />}
          </>
        )}
      </div>

      {modal && (
        <DetailModal item={modal.item} type={modal.type} onClose={() => setModal(null)} navigate={navigate} />
      )}
    </div>
  )
}

export default AdminDashboard