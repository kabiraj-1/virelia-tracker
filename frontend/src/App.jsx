import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Simple Home component for testing
const Home = () => {
  return (
    <div style={{ 
      padding: '2rem', 
      textAlign: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      minHeight: '100vh'
    }}>
      <h1>Virelia Tracker - Debug Mode</h1>
      <p>If you can see this, React is working!</p>
      <div style={{ marginTop: '2rem' }}>
        <button 
          onClick={() => alert('JavaScript is working!')}
          style={{
            padding: '1rem 2rem',
            background: 'white',
            color: '#6366f1',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1.1rem',
            cursor: 'pointer'
          }}
        >
          Test JavaScript
        </button>
      </div>
    </div>
  )
}

// Simple 404 page
const NotFound = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>404 - Page Not Found</h1>
    </div>
  )
}

function App() {
  console.log('íº€ App component mounted - React is working!')
  
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Home />} />
          <Route path="/register" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  )
}

// Add error boundary for better error handling
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center',
          background: '#fee2e2',
          color: '#dc2626',
          minHeight: '100vh'
        }}>
          <h1>Something went wrong</h1>
          <p>Error: {this.state.error?.message}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// Wrap App with ErrorBoundary
export default function AppWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  )
}
