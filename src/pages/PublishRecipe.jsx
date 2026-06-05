import RecipeForm from "../components/RecipeForm";
import '../styles/publishRecipe.css'

function PublishRecipe() {
  return (
    <div className="publish-page">
      <h1>Publicar Receita</h1>
      <p className="publish-subtitle">Compartilhe sua receita com a comunidade Confeitiço.</p>
      <RecipeForm />
    </div>
  );
}

export default PublishRecipe;
