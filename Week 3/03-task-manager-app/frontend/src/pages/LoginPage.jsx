import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, LogIn, Sparkles, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setIsLoading(true);

    // Try logging into demo account first
    let result = await login('demo@taskmanager.com', 'password123');
    if (!result.success) {
      // If demo account doesn't exist yet, auto-register it
      result = await register('Alex Mercer', 'demo@taskmanager.com', 'password123');
    }

    setIsLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <CheckSquare size={28} />
          </div>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to manage your tasks & workflow</p>
        </div>

        {error && (
          <div className="alert-box alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="form-control"
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={isLoading}
            id="btn-login-submit"
          >
            <LogIn size={16} />
            <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Quick Demo Fill & Login */}
        <div className="demo-login-box">
          <div>
            <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#f3f4f6' }}>
              Quick Evaluation?
            </div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
              One-click instant login with demo account
            </div>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="btn btn-secondary btn-sm"
            disabled={isLoading}
            id="btn-demo-login"
          >
            <Sparkles size={14} color="#6366F1" />
            <span>Demo Login</span>
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.85rem', color: '#9ca3af' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#818cf8', fontWeight: 500, textDecoration: 'none' }}>
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
