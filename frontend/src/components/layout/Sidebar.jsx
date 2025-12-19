import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  HomeIcon,
  UsersIcon,
  TargetIcon,
  BellIcon,
  MessageCircleIcon,
  BarChartIcon,
  UserIcon,
  SettingsIcon,
  SunIcon,
  MoonIcon,
  LogOutIcon
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { path: '/dashboard', icon: <HomeIcon size={20} />, label: 'Dashboard' },
    { path: '/feed', icon: <UsersIcon size={20} />, label: 'Social Feed' },
    { path: '/friends', icon: <UsersIcon size={20} />, label: 'Friends' },
    { path: '/goals', icon: <TargetIcon size={20} />, label: 'Goals' },
    { path: '/chat', icon: <MessageCircleIcon size={20} />, label: 'Chat' },
    { path: '/analytics', icon: <BarChartIcon size={20} />, label: 'Analytics' },
    { path: '/profile', icon: <UserIcon size={20} />, label: 'Profile' },
    { path: '/settings', icon: <SettingsIcon size={20} />, label: 'Settings' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">V</div>
          <span className="logo-text">Virelia</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? <MoonIcon size={20} /> : <SunIcon size={20} />}
          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
        
        <div className="user-profile">
          <img 
            src={user?.profilePicture || '/default-avatar.png'} 
            alt={user?.name} 
            className="user-avatar"
          />
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-email">{user?.email}</span>
          </div>
          <button className="logout-btn" onClick={logout} title="Logout">
            <LogOutIcon size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;