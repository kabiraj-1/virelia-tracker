import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

console.log('í¾¨ App component mounted - styles should load!');

function App() {
  const [count, setCount] = useState(0)

  // Inline styles as backup
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
    color: 'white',
    padding: '2rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  }

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '2rem',
    fontSize: '2.5rem',
    fontWeight: 'bold'
  }

  const logoContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    marginBottom: '2rem'
  }

  const logoStyle = {
    height: '6em',
    padding: '1.5em',
    transition: 'filter 300ms'
  }

  const buttonStyle = {
    borderRadius: '8px',
    border: '1px solid transparent',
    padding: '0.6em 1.2em',
    fontSize: '1em',
    fontWeight: '500',
    fontFamily: 'inherit',
    backgroundColor: '#6366f1',
    color: 'white',
    cursor: 'pointer',
    transition: 'border-color 0.25s'
  }

  return (
    <div style={containerStyle}>
      <div style={logoContainerStyle}>
        <a href="https://vitejs.dev" target="_blank">
          <img 
            src={viteLogo} 
            style={logoStyle}
            onMouseOver={(e) => e.target.style.filter = 'drop-shadow(0 0 2em #646cffaa)'}
            onMouseOut={(e) => e.target.style.filter = 'none'}
            alt="Vite logo" 
          />
        </a>
        <a href="https://react.dev" target="_blank">
          <img 
            src={reactLogo} 
            style={{
              ...logoStyle,
              animation: 'logo-spin infinite 20s linear'
            }}
            onMouseOver={(e) => e.target.style.filter = 'drop-shadow(0 0 2em #61dafbaa)'}
            onMouseOut={(e) => e.target.style.filter = 'none'}
            alt="React logo" 
          />
        </a>
      </div>
      
      <h1 style={headerStyle}>Virelia Tracker</h1>
      
      <div style={{ textAlign: 'center' }}>
        <button 
          onClick={() => setCount((count) => count + 1)}
          style={buttonStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = '#4f46e5'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#6366f1'}
        >
          Count is {count}
        </button>
        <p style={{ marginTop: '1rem', color: '#a0aec0' }}>
          Edit <code style={{ background: '#2d3748', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      
      <p style={{ textAlign: 'center', marginTop: '2rem', color: '#718096' }}>
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
