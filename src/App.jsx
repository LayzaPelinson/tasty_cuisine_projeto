import Header from './components/Header'
import Footer from './components/Footer'

import Home from './pages/Home'
import Recipes from './pages/Recipes'
import Chefs from './pages/Chefs'
import Profile from './pages/Profile'
import ChefProfile from './pages/ChefProfile'
import RecipeDetails from './pages/RecipeDetails'
import ChefDetails from './pages/ChefDetails'
import Login from './pages/Login'
import PublishRecipe from './pages/PublishRecipe'
import AdminDashboard from './pages/AdminDashboard'
import AllChefs from './pages/AllChefs'

import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { FavoritesProvider } from './hooks/useFavorites.jsx'
import { UserProvider, useUser } from './hooks/useUser.jsx'

import './styles/app.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function ProtectedRoute({ children, chefOnly = false, chefRedirect = false }) {
  const { user, loading } = useUser()
  if (!user && !loading) return <Navigate to="/login" replace />
  if (chefOnly && user.funcao !== 'Chefe') return <Navigate to="/" replace />
  if (!user) return null
  if (chefRedirect && user.funcao === 'Chefe') return <Navigate to="/recipes" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/recipes" element={<ProtectedRoute><Recipes /></ProtectedRoute>} />
      <Route path="/chefs" element={<ProtectedRoute chefRedirect><Chefs /></ProtectedRoute>} />
      <Route path="/chefs/todos" element={<ProtectedRoute chefRedirect><AllChefs /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/chef-profile" element={<ProtectedRoute chefOnly><ChefProfile /></ProtectedRoute>} />
      <Route path="/recipe/:id" element={<ProtectedRoute><RecipeDetails /></ProtectedRoute>} />
      <Route path="/chef/:id" element={<ProtectedRoute><ChefDetails /></ProtectedRoute>} />
      <Route path="/publish" element={<ProtectedRoute chefOnly><PublishRecipe /></ProtectedRoute>} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  )
}

function AppShell() {
  const { pathname } = useLocation()
  const isAdmin = pathname === '/admin'
  return (
    <div className="app">
      <ScrollToTop />
      {!isAdmin && <Header />}
      <main className="content">
        <AppRoutes />
      </main>
      {!isAdmin && <Footer />}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
    <UserProvider>
    <FavoritesProvider>
      <AppShell />
    </FavoritesProvider>
    </UserProvider>
    </BrowserRouter>
  )
}

export default App
