import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { CheckSquare, Plus, LogOut, Activity } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { openCreateModal, stats } = useTasks();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand-link">
          <div className="brand-icon">
            <CheckSquare size={22} />
          </div>
          <span className="brand-font">TaskFlow</span>
        </Link>

        {user && (
          <div className="user-nav-actions">
            {/* Completion rate badge */}
            <div
              className="user-pill"
              title={`${stats.completionRate}% of your tasks are completed`}
              style={{ display: 'flex', gap: '0.4rem', fontSize: '0.8rem', color: '#9ca3af' }}
            >
              <Activity size={15} color="#10B981" />
              <span>{stats.completionRate}% Done</span>
            </div>

            <button
              onClick={openCreateModal}
              className="btn btn-primary btn-sm"
              id="btn-create-task-nav"
            >
              <Plus size={16} />
              <span>New Task</span>
            </button>

            {/* User Profile Pill */}
            <div className="user-pill">
              <div
                className="user-avatar"
                style={{ backgroundColor: user.avatarColor || '#6366F1' }}
              >
                {getInitials(user.name)}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#f3f4f6' }}>
                {user.name}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="btn btn-ghost btn-sm"
              title="Sign Out"
              id="btn-logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
