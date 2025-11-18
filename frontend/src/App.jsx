import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { SocialProvider } from './contexts/SocialContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import LoadingSpinner from './components/Shared/LoadingSpinner';

// Pages - Lazy loaded for performance
import { lazy, Suspense } from 'react';
const Home = lazy(() => import('./pages/Home'));
const Feed = lazy(() => import('./pages/Feed'));
const Events = lazy(() => import('./pages/Events'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const CreatePost = lazy(() => import('./pages/CreatePost'));
const EventDetail = lazy(() => import('./pages/EventDetail'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Settings = lazy(() => import('./pages/Settings'));

// Styles
import './styles/global.css';
import './styles/animations.css';
import './styles/responsive.css';

function App() {
  return (
    <AuthProvider>
      <SocialProvider>
        <NotificationProvider>
          <Router>
            <div className="app">
              <Navbar />
              <main className="main-content">
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/feed" element={<Feed />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/events/:id" element={<EventDetail />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/:userId" element={<UserProfile />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/create-post" element={<CreatePost />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
              
              {/* Global Notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 5000,
                  style: {
                    background: 'var(--card-bg)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  },
                  success: {
                    iconTheme: {
                      primary: 'var(--success)',
                      secondary: 'white',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: 'var(--error)',
                      secondary: 'white',
                    },
                  },
                }}
              />
            </div>
          </Router>
        </NotificationProvider>
      </SocialProvider>
    </AuthProvider>
  );
}

export default App;
