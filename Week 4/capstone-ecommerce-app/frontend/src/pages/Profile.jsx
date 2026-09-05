import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { User, Mail, Shield, Save, CheckCircle, ArrowLeft, X, Home, LayoutDashboard, Cpu, Key } from 'lucide-react';

export const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [password, setPassword] = useState('');
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const payload = { name, email, avatar };
      if (password) payload.password = password;

      const { data } = await API.put('/auth/profile', payload);
      updateUser(data.data);
      setStatusMsg({ type: 'success', text: 'Profile updated successfully!' });
      setPassword('');
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div style={{ maxWidth: '680px', margin: '1.5rem auto' }}>
      {/* Top Navigation Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
        }}
      >
        <button
          onClick={handleClose}
          className="btn btn-secondary btn-sm"
          title="Go back"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {user?.role === 'admin' ? (
            <Link to="/admin/dashboard" className="btn btn-outline btn-sm">
              <LayoutDashboard size={14} /> Admin Dashboard
            </Link>
          ) : (
            <Link to="/" className="btn btn-outline btn-sm">
              <Home size={14} /> Browse Catalog
            </Link>
          )}

          <button
            onClick={handleClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.35rem 0.55rem', color: 'var(--text-muted)' }}
            title="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: '2.25rem', position: 'relative' }}>
        {/* User Identity Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <img
            src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt={name}
            style={{ width: '68px', height: '68px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1px solid var(--border-amber)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <span className="spec-chip">USER ID // #{user?._id?.slice(-6).toUpperCase() || 'USER-01'}</span>
              <span
                style={{
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  background: user?.role === 'admin' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  color: user?.role === 'admin' ? 'var(--text-amber)' : 'var(--text-secondary)',
                  border: `1px solid ${user?.role === 'admin' ? 'var(--border-amber)' : 'var(--border-subtle)'}`,
                }}
              >
                ROLE: {user?.role?.toUpperCase()}
              </span>
            </div>
            <h1 style={{ fontSize: '1.7rem', marginBottom: '0.2rem', letterSpacing: '-0.02em' }}>{name}</h1>
            <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{user?.email}</span>
          </div>
        </div>

        {statusMsg.text && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.5rem',
              background: statusMsg.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)',
              border: `1px solid ${statusMsg.type === 'success' ? '#10b981' : '#ef4444'}`,
              color: statusMsg.type === 'success' ? '#a7f3d0' : '#fecaca',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {statusMsg.type === 'success' ? 'Success: ' : 'Error: '}
            {statusMsg.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              required
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Profile Picture URL</label>
            <input
              type="url"
              className="form-control"
              placeholder="https://..."
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">New Password (Optional)</label>
            <input
              type="password"
              className="form-control"
              placeholder="Leave blank to keep your current password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div style={{ marginTop: '1.8rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
              style={{ textTransform: 'uppercase' }}
            >
              <Save size={16} />
              {saving ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
