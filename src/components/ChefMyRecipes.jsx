import { useState, useEffect } from 'react'
import { useUser } from '../hooks/useUser'
import RecipeCard from './RecipeCard'
import '../styles/favoriteRecipes.css'
import '../styles/publishRecipe.css'
import '../styles/recipesSection.css'
import '../styles/login.css'

const UNITS = ['unidades', 'gramas', 'kg', 'ml', 'litros', 'xícaras', 'colheres', 'fatias', 'dentes', 'pitadas', 'a gosto']
const DIFFICULTIES = ['Fácil', 'Médio', 'Difícil']
const API_BASE = 'http://localhost:8080'


function EditModal({ recipe, onSave, onClose }) {
  // 1. Estados locais do formulário baseados na receita selecionada
  const [form, setForm] = useState({
    title: recipe.title || '',
    description: recipe.description || '',
    difficulty: recipe.difficulty || 'Fácil',
    image: recipe.image || '',
  })
console.log("RECEITA RECEBIDA NO MODAL:", recipe);
  // Garantimos que carregamos os arrays já existentes ou um array vazio
  const [ingredients, setIngredients] = useState(() => {
    if (!recipe.ingredients) return [];

    if (Array.isArray(recipe.ingredients)) {
      // Mapeia os ingredientes garantindo que se já forem objetos estruturados, 
      // eles mantenham a estrutura completa para o formulário interativo ler!
      return recipe.ingredients.map(ing => {
        if (typeof ing === 'object' && ing !== null) {
          return {
            quantidade: ing.quantidade || '',
            unidade: ing.unidade || 'gramas',
            nome: ing.nome || ing.nomeIngredient || ''
          };
        }
        // Se por acaso ainda vier alguma string pura antiga perdida no meio
        return ing;
      });
    }
    return [];
  });
  const [ingInput, setIngInput] = useState({ quantidade: '', unidade: 'gramas', nome: '' })

  const [steps, setSteps] = useState(Array.isArray(recipe.instructions) ? recipe.instructions : [])
  const [stepInput, setStepInput] = useState('')

  // Estados para gerenciar as categorias do back-end
  const [categoriesFromDb, setCategoriesFromDb] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [error, setError] = useState(null)

  // 2. Carrega as categorias do banco e marca as que a receita já possui
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch(`${API_BASE}/categoria/findAll`)
        if (res.ok) {
          const data = await res.json()
          setCategoriesFromDb(data)

          // Pré-seleciona as categorias atuais desta receita
          if (recipe.category) {
            const currentCats = Array.isArray(recipe.category) ? recipe.category : [recipe.category]
            const currentIds = currentCats.map(c => c.id || c.codCategoria).filter(Boolean)
            setSelectedCategories(currentIds)
          }
        }
      } catch (err) {
        console.error("Erro ao carregar categorias no modal de edição:", err)
      }
    }
    loadCategories()
  }, [recipe])

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  // Manipulação de Checkboxes de Categoria
  function handleCategoryChange(idCategoria) {
    setSelectedCategories(prev =>
      prev.includes(idCategoria)
        ? prev.filter(id => id !== idCategoria)
        : [...prev, idCategoria]
    )
  }

  // Funções de Gerenciamento de Ingredientes
  function addIngredient() {
    if (!ingInput.quantidade.trim() || !ingInput.nome.trim()) return
    setIngredients(prev => [...prev, { ...ingInput }])
    setIngInput({ quantidade: '', unidade: 'gramas', nome: '' })
  }

  function removeIngredient(i) {
    setIngredients(prev => prev.filter((_, idx) => idx !== i))
  }

  // Funções de Gerenciamento do Modo de Preparo
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

    if (ingredients.length === 0) return setError('Adicione ao menos um ingrediente.')
    if (steps.length === 0) return setError('Adicione ao menos um passo no modo de preparo.')
    if (selectedCategories.length === 0) return setError('Selecione ao menos uma categoria.')

    // Retorna a estrutura normalizada idêntica à do publishRecipe
    onSave({
      title: form.title,
      description: form.description,
      difficulty: form.difficulty,
      image: form.image,
      ingredients,
      instructions: steps,
      categorias: selectedCategories,
    })
  }

  return (
    <div className="guest-overlay" onClick={onClose}>
      <div className="edit-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', maxHeight: '85vh', overflowY: 'auto' }}>
        <h2>Editar Receita</h2>
        <form onSubmit={handleSubmit}>

          <label>Título da Receita</label>
          <input name="title" value={form.title} onChange={handleChange} required />

          <label>Descrição</label>
          <textarea name="description" rows="2" value={form.description} onChange={handleChange} required />

          <div className="grid-2">
            <div>
              <label>Dificuldade</label>
              <select name="difficulty" value={form.difficulty} onChange={handleChange}>
                {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Categorias Dinâmicas vindas do Back-end */}
          <h3>Categorias</h3>
          <div className="categories-checkbox-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', margin: '10px 0' }}>
            {categoriesFromDb.length === 0 ? (
              <p style={{ fontSize: '14px', color: '#888' }}>Carregando categorias...</p>
            ) : (
              categoriesFromDb.map(c => {
                const idCat = c.id || c.codCategoria;
                const nomeCat = c.nome || c.nomeCategoria;

                return (
                  <label key={idCat} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(idCat)}
                      onChange={() => handleCategoryChange(idCat)}
                    />
                    {nomeCat}
                  </label>
                )
              })
            )}
          </div>

          {/* Gerenciador Interativo de Ingredientes */}
          <h3>Ingredientes</h3>
          <div className="ingredient-inputs" style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
            <input
              style={{ width: '30%' }}
              placeholder="Qtd (ex: 3)"
              value={ingInput.quantidade}
              onChange={e => setIngInput(f => ({ ...f, quantidade: e.target.value }))}
            />
            <select value={ingInput.unidade} onChange={e => setIngInput(f => ({ ...f, unidade: e.target.value }))}>
              {UNITS.map(u => <option key={u}>{u}</option>)}
            </select>
            <input
              placeholder="Ingrediente"
              value={ingInput.nome}
              onChange={e => setIngInput(f => ({ ...f, nome: e.target.value }))}
            />
            <button type="button" className="add-btn" onClick={addIngredient}>+</button>
          </div>

          {ingredients.length > 0 && (
            <ul className="items-list" style={{ listStyle: 'none', padding: 0, marginBottom: '15px' }}>
              {ingredients.map((ing, i) => {
                // Se 'ing' for uma string simples (formato antigo da API)
                if (typeof ing === 'string') {
                  return (
                    <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                      <span>{ing}</span>
                      <button type="button" style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer' }} onClick={() => removeIngredient(i)}>✕</button>
                    </li>
                  )
                }

                // Se 'ing' for um objeto estruturado (formato novo do formulário)
                return (
                  <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                    <span>
                      {ing.quantidade ? `${ing.quantidade} ` : ''}
                      {ing.unidade && ing.unidade !== 'unidades' ? `${ing.unidade} de ` : ''}
                      {ing.nome || ''}
                    </span>
                    <button type="button" style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer' }} onClick={() => removeIngredient(i)}>✕</button>
                  </li>
                )
              })}
            </ul>
          )}

          {/* Gerenciador Interativo de Passos */}
          <h3>Modo de Preparo</h3>
          <div className="step-inputs" style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '10px' }}>
            <textarea
              rows="2"
              placeholder="Descreva um passo do preparo..."
              value={stepInput}
              onChange={e => setStepInput(e.target.value)}
            />
            <button type="button" className="add-btn" onClick={addStep}>+ Adicionar Passo</button>
          </div>

          {steps.length > 0 && (
            <ol className="items-list" style={{ paddingLeft: '20px', marginBottom: '15px' }}>
              {steps.map((step, i) => (
                <li key={i} style={{ padding: '4px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{step}</span>
                    <button type="button" style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer' }} onClick={() => removeStep(i)}>✕</button>
                  </div>
                </li>
              ))}
            </ol>
          )}

          <h3>Foto da Receita</h3>
          <label>URL da imagem</label>
          <input name="image" value={form.image} onChange={handleChange} placeholder="https://exemplo.com/foto.jpg" />

          {error && <p className="error-text" style={{ color: '#e53e3e', fontSize: '14px', marginTop: '10px' }}>{error}</p>}

          <div className="edit-modal-actions" style={{ marginTop: '20px' }}>
            <button type="submit" className="btn-save">Salvar Alterações</button>
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}


function ChefMyRecipes() {
  // 2. Pegamos a nova função que criamos no hook
  const { user, chefRecipes, deleteRecipe, editRecipe, loadChefRecipes } = useUser()

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
    const res = await deleteRecipe(confirmDelete.codReceitas)
    if (res.ok) {
      setConfirmDelete(null)
      // 4. Se deletou com sucesso, recarrega a lista para sumir da tela!
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