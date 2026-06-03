import { useNavigate } from 'react-router-dom'

function ChefCard({ chef }) {
  const navigate = useNavigate()

  return (
    <div className="chef-card" onClick={() => navigate(`/chef/${chef.id}`)} style={{ cursor: 'pointer' }}>
      <img src={chef.image} alt={chef.name} />
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
