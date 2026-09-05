import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  User as UserIcon,
  LogOut,
  Package,
  LayoutDashboard,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/');
    }
  };

  return (
    <header className="navbar">
      <div className="nav-content">
        {/* Brand */}
        <Link to="/" className="brand-logo">
          <ShoppingBag size={26} color="#6366f1" />
          <span>NexisStore</span>
        </Link>

        {/* Search Bar */}
        <form className="nav-search-bar" onSubmit={handleSearchSubmit}>
          <Search size={18} className="nav-search-icon" />
          <input
            type="text"
            placeholder="Search products, brands, essentials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        {/* Action Controls */}
        <div className="nav-actions">
          {/* Cart Trigger */}
          <Link to="/cart" className="cart-icon-btn" title="View Shopping Cart">
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {/* User Auth Controls */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                className="user-menu-btn"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={user.name}
                  className="user-avatar"
                />
                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                  {user.name.split(' ')[0]}
                </span>
                {isAdmin && (
                  <span
                    style={{
                      background: 'rgba(99, 102, 241, 0.2)',
                      color: '#818cf8',
                      fontSize: '0.7rem',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '4px',
                      fontWeight: 700,
                    }}
                  >
                    ADMIN
                  </span>
                )}
              </button>

              {menuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    minWidth: '200px',
                    zIndex: 150,
                    padding: '0.5rem 0',
                    animation: 'slideUp 0.15s ease-out',
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</p>
                  </div>

                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.6rem 1rem',
                        fontSize: '0.88rem',
                        color: '#818cf8',
                      }}
                    >
                      <LayoutDashboard size={16} />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  <Link
                    to="/my-orders"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 1rem',
                      fontSize: '0.88rem',
                    }}
                  >
                    <Package size={16} />
                    <span>My Orders</span>
                  </Link>

                  <Link
                    to="/profile"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 1rem',
                      fontSize: '0.88rem',
                    }}
                  >
                    <UserIcon size={16} />
                    <span>Profile Settings</span>
                  </Link>

                  <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '0.3rem 0' }}></div>

                  <button
                    onClick={logout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 1rem',
                      fontSize: '0.88rem',
                      color: '#f87171',
                      width: '100%',
                      textAlign: 'left',
                    }}
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
