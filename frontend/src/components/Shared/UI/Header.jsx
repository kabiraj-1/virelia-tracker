import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Events', href: '/social/events', icon: '🎯' },
    { name: 'Feed', href: '/social/feed', icon: '📝' },
  ]

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              V
            </div>
            <span className="text-xl font-bold text-gray-800 hidden sm:block">
              Virelia Tracker
            </span>
          </Link>

          {/* Navigation - Desktop */}
          {isAuthenticated && (
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notification Bell */}
                <button className="p-2 text-gray-400 hover:text-gray-500 relative">
                  <span className="text-xl">🔔</span>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                </button>

                {/* User Avatar & Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
                  >
                    <img
                      src={user?.avatar || '/default-avatar.png'}
                      alt={user?.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                      {user?.username}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {user?.karmaPoints || 0} karma
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        👤 Your Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        ⚙️ Settings
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        🚪 Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex space-x-3">
                <Link
                  to="/login"
                  className="btn-secondary"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="text-xl">☰</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && isAuthenticated && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium ${
                      isActive
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header