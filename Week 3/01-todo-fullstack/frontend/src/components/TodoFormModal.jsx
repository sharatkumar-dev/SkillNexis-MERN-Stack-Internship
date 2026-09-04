import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

const TodoFormModal = ({ isOpen, onClose, onSave, editingTodo }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title || '');
      setDescription(editingTodo.description || '');
      setPriority(editingTodo.priority || 'medium');
      setDueDate(
        editingTodo.dueDate
          ? new Date(editingTodo.dueDate).toISOString().split('T')[0]
          : ''
      );
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    }
    setError('');
  }, [editingTodo, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a task title.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const payload = {
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null
    };

    const result = await onSave(payload, editingTodo?._id);
    setIsSubmitting(false);

    if (result && !result.success) {
      setError(result.message || 'Failed to save task.');
    } else {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{editingTodo && editingTodo._id ? 'Edit Task' : 'Create New Task'}</h3>
          <button onClick={onClose} className="btn-icon" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger">
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="todo-title">
                Task Title *
              </label>
              <input
                id="todo-title"
                type="text"
                className="form-input"
                placeholder="e.g., Integrate Redux with Next.js"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                maxLength={120}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="todo-desc">
                Description
              </label>
              <textarea
                id="todo-desc"
                className="form-textarea"
                placeholder="Add optional notes, steps, or acceptance criteria..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="todo-priority">
                  Priority
                </label>
                <select
                  id="todo-priority"
                  className="form-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="todo-due-date">
                  Due Date
                </label>
                <input
                  id="todo-due-date"
                  type="date"
                  className="form-input"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{editingTodo && editingTodo._id ? 'Update Task' : 'Create Task'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoFormModal;
