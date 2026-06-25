import RecipeForm from "../components/RecipeForm";
import '../styles/publishRecipe.css'

function PublishRecipe() {
  return (
    <div className="publish-page">
      <div className="publish-page-header">
        <h1>Publicar Receita</h1>
        <p className="publish-subtitle">Compartilhe sua receita com a comunidade TastyCuisine.</p>
      </div>
      <div className="publish-page-body">
        <RecipeForm />
      </div>
    </div>
  );
}

export default PublishRecipe;
