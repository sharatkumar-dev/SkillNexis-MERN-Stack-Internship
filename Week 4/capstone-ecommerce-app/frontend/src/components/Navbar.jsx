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
import logoSvg from '../assets/logo.svg';

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
        {/* Brand Logo */}
        <Link to="/" className="brand-logo-wrap" title="NexisStore — Premium Tech & Hardware">
          <img src={logoSvg} alt="NexisStore" className="brand-logo-img" />
        </Link>

        {/* Live Trust Telemetry Indicator */}
        <div style={{ display: 'none', alignItems: 'center', gap: '0.45rem' }} className="desktop-telemetry">
          <span className="status-ping"></span>
          <span className="telemetry-mono" style={{ fontSize: '0.72rem', color: 'var(--success)', fontWeight: 600 }}>
            CERTIFIED GENUINE // FAST DISPATCH
          </span>
        </div>

        {/* Search Bar */}
        <form className="nav-search-bar" onSubmit={handleSearchSubmit}>
          <Search size={16} className="nav-search-icon" />
          <input
            type="text"
            placeholder="Search products, electronics, hardware, essentials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        {/* Action Controls */}
        <div className="nav-actions">
          {/* Cart Trigger */}
          <Link to="/cart" className="cart-icon-btn" title="View Shopping Cart">
            <ShoppingBag size={18} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {/* User Auth Controls */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                className="user-menu-btn"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-expanded={menuOpen}
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={user.name}
                  className="user-avatar"
                />
                <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#f8fafc' }}>
                  {user.name.split(' ')[0]}
                </span>
                {isAdmin && (
                  <span
                    style={{
                      background: 'rgba(245, 158, 11, 0.15)',
                      color: '#fbbf24',
                      fontSize: '0.68rem',
                      padding: '0.1rem 0.45rem',
                      borderRadius: '2px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      border: '1px solid rgba(245, 158, 11, 0.3)',
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
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: 'var(--shadow-lg)',
                    minWidth: '220px',
                    zIndex: 150,
                    padding: '0.5rem 0',
                    animation: 'slideUp 0.15s ease-out',
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  <div style={{ padding: '0.6rem 1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>{user.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</p>
                  </div>

                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.65rem 1rem',
                        fontSize: '0.86rem',
                        color: 'var(--text-amber)',
                        fontWeight: 600,
                      }}
                    >
                      <LayoutDashboard size={15} />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  <Link
                    to="/my-orders"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.65rem 1rem',
                      fontSize: '0.86rem',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <Package size={15} />
                    <span>My Orders</span>
                  </Link>

                  <Link
                    to="/profile"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.65rem 1rem',
                      fontSize: '0.86rem',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <UserIcon size={15} />
                    <span>Account Settings</span>
                  </Link>

                  <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '0.35rem 0' }}></div>

                  <button
                    onClick={logout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.65rem 1rem',
                      fontSize: '0.86rem',
                      color: '#f87171',
                      width: '100%',
                      textAlign: 'left',
                    }}
                  >
                    <LogOut size={15} />
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
