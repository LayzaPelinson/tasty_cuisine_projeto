import '../styles/categories.css'

function Categories() {
    const categories = [
        {
            name:'Almoço',
            image: 'https://images.unsplash.com/photo-1544025162-d76694265947'
        },
        {
            name:'Jantar',
            image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19'
        },
        {
            name: 'Sobremesas',
            image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777'
        },

        {
            name: 'Carnes',
            image:'https://images.unsplash.com/photo-1558030006-450675393462'
        },

        {
            name: 'Peixes',
            image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2'
        },

        {
            name: 'Massas',
            image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb'
        },

        {
            name: 'Sem glúten',
            image: 'https://images.unsplash.com/photo-1547592180-85f173990554'
        },

        {
            name: 'Vegetariana',
            image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd'
        }
    ]
  

  return (
    <section className="categories">

      {categories.map((category, index) => (

        <div className="category-card" key={index}>

          <img
            src={category.image}
            alt={category.name}
          />

          <p>{category.name}</p>

        </div>

      ))}

    </section>
  )
}

export default Categories