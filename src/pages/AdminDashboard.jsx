import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/admin.css'

const API_BASE = 'http://localhost:8080'

const MOCK_USERS = [
  { id: 1, name: 'Ana Clara', email: 'ana@email.com', age: 25, active: true },
  { id: 2, name: 'Bruno Silva', email: 'bruno@email.com', age: 30, active: true },
  { id: 3, name: 'Carla Souza', email: 'carla@email.com', age: 22, active: false },
]
const MOCK_CHEFS = [
  { id: 1, name: 'Marie Laurent', email: 'marie@email.com', recipes: 24, active: true },
  { id: 2, name: 'Marco Bianchi', email: 'marco@email.com', recipes: 31, active: true },
  { id: 3, name: 'Sofia Romano', email: 'sofia@email.com', recipes: 18, active: false },
  { id: 4, name: 'Pierre Dubois', email: 'pierre@email.com', recipes: 15, active: true },
]
const MOCK_RECIPES = [
  { id: 1, title: 'Ratatouille', chef: 'Marie Laurent', chefId: 1, category: 'Jantar', active: true },
  { id: 2, title: 'Frango Grelhado', chef: 'Marie Laurent', chefId: 1, category: 'Almoço', active: true },
  { id: 3, title: 'Mousse de Chocolate', chef: 'Pierre Dubois', chefId: 4, category: 'Sobremesas', active: false },
  { id: 4, title: 'Picanha Assada', chef: 'Marco Bianchi', chefId: 2, category: 'Carnes', active: true },
  { id: 5, title: 'Salmão ao Limão', chef: 'Sofia Romano', chefId: 3, category: 'Peixes', active: true },
]
const MOCK_COMMENTS = [
  { id: 1, text: 'Receita incrível, fiz em casa e ficou perfeito!', user: 'Ana Clara', userId: 1, recipe: 'Ratatouille', recipeId: 1, rating: 5, active: true },
  { id: 2, text: 'Muito bom mas achei o tempero forte demais.', user: 'Bruno Silva', userId: 2, recipe: 'Frango Grelhado', recipeId: 2, rating: 3, active: true },
  { id: 3, text: 'Péssima receita, não recomendo.', user: 'Carla Souza', userId: 3, recipe: 'Picanha Assada', recipeId: 4, rating: 1, active: false },
]

const TABS = [
  { key: 'users', label: 'Usuários', icon: 'bi-people-fill' },
  { key: 'chefs', label: 'Chefes', icon: 'bi-person-badge-fill' },
  { key: 'recipes', label: 'Receitas', icon: 'bi-journal-richtext' },
  { key: 'comments', label: 'Comentários', icon: 'bi-chat-dots-fill' },
]

function StatusBadge({ active }) {
  return (
    <span className={`admin-badge ${active ? 'admin-badge-active' : 'admin-badge-inactive'}`}>
      <i className={`bi ${active ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}`}></i>
      {active ? 'Ativo' : 'Inativo'}
    </span>
  )
}

function ToggleBtn({ active, onToggle }) {
  return (
    <button
      className={`admin-toggle-btn ${active ? 'admin-toggle-deactivate' : 'admin-toggle-activate'}`}
      onClick={onToggle}
      title={active ? 'Desativar' : 'Reativar'}
    >
      <i className={`bi ${active ? 'bi-slash-circle' : 'bi-arrow-counterclockwise'}`}></i>
      {active ? 'Desativar' : 'Reativar'}
    </button>
  )
}

function AdminUsers({ data, setData, onViewProfile }) {
  const [search, setSearch] = useState('')
  const filtered = data.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2><i className="bi bi-people-fill"></i> Usuários Gerais</h2>
        <div className="admin-search">
          <i className="bi bi-search"></i>
          <input placeholder="Buscar usuário..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Idade</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="admin-empty">Nenhum usuário encontrado.</td></tr>
            )}
            {filtered.map(u => (
              <tr key={u.id}>
                <td className="admin-id">{u.id}</td>
                <td>
                  <button className="admin-link-btn" onClick={() => onViewProfile(u)}>
                    <i className="bi bi-person-circle"></i> {u.name}
                  </button>
                </td>
                <td>{u.email}</td>
                <td>{u.age} anos</td>
                <td><StatusBadge active={u.active} /></td>
                <td>
                  <ToggleBtn active={u.active} onToggle={() =>
                    setData(prev => prev.map(x => x.id === u.id ? { ...x, active: !x.active } : x))
                  } />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AdminChefs({ data, setData, onViewChef }) {
  const [search, setSearch] = useState('')
  const filtered = data.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2><i className="bi bi-person-badge-fill"></i> Chefes</h2>
        <div className="admin-search">
          <i className="bi bi-search"></i>
          <input placeholder="Buscar chefe..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Receitas</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="admin-empty">Nenhum chefe encontrado.</td></tr>
            )}
            {filtered.map(c => (
              <tr key={c.id}>
                <td className="admin-id">{c.id}</td>
                <td>
                  <button className="admin-link-btn" onClick={() => onViewChef(c)}>
                    <i className="bi bi-person-badge"></i> {c.name}
                  </button>
                </td>
                <td>{c.email}</td>
                <td><span className="admin-count"><i className="bi bi-journal-richtext"></i> {c.recipes}</span></td>
                <td><StatusBadge active={c.active} /></td>
                <td>
                  <ToggleBtn active={c.active} onToggle={() =>
                    setData(prev => prev.map(x => x.id === c.id ? { ...x, active: !x.active } : x))
                  } />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AdminRecipes({ data, setData, onViewRecipe }) {
  const [search, setSearch] = useState('')
  const filtered = data.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.chef.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2><i className="bi bi-journal-richtext"></i> Receitas</h2>
        <div className="admin-search">
          <i className="bi bi-search"></i>
          <input placeholder="Buscar receita ou chefe..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Título</th>
              <th>Chefe</th>
              <th>Categoria</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="admin-empty">Nenhuma receita encontrada.</td></tr>
            )}
            {filtered.map(r => (
              <tr key={r.id}>
                <td className="admin-id">{r.id}</td>
                <td>
                  <button className="admin-link-btn" onClick={() => onViewRecipe(r)}>
                    <i className="bi bi-book"></i> {r.title}
                  </button>
                </td>
                <td>{r.chef}</td>
                <td><span className="admin-category">{r.category}</span></td>
                <td><StatusBadge active={r.active} /></td>
                <td>
                  <ToggleBtn active={r.active} onToggle={() =>
                    setData(prev => prev.map(x => x.id === r.id ? { ...x, active: !x.active } : x))
                  } />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AdminComments({ data, setData, onViewComment }) {
  const [search, setSearch] = useState('')
  const filtered = data.filter(c =>
    c.text.toLowerCase().includes(search.toLowerCase()) ||
    c.user.toLowerCase().includes(search.toLowerCase()) ||
    c.recipe.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2><i className="bi bi-chat-dots-fill"></i> Comentários</h2>
        <div className="admin-search">
          <i className="bi bi-search"></i>
          <input placeholder="Buscar comentário, usuário ou receita..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Comentário</th>
              <th>Usuário</th>
              <th>Receita</th>
              <th>Nota</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="admin-empty">Nenhum comentário encontrado.</td></tr>
            )}
            {filtered.map(c => (
              <tr key={c.id}>
                <td className="admin-id">{c.id}</td>
                <td>
                  <button className="admin-link-btn comment-text-btn" onClick={() => onViewComment(c)}>
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
                  <ToggleBtn active={c.active} onToggle={() =>
                    setData(prev => prev.map(x => x.id === c.id ? { ...x, active: !x.active } : x))
                  } />
                </td>
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
    else if (type === 'user') navigate(`/profile`)
    onClose()
  }

  const titles = { recipe: 'Receita', chef: 'Chefe', comment: 'Comentário', user: 'Usuário' }
  const icons = { recipe: 'bi-book', chef: 'bi-person-badge-fill', comment: 'bi-chat-quote-fill', user: 'bi-person-circle' }

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
            <div className="admin-detail-row comment-full"><span>Comentário</span><p>{item.text}</p></div>
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
          <button className="admin-view-btn" onClick={goTo}>
            <i className="bi bi-box-arrow-up-right"></i> Ver no site
          </button>
          <button className="admin-cancel-btn" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  )
}

function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState(MOCK_USERS)
  const [chefs, setChefs] = useState(MOCK_CHEFS)
  const [recipes, setRecipes] = useState(MOCK_RECIPES)
  const [comments, setComments] = useState(MOCK_COMMENTS)
  const [modal, setModal] = useState(null)

  const stats = [
    { label: 'Usuários', value: users.length, active: users.filter(u => u.active).length, icon: 'bi-people-fill', tab: 'users' },
    { label: 'Chefes', value: chefs.length, active: chefs.filter(c => c.active).length, icon: 'bi-person-badge-fill', tab: 'chefs' },
    { label: 'Receitas', value: recipes.length, active: recipes.filter(r => r.active).length, icon: 'bi-journal-richtext', tab: 'recipes' },
    { label: 'Comentários', value: comments.length, active: comments.filter(c => c.active).length, icon: 'bi-chat-dots-fill', tab: 'comments' },
  ]

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <i className="bi bi-shield-lock-fill"></i>
          <span>Painel Admin</span>
        </div>
        <nav className="admin-nav">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`admin-nav-item ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <i className={`bi ${tab.icon}`}></i>
              {tab.label}
            </button>
          ))}
        </nav>
        <button className="admin-exit-btn" onClick={() => navigate('/login')}>
          <i className="bi bi-box-arrow-left"></i> Sair
        </button>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div>
            <h1>Painel Administrativo</h1>
            <p>Gerencie usuários, chefes, receitas e comentários</p>
          </div>
          <div className="admin-header-badge">
            <i className="bi bi-shield-fill-check"></i> Administrador
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

        <div className="admin-content">
          {activeTab === 'users' && <AdminUsers data={users} setData={setUsers} onViewProfile={u => setModal({ item: u, type: 'user' })} />}
          {activeTab === 'chefs' && <AdminChefs data={chefs} setData={setChefs} onViewChef={c => setModal({ item: c, type: 'chef' })} />}
          {activeTab === 'recipes' && <AdminRecipes data={recipes} setData={setRecipes} onViewRecipe={r => setModal({ item: r, type: 'recipe' })} />}
          {activeTab === 'comments' && <AdminComments data={comments} setData={setComments} onViewComment={c => setModal({ item: c, type: 'comment' })} />}
        </div>
      </div>

      {modal && (
        <DetailModal
          item={modal.item}
          type={modal.type}
          onClose={() => setModal(null)}
          navigate={navigate}
        />
      )}
    </div>
  )
}

export default AdminDashboard
