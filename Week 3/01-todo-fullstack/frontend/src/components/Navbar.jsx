import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="brand">
          <div className="brand-icon">
            <CheckSquare size={20} strokeWidth={2.5} />
          </div>
          <span className="brand-title">TaskFlow</span>
        </Link>

        <div className="nav-user">
          {isAuthenticated && user ? (
            <>
              <div className="user-badge">
                <div className="user-avatar">{getInitials(user.name)}</div>
                <span>{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                title="Sign out of your account"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8125rem' }}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem' }}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem' }}>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
