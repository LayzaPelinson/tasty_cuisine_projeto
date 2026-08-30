import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useUser } from '../hooks/useUser.jsx'
import { useFavorites } from '../hooks/useFavorites.jsx'
import { FiArrowLeft, FiHeart, FiShare2, FiUser } from 'react-icons/fi'
import RecipeComments from '../components/RecipeComments'
import '../styles/recipeDetails.css'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=75'
const API_BASE = 'http://localhost:8080';

function parseList(value) {
  if (!value) return []
  if (Array.isArray(value)) return value
  try { return JSON.parse(value) } catch { return [] }
}

function RecipeDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, favoritos, toggleFavorito } = useUser()
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  const { addToHistory } = useFavorites()

  useEffect(() => {
    // Busca a receita específica pelo ID direto no banco
    fetch(`${API_BASE}/receita/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        setRecipe(data);
        setLoading(false);
      })
      .catch(() => {
        setRecipe(null);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <h1 className="loading-text">Carregando receita...</h1>;
  if (!recipe) return <h1 className="error-text">Receita não encontrada.</h1>;

  // 💡 MAPEAMENTO DE SEGURANÇA (Para alinhar com os nomes vindos do Spring Boot)
  const idSeguro = recipe.codReceitas || recipe.id;
  const tituloSeguro = recipe.nomeReceita || recipe.title || 'Receita sem título';
  const descricaoSegura = recipe.descricao || recipe.description || 'Sem descrição disponível.';
  const imagemSegura = recipe.fotoReceita || recipe.image || PLACEHOLDER;
  const dificuldadeSegura = recipe.dificuldade || recipe.difficulty || 'Médio';

  // Trata categoria vindo como objeto único ou array
  let categoriaSegura = 'Geral';
  if (recipe.categoria) {
    categoriaSegura = Array.isArray(recipe.categoria)
      ? (recipe.categoria[0]?.nomeCategoria || 'Geral')
      : (recipe.categoria.nomeCategoria || 'Geral');
  }

  // Nome do Chef dono da receita
  const chefSeguro = recipe.usuario?.nome_completo || recipe.usuario?.nome_de_usuario || 'Anônimo';

  // Processamento seguro das listas
  const rawIngredientes = recipe.ingredientes || recipe.itens || [];
  const listaIngredientes = typeof rawIngredientes === 'string'
    ? parseList(rawIngredientes)
    : (Array.isArray(rawIngredientes) ? rawIngredientes : []);

  // Se o modo de preparo vier como String JSON do banco, faz o parse, senão lê a string direta
  const rawModoPreparo = recipe.modo_preparo || recipe.modoPreparo || recipe.instructions || '';
const instructions = typeof rawModoPreparo === 'string'
  ? parseList(rawModoPreparo)
  : (Array.isArray(rawModoPreparo) ? rawModoPreparo : []);

  const isFavorited = favoritos.some(f => String(f.receita?.codReceitas) === String(idSeguro));
  const isChef = user?.funcao?.toLowerCase() === 'chefe';

  async function handleShare() {
    const data = { title: tituloSeguro, text: descricaoSegura, url: window.location.href }
    if (navigator.share) {
      await navigator.share(data)
    } else {
      await navigator.clipboard.writeText(window.location.href)
      alert('Link copiado para a área de transferência!')
    }
  }

  return (
    <section className="recipe-details">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FiArrowLeft /> Voltar
      </button>

      <div className="recipe-header">
        <img src={imagemSegura} alt={tituloSeguro} />

        <div className="recipe-details-info">
          <h1>{tituloSeguro}</h1>

          <div className="recipe-tags">
            <span className="tag">{categoriaSegura}</span>
          </div>

          <div className="recipe-meta">
            <span><FiUser /> Por: {chefSeguro}</span>
          </div>

          <p className="recipe-description">{descricaoSegura}</p>

          {!isChef && user && (
            <div className="recipe-actions">
              <button
                className={`save-btn${isFavorited ? ' saved' : ''}`}
                onClick={() => toggleFavorito(idSeguro)}
              >
                <FiHeart /> {isFavorited ? 'Favoritada' : 'Favoritar Receita'}
              </button>
              <button className="share-btn" onClick={handleShare}>
                <FiShare2 /> Compartilhar
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="recipe-details-content">
        <div className="ingredients">
          <h2>Ingredientes</h2>
          <ul>
            {listaIngredientes.map((item, index) => (
              <li key={index}>
                {typeof item === 'object' && item !== null
                  ? `${item.quantidade ?? item.qtdIngrediente ?? ''} ${item.unidade ?? item.uniMedida ?? ''} — ${item.nome ?? item.nomeIngrediente ?? ''}`
                  : item}
              </li>
            ))}
          </ul>
        </div>

        <div className="instructions">
          <h2>Modo de Preparo</h2>
          <ol>
            {instructions.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      </div>

      <RecipeComments recipeId={idSeguro} isUsuario={!isChef && !!user} />
    </section>
  )
}

export default RecipeDetails;