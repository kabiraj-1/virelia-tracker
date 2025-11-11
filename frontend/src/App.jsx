import React, { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [apiStatus, setApiStatus] = useState('Testing...')
  const [backendData, setBackendData] = useState(null)

  const testBackendConnection = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/health')
      setApiStatus('âœ… Connected to Backend!')
      setBackendData(response.data)
    } catch (error) {
      setApiStatus('âŒ Backend Connection Failed')
      console.error('Connection error:', error)
    }
  }

  useEffect(() => {
    testBackendConnection()
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>íº€ Virelia Tracker</h1>
      <p>Frontend is running!</p>
      
      <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h2>í´— Backend Connection Test</h2>
        <p><strong>Status:</strong> {apiStatus}</p>
        
        {backendData && (
          <div style={{ marginTop: '10px' }}>
            <p><strong>Backend Response:</strong></p>
            <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '3px' }}>
              {JSON.stringify(backendData, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <button 
        onClick={testBackendConnection}
        style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        í´„ Test Connection Again
      </button>
    </div>
  )
}

export default App
