import React, { useState, useEffect } from 'react'

const BackendStatus = () => {
  const [status, setStatus] = useState('checking')
  const [responseTime, setResponseTime] = useState(null)

  useEffect(() => {
    const checkBackend = async () => {
      const startTime = Date.now()
      try {
        const response = await fetch('https://virelia-tracker.onrender.com/api/auth/health', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        })
        const endTime = Date.now()
        setResponseTime(endTime - startTime)
        
        if (response.ok) {
          setStatus('online')
        } else {
          setStatus('error')
        }
      } catch (error) {
        setStatus('offline')
        setResponseTime(null)
      }
    }

    checkBackend()
    const interval = setInterval(checkBackend, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = () => {
    switch (status) {
      case 'online': return '#10b981'
      case 'offline': return '#ef4444'
      case 'error': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '1rem',
      right: '1rem',
      padding: '0.5rem 1rem',
      background: 'white',
      border: `2px solid ${getStatusColor()}`,
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: getStatusColor()
        }}></div>
        <span>Backend: {status}</span>
        {responseTime && <span>({responseTime}ms)</span>}
      </div>
    </div>
  )
}

export default BackendStatus
