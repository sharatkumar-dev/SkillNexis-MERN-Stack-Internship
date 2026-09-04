import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileQuestion } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="auth-wrapper">
      <div className="auth-card glass-panel" style={{ textAlign: 'center' }}>
        <div className="empty-icon-wrapper" style={{ margin: '0 auto 1.5rem' }}>
          <FileQuestion size={36} />
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>404</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Oops! The page you are looking for does not exist.
        </p>
        <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex' }}>
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
