import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { User, Mail, Shield, Save, CheckCircle, ArrowLeft, X, Home, LayoutDashboard } from 'lucide-react';

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
    // If there is history, go back; otherwise go to appropriate landing page
    if (window.history.length > 1) {
      navigate(-1);
    } else if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '2rem auto' }}>
      {/* Top Navigation / Breadcrumb Row */}
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
          className="btn btn-outline btn-sm"
          title="Return to previous page"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {user?.role === 'admin' ? (
            <Link to="/admin/dashboard" className="btn btn-secondary btn-sm">
              <LayoutDashboard size={15} /> Admin Dashboard
            </Link>
          ) : (
            <Link to="/" className="btn btn-secondary btn-sm">
              <Home size={15} /> Browse Store
            </Link>
          )}

          <button
            onClick={handleClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.4rem 0.6rem', color: 'var(--text-muted)' }}
            title="Close Settings"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: '2.5rem', position: 'relative' }}>
        {/* User Identity Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
          <img
            src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt={name}
            style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #6366f1' }}
          />
          <div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>{name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className={`badge ${user?.role === 'admin' ? 'badge-processing' : 'badge-category'}`}>
                Role: {user?.role?.toUpperCase()}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user?.email}</span>
            </div>
          </div>
        </div>

        {statusMsg.text && (
          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              background: statusMsg.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)',
              border: `1px solid ${statusMsg.type === 'success' ? '#10b981' : '#ef4444'}`,
              color: statusMsg.type === 'success' ? '#a7f3d0' : '#fecaca',
              fontSize: '0.9rem',
            }}
          >
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
            <label className="form-label">Avatar Image URL</label>
            <input
              type="url"
              className="form-control"
              placeholder="https://..."
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Change Password (leave blank to keep current)</label>
            <input
              type="password"
              className="form-control"
              placeholder="New password (optional)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Action Buttons: Save and Close / Cancel */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '1.75rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-secondary btn-lg"
              style={{ flex: 1 }}
            >
              <X size={18} /> Close & Return
            </button>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ flex: 2 }}
              disabled={saving}
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
