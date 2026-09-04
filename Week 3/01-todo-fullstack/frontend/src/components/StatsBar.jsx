import React from 'react';
import { ListTodo, Clock, CheckCircle2, TrendingUp } from 'lucide-react';

const StatsBar = ({ stats }) => {
  const { total = 0, completed = 0, pending = 0 } = stats || {};
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="stats-grid">
      <div className="stat-card glass-panel total">
        <div className="stat-info">
          <div className="stat-label">Total Tasks</div>
          <div className="stat-value">{total}</div>
        </div>
        <div className="stat-icon-wrapper">
          <ListTodo size={22} />
        </div>
      </div>

      <div className="stat-card glass-panel pending">
        <div className="stat-info">
          <div className="stat-label">Pending</div>
          <div className="stat-value">{pending}</div>
        </div>
        <div className="stat-icon-wrapper">
          <Clock size={22} />
        </div>
      </div>

      <div className="stat-card glass-panel completed">
        <div className="stat-info">
          <div className="stat-label">Completed</div>
          <div className="stat-value">{completed}</div>
        </div>
        <div className="stat-icon-wrapper">
          <CheckCircle2 size={22} />
        </div>
      </div>

      <div className="stat-card glass-panel progress">
        <div className="stat-info">
          <div className="stat-label">Completion</div>
          <div className="stat-value">{rate}%</div>
        </div>
        <div className="stat-icon-wrapper">
          <TrendingUp size={22} />
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
