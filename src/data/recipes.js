import ratatouille from '../assets/img/ratatouille.jpg'

const recipes = [
  {
    id: 1,
    title: 'Ratatouille',
    image: ratatouille,
    category: 'Jantar',
    difficulty: 'Médio',
    time: '45 min',
    chef: 'Marie Laurent',
    chefId: 1,
    description:
      'Um clássico da culinária francesa preparado com berinjela, abobrinha, tomate e ervas aromáticas.',
    chefTip:
      'Corte todos os vegetais em espessuras semelhantes para garantir um cozimento uniforme.',
    ingredients: [
      '1 berinjela',
      '2 abobrinhas',
      '3 tomates',
      '1 cebola',
      '2 dentes de alho',
      'Azeite de oliva',
      'Sal e pimenta a gosto',
      'Ervas finas'
    ],
    instructions: [
      'Lave e corte todos os vegetais em fatias finas.',
      'Refogue a cebola e o alho no azeite.',
      'Distribua os vegetais em uma travessa.',
      'Tempere com sal, pimenta e ervas.',
      'Cubra com papel-alumínio.',
      'Asse por aproximadamente 40 minutos.',
      'Retire o papel e asse por mais 10 minutos.',
      'Sirva quente.'
    ]
  },
  {
    id: 2,
    title: 'Frango Grelhado',
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c4?w=400&q=75',
    category: 'Almoço',
    difficulty: 'Fácil',
    time: '30 min',
    chef: 'Marie Laurent',
    chefId: 1,
    description: 'Frango grelhado temperado com ervas frescas e limão, acompanhado de legumes.',
    chefTip: 'Marine o frango por pelo menos 30 minutos antes de grelhar.',
    ingredients: ['2 filés de frango', 'Suco de 1 limão', 'Alho', 'Ervas frescas', 'Azeite', 'Sal e pimenta'],
    instructions: ['Marine o frango com limão, alho e ervas.', 'Aqueça a grelha.', 'Grelhe por 6 minutos cada lado.', 'Deixe descansar 5 minutos antes de servir.']
  },
  {
    id: 3,
    title: 'Mousse de Chocolate',
    image: 'https://images.unsplash.com/photo-1511715282680-fbf93a50e721?w=400&q=75',
    category: 'Sobremesas',
    difficulty: 'Fácil',
    time: '20 min',
    chef: 'Pierre Dubois',
    chefId: 4,
    description: 'Mousse de chocolate cremoso e leve, perfeito para encerrar qualquer refeição.',
    chefTip: 'Use chocolate com pelo menos 70% de cacau para um sabor mais intenso.',
    ingredients: ['200g de chocolate amargo', '3 ovos', '2 colheres de açúcar', '1 xícara de creme de leite'],
    instructions: ['Derreta o chocolate em banho-maria.', 'Separe as claras das gemas.', 'Misture as gemas ao chocolate.', 'Bata as claras em neve e incorpore.', 'Leve à geladeira por 2 horas.']
  },
  {
    id: 4,
    title: 'Picanha Assada',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&q=75',
    category: 'Carnes',
    difficulty: 'Médio',
    time: '90 min',
    chef: 'Marco Bianchi',
    chefId: 2,
    description: 'Picanha suculenta assada lentamente com sal grosso e alecrim.',
    chefTip: 'Nunca fure a carne antes de assar para não perder os sucos.',
    ingredients: ['1 peça de picanha', 'Sal grosso', 'Alecrim', 'Alho', 'Manteiga'],
    instructions: ['Cubra a picanha com sal grosso.', 'Leve ao forno a 200°C por 40 min.', 'Vire e asse por mais 40 min.', 'Deixe descansar 10 min antes de fatiar.']
  },
  {
    id: 5,
    title: 'Salmão ao Limão',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=75',
    category: 'Peixes',
    difficulty: 'Fácil',
    time: '25 min',
    chef: 'Sofia Romano',
    chefId: 3,
    description: 'Filé de salmão grelhado com molho de limão e alcaparras.',
    chefTip: 'Não cozinhe demais o salmão — ele deve ficar levemente rosado no centro.',
    ingredients: ['2 filés de salmão', 'Suco de 2 limões', 'Alcaparras', 'Manteiga', 'Sal e pimenta', 'Salsa'],
    instructions: ['Tempere o salmão com sal e pimenta.', 'Grelhe na manteiga por 4 min cada lado.', 'Prepare o molho com limão e alcaparras.', 'Sirva com o molho por cima.']
  },
  {
    id: 6,
    title: 'Espaguete ao Molho',
    image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&q=75',
    category: 'Massas',
    difficulty: 'Fácil',
    time: '35 min',
    chef: 'Marco Bianchi',
    chefId: 2,
    description: 'Espaguete clássico com molho de tomate caseiro e manjericão fresco.',
    chefTip: 'Cozinhe a massa al dente e finalize no molho por 2 minutos.',
    ingredients: ['400g de espaguete', '500g de tomate pelado', 'Alho', 'Azeite', 'Manjericão', 'Sal'],
    instructions: ['Cozinhe o espaguete al dente.', 'Refogue o alho no azeite.', 'Adicione os tomates e cozinhe 20 min.', 'Misture a massa ao molho.', 'Finalize com manjericão fresco.']
  },
  {
    id: 7,
    title: 'Bowl Vegano',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=75',
    category: 'Vegetariana',
    difficulty: 'Fácil',
    time: '20 min',
    chef: 'Sofia Romano',
    chefId: 3,
    description: 'Bowl colorido com quinoa, grão-de-bico, legumes frescos e molho tahine.',
    chefTip: 'Prepare os ingredientes com antecedência para montar o bowl rapidamente.',
    ingredients: ['1 xícara de quinoa', '1 lata de grão-de-bico', 'Cenoura', 'Pepino', 'Tomate cereja', 'Tahine', 'Limão'],
    instructions: ['Cozinhe a quinoa conforme o pacote.', 'Escorra e tempere o grão-de-bico.', 'Corte os legumes.', 'Monte o bowl e regue com molho tahine.']
  },
  {
    id: 8,
    title: 'Pão Sem Glúten',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=75',
    category: 'Sem glúten',
    difficulty: 'Médio',
    time: '60 min',
    chef: 'Pierre Dubois',
    chefId: 4,
    description: 'Pão macio e saboroso feito com farinha de arroz e polvilho.',
    chefTip: 'Não abra o forno durante os primeiros 30 minutos para o pão crescer bem.',
    ingredients: ['2 xícaras de farinha de arroz', '1 xícara de polvilho', 'Fermento', 'Sal', 'Ovos', 'Leite'],
    instructions: ['Misture os ingredientes secos.', 'Adicione os ovos e o leite.', 'Sove bem a massa.', 'Modele o pão.', 'Asse a 180°C por 40 minutos.']
  }
]

export default recipes