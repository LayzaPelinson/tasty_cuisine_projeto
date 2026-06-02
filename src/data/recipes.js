import ratatouille from '../assets/img/ratatouille.jpg'

const recipes = [
  {
    id: 1,
    title: 'Ratatouille',
    image: ratatouille,
    category: 'Jantar',
    difficulty: 'Médio',
    time: '45 min',
    chef: 'Remy',
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
  }
]

export default recipes