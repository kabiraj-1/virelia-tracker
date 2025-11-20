import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import BackendStatus from './components/BackendStatus'

// Route Handler Component
const RouteHandler = () => {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // Handle redirect from URL parameters (fallback for SPA routing)
    const urlParams = new URLSearchParams(window.location.search)
    const redirectPath = urlParams.get('redirect')
    
    if (redirectPath && redirectPath !== location.pathname) {
      // Replace the current history entry to avoid back button issues
      navigate(redirectPath, { replace: true })
    }
    
    console.log('Current route:', location.pathname)
  }, [location, navigate])

  return null
}

// 404 Page component
const NotFound = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const goHome = () => navigate('/')
  const goBack = () => navigate(-1)
  
  return (
    <div className="container">
      <div style={{ 
        textAlign: 'center', 
        padding: '4rem 1rem',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <h1 style={{ fontSize: '4rem', color: '#6366f1', marginBottom: '1rem' }}>404</h1>
        <h2 style={{ marginBottom: '1rem' }}>Page Not Found</h2>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>
          The page <code>{location.pathname}</code> does not exist.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={goBack} className="btn btn-secondary">Go Back</button>
          <button onClick={goHome} className="btn btn-primary">Go Home</button>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <div className="App">
        <RouteHandler />
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            {/* Catch all route - must be last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <BackendStatus />
      </div>
    </Router>
  )
}

export default App
