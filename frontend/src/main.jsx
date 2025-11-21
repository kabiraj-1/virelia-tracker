import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log('ÌæØ Starting Virelia Tracker App...');

// Extreme error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Ì∫® React Error Boundary Caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return React.createElement('div', {
        style: {
          padding: '2rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }
      }, [
        React.createElement('h1', { 
          key: 'title',
          style: { fontSize: '2.5rem', marginBottom: '1rem' }
        }, 'Ì∫® Application Error'),
        React.createElement('p', {
          key: 'message',
          style: { marginBottom: '2rem', maxWidth: '500px' }
        }, 'Something went wrong. Please refresh the page.'),
        React.createElement('button', {
          key: 'reload',
          onClick: () => window.location.reload(),
          style: {
            padding: '1rem 2rem',
            background: 'white',
            color: '#6366f1',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '1.1rem'
          }
        }, 'Reload Application')
      ]);
    }

    return this.props.children;
  }
}

// Wait for DOM to be ready
function initializeApp() {
  console.log('Ì¥ß DOM ready, initializing React...');
  
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('‚ùå Cannot find #root element');
    document.body.innerHTML = `
      <div style="padding: 2rem; text-align: center; color: #dc2626;">
        <h1>‚ùå Critical Error</h1>
        <p>Cannot find root element. Please check the deployment.</p>
      </div>
    `;
    return;
  }

  try {
    console.log('‚úÖ Root element found, creating React root...');
    const root = ReactDOM.createRoot(rootElement);
    
    console.log('Ìæ® Rendering App component...');
    root.render(
      React.createElement(ErrorBoundary, {}, 
        React.createElement(React.StrictMode, {}, 
          React.createElement(App)
        )
      )
    );
    
    console.log('‚úÖ React app successfully rendered!');
    
  } catch (error) {
    console.error('‚ùå React rendering failed:', error);
    rootElement.innerHTML = `
      <div style="padding: 2rem; text-align: center; color: #dc2626;">
        <h1>‚ùå Rendering Error</h1>
        <p>${error.message}</p>
        <button onclick="window.location.reload()" style="
          padding: 0.75rem 1.5rem;
          background: #dc2626;
          color: white;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          margin-top: 1rem;
        ">Reload Page</button>
      </div>
    `;
  }
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
