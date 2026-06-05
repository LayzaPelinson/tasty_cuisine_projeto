import Header from './components/Header'
import Footer from './components/Footer'

import Home from './pages/Home'
import Recipes from './pages/Recipes'
import Chefs from './pages/Chefs'
import Profile from './pages/Profile'
import RecipeDetails from './pages/RecipeDetails'
import ChefDetails from './pages/ChefDetails'
import Login from './pages/Login'
import PublishRecipe from './pages/PublishRecipe'

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { FavoritesProvider } from './hooks/useFavorites.jsx'
import { UserProvider } from './hooks/useUser.jsx'

import './styles/app.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function App() {
  return (
    <BrowserRouter>
    <FavoritesProvider>
    <UserProvider>
    <div className="app">
      <ScrollToTop />
      <Header />
      <main className="content">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/chefs" element={<Chefs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/recipe/:id" element={<RecipeDetails />} />
        <Route path="/chef/:id" element={<ChefDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/publish" element={<PublishRecipe />} />
      </Routes>
      </main>
      <Footer />
      </div>
    </UserProvider>
    </FavoritesProvider>
    </BrowserRouter>
  )
}

export default App
