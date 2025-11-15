import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useSocial } from '../contexts/SocialContext'
import KarmaLeaderboard from '../components/social/Karma/KarmaLeaderboard'

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth()
  const { events, feed, leaderboard } = useSocial()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Virelia Tracker
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Join our community and start tracking events with karma system
          </p>
          <div className="space-x-4">
            <Link to="/register" className="btn-primary text-lg px-8 py-3">
              Get Started
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-3">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening in your community today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {events.length}
                </div>
                <div className="text-gray-600">Active Events</div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {user?.karmaPoints || 0}
                </div>
                <div className="text-gray-600">Your Karma</div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  {feed.length}
                </div>
                <div className="text-gray-600">Community Posts</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  to="/social/events"
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <span className="text-2xl">🎯</span>
                  <div>
                    <div className="font-medium text-gray-800">Join Events</div>
                    <div className="text-sm text-gray-600">Find and join community events</div>
                  </div>
                </Link>
                
                <Link
                  to="/social/feed"
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                >
                  <span className="text-2xl">📝</span>
                  <div>
                    <div className="font-medium text-gray-800">Share Post</div>
                    <div className="text-sm text-gray-600">Connect with community</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Activity Preview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Recent Community Activity
              </h2>
              {feed.slice(0, 3).map(post => (
                <div key={post._id} className="border-b border-gray-100 last:border-0 py-3">
                  <div className="flex items-start space-x-3">
                    <img
                      src={post.author.avatar || '/default-avatar.png'}
                      alt={post.author.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-800">
                          {post.author.username}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {post.author.karmaPoints} karma
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {post.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {feed.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📝</div>
                  <p>No activity yet. Be the first to post!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Leaderboard */}
          <div className="lg:col-span-1">
            <KarmaLeaderboard />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard