import React from 'react';
import { useTasks } from '../context/TaskContext';
import { Layers, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const StatsOverview = () => {
  const { stats } = useTasks();

  const cards = [
    {
      label: 'Total Tasks',
      value: stats.total || 0,
      icon: Layers,
      color: '#6366F1',
      bgColor: 'rgba(99, 102, 241, 0.15)'
    },
    {
      label: 'In Progress',
      value: stats.byStatus?.in_progress || 0,
      icon: Clock,
      color: '#0EA5E9',
      bgColor: 'rgba(14, 165, 233, 0.15)'
    },
    {
      label: 'Completed',
      value: stats.byStatus?.completed || 0,
      icon: CheckCircle2,
      color: '#10B981',
      bgColor: 'rgba(16, 185, 129, 0.15)'
    },
    {
      label: 'Urgent / Overdue',
      value: (stats.byPriority?.urgent || 0) + (stats.overdue || 0),
      subtext: `${stats.overdue || 0} overdue`,
      icon: AlertCircle,
      color: '#EF4444',
      bgColor: 'rgba(239, 68, 68, 0.15)'
    }
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="glass-panel stat-card">
            <div className="stat-info">
              <div className="stat-label">{card.label}</div>
              <div className="stat-value" style={{ color: card.color }}>
                {card.value}
              </div>
              {card.subtext && (
                <div style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '0.2rem' }}>
                  {card.subtext}
                </div>
              )}
            </div>
            <div
              className="stat-icon-wrap"
              style={{ backgroundColor: card.bgColor, color: card.color }}
            >
              <Icon size={22} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsOverview;
