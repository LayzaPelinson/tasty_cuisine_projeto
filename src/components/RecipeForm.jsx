import '../styles/publishRecipe.css'

function RecipeForm() {
  return (
    <section className="recipe-form-card">
      <h2>Formulário de Receita</h2>
      <p>Preencha os dados abaixo para publicar sua receita.</p>
      <form>
        <h3>Dados do Autor</h3>
        <div className="grid-2">
          <div>
            <label>Nome Completo:</label>
            <input type="text" placeholder="Seu nome" />
          </div>
          <div>
            <label>Especialidade do Chefe:</label>
            <input type="text" placeholder="Ex: Confeitaria Francesa" />
          </div>
        </div>

        <h3>Detalhes da Receita</h3>
        <label>Título da Receita</label>
        <input type="text" placeholder="Ex: Risotto ai Funghi Porcini" />
        <label>Descrição</label>
        <textarea rows="2" placeholder="Breve descrição da receita" />
        <div className="grid-3">
          <div>
            <label>Categoria</label>
            <select>
              <option>Almoço</option>
              <option>Jantar</option>
              <option>Sobremesas</option>
              <option>Carnes</option>
              <option>Peixes</option>
              <option>Massas</option>
              <option>Sem glúten</option>
              <option>Vegetariana</option>
            </select>
          </div>
          <div>
            <label>Dificuldade</label>
            <select>
              <option>Fácil</option>
              <option>Médio</option>
              <option>Difícil</option>
            </select>
          </div>
          <div>
            <label>Tempo de Preparo</label>
            <input type="text" placeholder="Ex: 45 min" />
          </div>
        </div>
        <label>Ingredientes</label>
        <textarea rows="5" placeholder={"Liste os ingredientes, um por linha.\nEx: 300g de arroz arbóreo"} />
        <label>Modo de Preparo</label>
        <textarea rows="5" placeholder={"Descreva o passo a passo, um por linha.\nEx: 1. Refogue a cebola na manteiga."} />
        <label>Dica do Chefe</label>
        <textarea rows="4" placeholder="Compartilhe uma dica especial para essa receita..." />
        <label>Foto da Receita</label>
        <input type="file" className="file-input" />
        <button type="submit">Publicar Receita</button>
      </form>
    </section>
  )
}

export default RecipeForm
