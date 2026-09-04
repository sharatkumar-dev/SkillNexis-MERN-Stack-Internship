import React from 'react';
import { useTasks } from '../context/TaskContext';
import { Calendar, Edit3, Trash2, Tag, AlertTriangle } from 'lucide-react';

const TaskCard = ({ task }) => {
  const { openEditModal, openDeleteModal, updateTaskStatus } = useTasks();

  const isCompleted = task.status === 'completed';
  const isOverdue =
    task.dueDate &&
    !isCompleted &&
    new Date(task.dueDate).getTime() < new Date().setHours(0, 0, 0, 0);

  const formatDueDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const getPriorityAccent = (priority) => {
    switch (priority) {
      case 'urgent':
        return '#EF4444';
      case 'high':
        return '#F97316';
      case 'medium':
        return '#38BDF8';
      case 'low':
      default:
        return '#94A3B8';
    }
  };

  return (
    <div className="task-card">
      <div
        className="task-card-accent"
        style={{ backgroundColor: getPriorityAccent(task.priority) }}
      />

      <div className="task-card-header">
        <h4 className={`task-card-title ${isCompleted ? 'completed' : ''}`}>
          {task.title}
        </h4>
        <span className={`badge badge-${task.priority}`}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="task-card-desc">{task.description}</p>
      )}

      <div className="task-card-meta">
        {/* Category Badge */}
        {task.category && (
          <span className="badge badge-category">
            <Tag size={12} />
            {task.category}
          </span>
        )}

        {/* Due Date Indicator */}
        {task.dueDate && (
          <span className={`badge-due ${isOverdue ? 'overdue' : ''}`}>
            {isOverdue ? <AlertTriangle size={13} /> : <Calendar size={13} />}
            <span>{formatDueDate(task.dueDate)}</span>
          </span>
        )}
      </div>

      <div className="task-card-footer">
        {/* Status Quick Selector */}
        <select
          value={task.status}
          onChange={(e) => updateTaskStatus(task._id, e.target.value)}
          className="task-status-select"
          id={`select-status-${task._id}`}
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        {/* Edit / Delete Action Buttons */}
        <div className="task-card-actions">
          <button
            onClick={() => openEditModal(task)}
            className="action-icon-btn"
            title="Edit Task"
            id={`btn-edit-${task._id}`}
          >
            <Edit3 size={15} />
          </button>
          <button
            onClick={() => openDeleteModal(task)}
            className="action-icon-btn delete"
            title="Delete Task"
            id={`btn-delete-${task._id}`}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
