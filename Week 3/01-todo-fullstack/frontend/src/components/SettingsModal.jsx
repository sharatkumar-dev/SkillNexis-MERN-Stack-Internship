import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';
import {
  X,
  User,
  Shield,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Loader2,
  Lock,
  Mail
} from 'lucide-react';

const SettingsModal = ({ isOpen, onClose, onClearCompletedSuccess, completedCount = 0 }) => {
  const {
    user,
    preferences,
    updateUserProfile,
    updateUserPassword,
    deleteUserAccount,
    updatePreferences
  } = useAuth();

  const [activeTab, setActiveTab] = useState('profile');

  // Profile form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Security form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Preferences form state
  const [defaultPriority, setDefaultPriority] = useState('medium');
  const [defaultStatus, setDefaultStatus] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(true);

  // Status feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
    if (preferences) {
      setDefaultPriority(preferences.defaultPriority || 'medium');
      setDefaultStatus(preferences.defaultStatus || 'all');
      setConfirmDelete(preferences.confirmDelete !== false);
    }
    setMessage(null);
  }, [user, preferences, isOpen]);

  if (!isOpen) return null;

  const showFeedback = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  // 1. Handle Profile Update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showFeedback('Name and email cannot be empty.', 'error');
      return;
    }
    setIsSubmitting(true);
    const res = await updateUserProfile(name.trim(), email.trim());
    setIsSubmitting(false);

    if (res.success) {
      showFeedback('Profile updated successfully!', 'success');
    } else {
      showFeedback(res.message, 'error');
    }
  };

  // 2. Handle Password Update
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showFeedback('Please provide current and new passwords.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showFeedback('New password must be at least 6 characters long.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showFeedback('New passwords do not match.', 'error');
      return;
    }

    setIsSubmitting(true);
    const res = await updateUserPassword(currentPassword, newPassword);
    setIsSubmitting(false);

    if (res.success) {
      showFeedback('Password changed successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      showFeedback(res.message, 'error');
    }
  };

  // 3. Handle Preferences Save
  const handleSavePreferences = (e) => {
    e.preventDefault();
    updatePreferences({
      defaultPriority,
      defaultStatus,
      confirmDelete
    });
    showFeedback('Preferences saved locally!', 'success');
  };

  // 4. Handle Clear Completed Tasks
  const handleClearCompleted = async () => {
    if (completedCount === 0) {
      showFeedback('No completed tasks to clear.', 'error');
      return;
    }
    if (!window.confirm(`Are you sure you want to clear all ${completedCount} completed task(s)?`)) {
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.delete('/todos/completed/clear');
      setIsSubmitting(false);
      if (res.data.success) {
        showFeedback(res.data.message || 'Completed tasks cleared successfully!', 'success');
        if (onClearCompletedSuccess) onClearCompletedSuccess();
      }
    } catch (err) {
      setIsSubmitting(false);
      showFeedback('Failed to clear completed tasks.', 'error');
    }
  };

  // 5. Handle Delete Account
  const handleDeleteAccount = async () => {
    const confirmation = window.prompt(
      'WARNING: This will permanently delete your account and all associated tasks! Type "DELETE" to confirm:'
    );
    if (confirmation !== 'DELETE') {
      return;
    }

    setIsSubmitting(true);
    await deleteUserAccount();
    setIsSubmitting(false);
    onClose();
  };

  const getInitials = (userName) => {
    if (!userName) return 'U';
    return userName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '620px' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="brand-icon" style={{ width: '32px', height: '32px' }}>
              <Sliders size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem' }}>Settings & Preferences</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Manage account details, security, and defaults
              </span>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon" aria-label="Close settings">
            <X size={20} />
          </button>
        </div>

        {/* Settings Navigation Tabs */}
        <div className="settings-nav-tabs">
          <button
            className={`settings-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={16} />
            <span>Profile</span>
          </button>
          <button
            className={`settings-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Shield size={16} />
            <span>Security</span>
          </button>
          <button
            className={`settings-tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            <Sliders size={16} />
            <span>Preferences</span>
          </button>
          <button
            className={`settings-tab-btn ${activeTab === 'danger' ? 'active' : ''}`}
            onClick={() => setActiveTab('danger')}
          >
            <AlertTriangle size={16} />
            <span>Danger Zone</span>
          </button>
        </div>

        <div className="modal-body" style={{ minHeight: '300px' }}>
          {message && (
            <div
              className={`alert ${message.type === 'error' ? 'alert-danger' : 'alert-success'}`}
              style={{ animation: 'fadeIn 0.2s ease-out' }}
            >
              {message.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
              <span>{message.text}</span>
            </div>
          )}

          {/* TAB 1: Profile */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className="auth-form">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '0.5rem' }}>
                <div
                  className="user-avatar"
                  style={{ width: '56px', height: '56px', fontSize: '1.25rem' }}
                >
                  {getInitials(name || user?.name)}
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
                    {name || user?.name}
                  </h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="settings-name">Full Name</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <User size={16} style={{ position: 'absolute', left: '0.875rem', color: 'var(--text-muted)' }} />
                  <input
                    id="settings-name"
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="settings-email">Email Address</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '0.875rem', color: 'var(--text-muted)' }} />
                  <input
                    id="settings-email"
                    type="email"
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
                style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : null}
                <span>Save Profile Changes</span>
              </button>
            </form>
          )}

          {/* TAB 2: Security */}
          {activeTab === 'security' && (
            <form onSubmit={handleUpdatePassword} className="auth-form">
              <div className="form-group">
                <label className="form-label" htmlFor="settings-curr-pw">Current Password</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '0.875rem', color: 'var(--text-muted)' }} />
                  <input
                    id="settings-curr-pw"
                    type="password"
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="settings-new-pw">New Password</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '0.875rem', color: 'var(--text-muted)' }} />
                  <input
                    id="settings-new-pw"
                    type="password"
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="settings-confirm-pw">Confirm New Password</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '0.875rem', color: 'var(--text-muted)' }} />
                  <input
                    id="settings-confirm-pw"
                    type="password"
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
                style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : null}
                <span>Update Password</span>
              </button>
            </form>
          )}

          {/* TAB 3: Preferences */}
          {activeTab === 'preferences' && (
            <form onSubmit={handleSavePreferences} className="auth-form">
              <div className="form-group">
                <label className="form-label" htmlFor="pref-priority">Default Task Priority</label>
                <select
                  id="pref-priority"
                  className="form-select"
                  value={defaultPriority}
                  onChange={(e) => setDefaultPriority(e.target.value)}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  This priority level will be pre-selected when creating new tasks.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="pref-status">Default Dashboard Filter</label>
                <select
                  id="pref-status"
                  className="form-select"
                  value={defaultStatus}
                  onChange={(e) => setDefaultStatus(e.target.value)}
                >
                  <option value="all">All Tasks</option>
                  <option value="active">Pending Tasks Only</option>
                  <option value="completed">Completed Tasks Only</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0' }}>
                <input
                  type="checkbox"
                  id="pref-confirm-del"
                  checked={confirmDelete}
                  onChange={(e) => setConfirmDelete(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                />
                <label htmlFor="pref-confirm-del" style={{ fontSize: '0.875rem', cursor: 'pointer' }}>
                  Ask for confirmation before deleting tasks
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
              >
                <span>Save Preferences</span>
              </button>
            </form>
          )}

          {/* TAB 4: Danger Zone */}
          {activeTab === 'danger' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '0.9375rem', marginBottom: '0.25rem' }}>
                    Clear Completed Tasks
                  </h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    Bulk delete all finished tasks to clean up your workspace ({completedCount} completed task{completedCount === 1 ? '' : 's'}).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClearCompleted}
                  className="btn btn-secondary"
                  disabled={isSubmitting || completedCount === 0}
                  style={{ whiteSpace: 'nowrap', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#f87171' }}
                >
                  <Trash2 size={16} />
                  <span>Clear Completed</span>
                </button>
              </div>

              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--danger-bg)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '0.9375rem', color: '#fca5a5', marginBottom: '0.25rem' }}>
                    Delete Account
                  </h4>
                  <p style={{ fontSize: '0.8125rem', color: '#f87171' }}>
                    Permanently delete your profile and all tasks. This action cannot be undone.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="btn btn-danger"
                  disabled={isSubmitting}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <AlertTriangle size={16} />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
