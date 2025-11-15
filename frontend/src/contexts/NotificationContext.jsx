import React, { createContext, useContext, useReducer } from 'react'

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications].slice(0, 50) // Keep last 50
      }
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      }
    case 'MARK_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        )
      }
    case 'CLEAR_ALL':
      return {
        ...state,
        notifications: []
      }
    default:
      return state
  }
}

const initialState = {
  notifications: []
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState)

  const addNotification = (notification) => {
    const id = Date.now() + Math.random()
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id,
        timestamp: new Date(),
        read: false,
        ...notification
      }
    })
  }

  const removeNotification = (id) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id })
  }

  const markAsRead = (id) => {
    dispatch({ type: 'MARK_AS_READ', payload: id })
  }

  const clearAll = () => {
    dispatch({ type: 'CLEAR_ALL' })
  }

  const unreadCount = state.notifications.filter(n => !n.read).length

  const value = {
    notifications: state.notifications,
    unreadCount,
    addNotification,
    removeNotification,
    markAsRead,
    clearAll
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}