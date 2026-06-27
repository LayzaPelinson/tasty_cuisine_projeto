import { useState, useEffect } from 'react'
import { useUser } from '../hooks/useUser'
import RecipeCard from './RecipeCard'
import '../styles/favoriteRecipes.css'
import '../styles/publishRecipe.css'
import '../styles/recipesSection.css'
import '../styles/login.css'

const API_BASE = 'http://localhost:8080';
function EditModal({ recipe, onSave, onClose }) {
  // Função interna para realizar o parse seguro de strings JSON vindas do Spring Boot
  const parseList = (value) => {
    if (!value) return []
    if (Array.isArray(value)) return value
    try { return JSON.parse(value) } catch { return [] }
  }

  const UNITS = ['unidades', 'gramas', 'kg', 'ml', 'litros', 'xícaras', 'colheres', 'fatias', 'dentes', 'pitadas', 'a gosto']
  const API_BASE = 'http://localhost:8080'
  
  const [categoriesFromDb, setCategoriesFromDb] = useState([])
  
  // 1. MAPEAMENTO SEGURO DAS CATEGORIAS (Varre as estruturas para manter selecionado)
  const [selectedCategories, setSelectedCategories] = useState(() => {
    const catData = recipe.categoria || recipe.categorias || recipe.category || []
    const cats = Array.isArray(catData) ? catData : [catData]
    return cats.map(c => {
      if (typeof c === 'object' && c !== null) return c.id || c.codCategoria
      return c
    }).filter(Boolean)
  })

  // 2. MAPEAMENTO DOS CAMPOS DE TEXTO E IMAGEM
  const [form, setForm] = useState({
    title: recipe.nomeReceita || recipe.title || '',
    description: recipe.descricao || recipe.description || '',
    difficulty: recipe.dificuldade || recipe.difficulty || 'Fácil',
    image: recipe.fotoReceita || recipe.foto_receita || recipe.image || '',
  })

  // 3. MAPEAMENTO DOS INGREDIENTES (Trata se vier como Array de String ou Array Real)
  const [ingredients, setIngredients] = useState(() => {
    let rawIng = recipe.ingredientes || recipe.ingredients || recipe.itens || '[]'
    if (Array.isArray(rawIng) && rawIng.length === 1 && typeof rawIng[0] === 'string') {
      rawIng = rawIng[0]
    }
    if (typeof rawIng === 'string') {
      return parseList(rawIng)
    }
    if (Array.isArray(rawIng)) {
      return rawIng.map(ing => ({
        quantidade: ing.quantidade ?? ing.qtd ?? ing.qtdIngrediente ?? '',
        unidade: ing.unidade ?? ing.uniMedida ?? 'gramas',
        nome: ing.nome ?? ing.nomeIngrediente ?? ''
      }))
    }
    return []
  })
  
  const [ingInput, setIngInput] = useState({ quantidade: '', unidade: 'gramas', nome: '' })
  
  // 4. MAPEAMENTO DO MODO DE PREPARO
  const [steps, setSteps] = useState(() => {
    let rawSteps = recipe.modo_preparo || recipe.modoPreparo || recipe.instructions || '[]'
    if (Array.isArray(rawSteps) && rawSteps.length === 1 && typeof rawSteps[0] === 'string') {
      rawSteps = rawSteps[0]
    }
    if (typeof rawSteps === 'string') {
      return parseList(rawSteps)
    }
    return Array.isArray(rawSteps) ? rawSteps : []
  })
  
  const [stepInput, setStepInput] = useState('')
  const [error, setError] = useState(null)

  // 5. CARREGA AS CATEGORIAS DO BANCO
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch(`${API_BASE}/categoria/findAll`)
        if (res.ok) {
          const data = await res.json()
          setCategoriesFromDb(data)
        }
      } catch (err) {
        console.error("Erro ao carregar categorias no modal:", err)
      }
    }
    loadCategories()
  }, [])

  // 6. CONTROLADORES DE EVENTOS
  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleCategoryChange(idCategoria) {
    setSelectedCategories(prev =>
      prev.includes(idCategoria)
        ? prev.filter(id => id !== idCategoria)
        : [...prev, idCategoria]
    )
  }

  function addIngredient() {
    if (!ingInput.quantidade.trim() || !ingInput.nome.trim()) return
    setIngredients(prev => [...prev, { ...ingInput }])
    setIngInput({ quantidade: '', unidade: 'gramas', nome: '' })
  }

  function removeIngredient(i) {
    setIngredients(prev => prev.filter((_, idx) => idx !== i))
  }

  function addStep() {
    if (!stepInput.trim()) return
    setSteps(prev => [...prev, stepInput.trim()])
    setStepInput('')
  }

  function removeStep(i) {
    setSteps(prev => prev.filter((_, idx) => idx !== i))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    
    if (ingredients.length === 0) return setError('Adicione au menos um ingrediente.')
    if (steps.length === 0) return setError('Adicione ao menos um passo no modo de preparo.')
    if (selectedCategories.length === 0) return setError('Selecione ao menos uma categoria.')

    const updatedRecipe = {
      ...recipe,
      nomeReceita: form.title,
      descricao: form.description,
      dificuldade: form.difficulty,
      fotoReceita: form.image,
      ingredientes: JSON.stringify(ingredients),
      modo_preparo: JSON.stringify(steps),
      categoria: selectedCategories.map(id => ({ codCategoria: id }))
    }

    onSave(updatedRecipe)
  }

  return (
    <div className="reactivate-overlay" style={{ overflowY: 'auto', padding: '30px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
      <div className="reactivate-modal publish-recipe-container" style={{ maxWidth: '700px', width: '92%', margin: '20px auto', textAlign: 'left', background: '#fff', padding: '30px', borderRadius: '16px' }}>
        
        <div className="publish-page-header" style={{ marginBottom: '25px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
          <h2 style={{ margin: 0, fontSize: '24px', color: '#333' }}>Editar Receita</h2>
          <p className="publish-subtitle" style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>Modifique os dados necessários da sua publicação.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* TÍTULO */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Título da Receita</label>
            <input className="form-title" name="title" value={form.title} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} required />
          </div>

          {/* DESCRIÇÃO */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Descrição</label>
            <textarea name="description" className="form-description" rows="3" value={form.description} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', resize: 'vertical', fontFamily: 'inherit' }} required />
          </div>

          {/* DIFICULDADE */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Dificuldade</label>
            <select name="difficulty" value={form.difficulty} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}>
              <option value="Fácil">Fácil</option>
              <option value="Médio">Médio</option>
              <option value="Difícil">Difícil</option>
            </select>
          </div>

          {/* CATEGORIAS */}
          <h3 style={{ fontSize: '18px', borderBottom: '1px solid #eee', paddingBottom: '8px', marginTop: '25px' }}>Categorias</h3>
          <div className="categories-checkbox-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', margin: '15px 0 25px 0' }}>
            {categoriesFromDb.length === 0 ? (
              <p style={{ fontSize: '14px', color: '#888' }}>Carregando categorias...</p>
            ) : (
              categoriesFromDb.map(c => {
                const idCat = c.id || c.codCategoria;
                const nomeCat = c.nome || c.nomeCategoria;
                return (
                  <label key={idCat} className="category-checkbox" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedCategories.includes(idCat)}
                      onChange={() => handleCategoryChange(idCat)}
                    />
                    <span className="checkbox-text">{nomeCat}</span>
                  </label>
                )
              })
            )}
          </div>

          {/* INGREDIENTES */}
          <h3 style={{ fontSize: '18px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Ingredientes</h3>
          <div className="ingredient-inputs" style={{ display: 'flex', gap: '10px', alignItems: 'center', margin: '15px 0 10px 0' }}>
            <input
              style={{ width: '80px', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
              placeholder="Qtd"
              value={ingInput.quantidade}
              onChange={e => setIngInput(f => ({ ...f, quantidade: e.target.value }))}
            />
            <select 
              style={{ width: '130px', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', height: '45px' }}
              value={ingInput.unidade} 
              onChange={e => setIngInput(f => ({ ...f, unidade: e.target.value }))}
            >
              {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            <input
              style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
              placeholder="Ingrediente (ex: Ovos)"
              value={ingInput.nome}
              onChange={e => setIngInput(f => ({ ...f, nome: e.target.value }))}
            />
            <button type="button" className="add-btn" style={{ padding: '12px 18px', height: '45px' }} onClick={addIngredient}>+ Adicionar</button>
          </div>

          {ingredients.length > 0 && (
            <ul className="items-list" style={{ listStyle: 'none', padding: '5px 10px', background: '#f8f9fa', borderRadius: '8px', marginBottom: '25px' }}>
              {ingredients.map((ing, i) => (
                <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i !== ingredients.length - 1 ? '1px solid #eee' : 'none', fontSize: '14px' }}>
                  <span><strong>{ing.quantidade} {ing.unidade}</strong> — {ing.nome}</span>
                  <button type="button" style={{ background: 'transparent', border: 'none', color: '#e53e3e', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', padding: '0 5px' }} onClick={() => removeIngredient(i)}>✕</button>
                </li>
              ))}
            </ul>
          )}

          {/* MODO DE PREPARO */}
          <h3 style={{ fontSize: '18px', borderBottom: '1px solid #eee', paddingBottom: '8px', marginTop: '25px' }}>Modo de Preparo</h3>
          <div className="step-inputs" style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', margin: '15px 0 10px 0' }}>
            <textarea
              rows="2"
              style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', resize: 'vertical', fontFamily: 'inherit' }}
              placeholder="Descreva um passo do preparo..."
              value={stepInput}
              onChange={e => setStepInput(e.target.value)}
            />
            <button type="button" className="add-btn" style={{ padding: '12px 18px', height: '45px', whiteSpace: 'nowrap' }} onClick={addStep}>+ Passo</button>
          </div>

          {steps.length > 0 && (
            <ol className="items-list" style={{ padding: '5px 10px 5px 25px', background: '#f8f9fa', borderRadius: '8px', marginBottom: '25px' }}>
              {steps.map((step, i) => (
                <li key={i} style={{ padding: '8px 0', borderBottom: i !== steps.length - 1 ? '1px solid #eee' : 'none', fontSize: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ flex: 1 }}>{step}</span>
                    <button type="button" style={{ background: 'transparent', border: 'none', color: '#e53e3e', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }} onClick={() => removeStep(i)}>✕</button>
                  </div>
                </li>
              ))}
            </ol>
          )}

          {/* FOTO DA RECEITA */}
          <h3 style={{ fontSize: '18px', borderBottom: '1px solid #eee', paddingBottom: '8px', marginTop: '25px' }}>Foto da Receita</h3>
          <div style={{ marginBottom: '20px', marginTop: '15px' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>URL da imagem</label>
            <input className='form-url' name="image" value={form.image} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} placeholder="https://exemplo.com/foto.jpg" />
          </div>

          {error && <p className="error-text" style={{ color: '#e53e3e', marginTop: '15px', fontWeight: '500' }}>{error}</p>}

          {/* BOTÕES INFERIORES */}
          <div className="reactivate-actions" style={{ marginTop: '30px', display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <button type="submit" className="login-btn" style={{ margin: 0, padding: '12px 24px', borderRadius: '8px', fontWeight: '600' }}>Salvar Alterações</button>
            <button type="button" onClick={onClose} style={{ padding: '12px 24px', background: '#e2e8f0', color: '#4a5568', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ChefMyRecipes() {
  // 2. Pegamos a nova função que criamos no hook
  const { user, chefRecipes, deleteRecipe, editRecipe, loadChefRecipes, toggleRecipeStatus } = useUser()

  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [deleteError, setDeleteError] = useState('')

  // 3. Disparamos a busca automaticamente quando o componente inicia ou o usuário muda
  useEffect(() => {
    if (user?.id) {
      loadChefRecipes(user.id);
    }
  }, [user?.id]);

  async function handleDelete() {
    setDeleteError('')

    // Como o card usa os dados normalizados, passamos confirmDelete.id
    // E passamos 'true' para o segundo parâmetro (currentlyActive), pois se estamos deletando, ela está ativa e queremos INATIVAR.
    const res = await toggleRecipeStatus(confirmDelete.id, true)

    if (res.ok) {
      setConfirmDelete(null)
      // Recarrega a lista do banco. Como a receita agora está INATIVA, o filtro do back/front vai ignorá-la e ela some da tela!
      loadChefRecipes(user.id);
    } else {
      setDeleteError('Falha ao excluir a receita. Tente novamente.')
    }
  }

  return (
    <section className="favorite-recipes">
      <h2>Minhas Receitas</h2>
      {chefRecipes.length === 0 ? (
        <p className="no-favorites">Você ainda não publicou nenhuma receita.</p>
      ) : (
        <div className="recipes-grid">
          {chefRecipes.map(recipe => (
            <RecipeCard
              key={recipe.id} // Usando a chave correta da API
              recipe={recipe}
              actions={<>
                <button className="btn-edit" onClick={() => setEditing(recipe)}>Editar</button>
                <button className="btn-delete" onClick={() => { setConfirmDelete(recipe); setDeleteError('') }}>Excluir</button>
              </>}
            />
          ))}
        </div>
      )}

      {editing && (
        <EditModal
          recipe={editing}
          // Ajustado para passar o codReceitas correto no salvamento
          onSave={(updated) => { editRecipe(editing.codReceitas, updated); setEditing(null) }}
          onClose={() => setEditing(null)}
        />
      )}

      {confirmDelete && (
        <div className="reactivate-overlay">
          <div className="reactivate-modal">
            <h3>Excluir Receita</h3>
            <p>Tem certeza que deseja excluir <strong>{confirmDelete.nomeReceita}</strong>? Esta ação não pode ser desfeita.</p>
            {deleteError && <p className="login-error">{deleteError}</p>}
            <div className="reactivate-actions">
              <button className="login-btn" style={{ background: '#e53e3e' }} onClick={handleDelete}>Excluir</button>
              <button onClick={() => setConfirmDelete(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default ChefMyRecipes