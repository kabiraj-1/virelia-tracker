import { useState } from 'react'
import './App.css'

console.log('í¾¨ App component mounted - styles should load!');

// Inline SVG data for logos
const ViteLogo = () => (
  <svg width="31" height="32" viewBox="0 0 31 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30.1554 7.63158L16.093 31.2309C15.7588 31.7499 15.0008 31.7499 14.6666 31.2309L0.604248 7.63158C0.231182 7.05263 0.655982 6.31579 1.33713 6.31579H29.4225C30.1036 6.31579 30.5284 7.05263 30.1554 7.63158Z" fill="url(#paint0_linear_87_8266)"/>
    <path d="M22.6444 0L13.8798 2.10105C13.5456 2.18947 13.3043 2.47895 13.3043 2.83158V10.9474C13.3043 11.4074 13.688 11.7895 14.1507 11.7895H20.6089C20.9431 11.7895 21.2385 12.0211 21.3253 12.3474L22.7516 17.2632C22.9072 17.8105 23.5539 18.0421 24.0084 17.6842L29.6358 13.2632C29.9701 13.0105 30.0569 12.5474 29.8615 12.1895L22.7516 0.547368C22.5562 0.189474 22.9787 0 23.1246 0H22.6444Z" fill="url(#paint1_linear_87_8266)"/>
    <defs>
      <linearGradient id="paint0_linear_87_8266" x1="25.2658" y1="4.63158" x2="11.2034" y2="28.2309" gradientUnits="userSpaceOnUse">
        <stop stop-color="#41D1FF"/>
        <stop offset="1" stop-color="#BD34FE"/>
      </linearGradient>
      <linearGradient id="paint1_linear_87_8266" x1="22.109" y1="0" x2="22.109" y2="17.2632" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FFEA83"/>
        <stop offset="0.0833333" stop-color="#FFDD35"/>
        <stop offset="1" stop-color="#FFA800"/>
      </linearGradient>
    </defs>
  </svg>
);

const ReactLogo = () => (
  <svg width="40" height="40" viewBox="-10.5 -9.45 21 18.9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="0" cy="0" r="2" fill="currentColor"/>
    <g stroke="currentColor" stroke-width="1" fill="none">
      <ellipse rx="10" ry="4.5"/>
      <ellipse rx="10" ry="4.5" transform="rotate(60)"/>
      <ellipse rx="10" ry="4.5" transform="rotate(120)"/>
    </g>
  </svg>
);

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
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
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
    transition: 'all 300ms ease',
    filter: 'drop-shadow(0 0 1em #646cffaa)'
  }

  const reactLogoStyle = {
    ...logoStyle,
    animation: 'logo-spin infinite 20s linear',
    filter: 'drop-shadow(0 0 1em #61dafbaa)'
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
    transition: 'all 0.25s ease',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  }

  return (
    <div style={containerStyle}>
      <div style={logoContainerStyle}>
        <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
          <div 
            style={logoStyle}
            onMouseOver={(e) => e.target.style.filter = 'drop-shadow(0 0 2em #646cffaa) brightness(1.2)'}
            onMouseOut={(e) => e.target.style.filter = 'drop-shadow(0 0 1em #646cffaa)'}
          >
            <ViteLogo />
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', opacity: '0.8' }}>Vite</p>
          </div>
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <div 
            style={reactLogoStyle}
            onMouseOver={(e) => e.target.style.filter = 'drop-shadow(0 0 2em #61dafbaa) brightness(1.2)'}
            onMouseOut={(e) => e.target.style.filter = 'drop-shadow(0 0 1em #61dafbaa)'}
          >
            <ReactLogo />
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', opacity: '0.8' }}>React</p>
          </div>
        </a>
      </div>
      
      <h1 style={headerStyle}>íº€ Virelia Tracker</h1>
      
      <div style={{ textAlign: 'center' }}>
        <button 
          onClick={() => setCount((count) => count + 1)}
          style={buttonStyle}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#4f46e5';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 8px -1px rgba(0, 0, 0, 0.2)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#6366f1';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
          }}
        >
          Count is {count}
        </button>
        <p style={{ marginTop: '1rem', color: '#a0aec0' }}>
          Edit <code style={{ 
            background: '#2d3748', 
            padding: '0.2rem 0.4rem', 
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '0.875rem'
          }}>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      
      <p style={{ textAlign: 'center', marginTop: '2rem', color: '#718096' }}>
        Click on the Vite and React logos to learn more
      </p>

      <style jsx>{`
        @keyframes logo-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default App
