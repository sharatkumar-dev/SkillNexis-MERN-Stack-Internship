import React from 'react';
import { Check, Calendar, Edit2, Trash2, AlertCircle } from 'lucide-react';

const TodoCard = ({ todo, onToggle, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (dateString) => {
    if (!dateString || todo.isCompleted) return false;
    return new Date(dateString) < new Date();
  };

  return (
    <div className={`todo-card glass-panel priority-${todo.priority} ${todo.isCompleted ? 'completed' : ''}`}>
      <div className="todo-header">
        <button
          onClick={() => onToggle(todo._id)}
          className={`checkbox-toggle ${todo.isCompleted ? 'checked' : ''}`}
          title={todo.isCompleted ? 'Mark as pending' : 'Mark as completed'}
          aria-label={todo.isCompleted ? 'Mark as pending' : 'Mark as completed'}
        >
          {todo.isCompleted && <Check size={14} strokeWidth={3} />}
        </button>

        <div className="todo-content">
          <h3 className="todo-title">{todo.title}</h3>
          {todo.description && (
            <p className="todo-desc">{todo.description}</p>
          )}
        </div>
      </div>

      <div className="todo-footer">
        <div className="meta-badges">
          <span className={`badge badge-${todo.priority}`}>
            {todo.priority}
          </span>

          {todo.dueDate && (
            <span
              className="badge badge-date"
              style={{
                color: isOverdue(todo.dueDate) ? '#f87171' : 'inherit',
                borderColor: isOverdue(todo.dueDate) ? 'rgba(239, 68, 68, 0.4)' : 'transparent'
              }}
            >
              {isOverdue(todo.dueDate) ? <AlertCircle size={12} /> : <Calendar size={12} />}
              {formatDate(todo.dueDate)}
            </span>
          )}
        </div>

        <div className="card-actions">
          <button
            onClick={() => onEdit(todo)}
            className="btn-icon"
            title="Edit task"
            aria-label="Edit task"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(todo._id, todo.title)}
            className="btn-icon"
            title="Delete task"
            aria-label="Delete task"
            style={{ color: '#f87171' }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoCard;
