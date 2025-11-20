import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import BackendStatus from './components/BackendStatus'

// 404 Page component
const NotFound = () => {
  const location = useLocation()
  
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
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a href="/" className="btn btn-primary">Go Home</a>
          <a href="/dashboard" className="btn btn-secondary">Dashboard</a>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
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
