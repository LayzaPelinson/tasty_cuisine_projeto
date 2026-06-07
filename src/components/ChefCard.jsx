import { useNavigate } from 'react-router-dom'
import { FiMapPin, FiBook } from 'react-icons/fi'

function ChefCard({ chef }) {
  const navigate = useNavigate()

  return (
    <div className="chef-card" onClick={() => navigate(`/chef/${chef.id}`)} style={{ cursor: 'pointer' }}>
      <img src={chef.image} alt={chef.name} />
      <div className="chef-overlay">
        <h3>{chef.name}</h3>
      </div>
      <div className="chef-footer">
        <span><FiBook /> {chef.recipes} receitas</span>
      </div>
    </div>
  )
}

export default ChefCard
