function ChefCard({ chef }) {

  return (
    <div className="chef-card">
      <img
        src={chef.image}
        alt={chef.name}
      />
      <div className="chef-overlay">
        <h3>{chef.name}</h3>
        <p>{chef.specialty}</p>
      </div>
      <div className="chef-footer">
        <span>📍 {chef.location}</span>
        <span>📖 {chef.recipes} receitas</span>
      </div>
    </div>
  )
}

export default ChefCard