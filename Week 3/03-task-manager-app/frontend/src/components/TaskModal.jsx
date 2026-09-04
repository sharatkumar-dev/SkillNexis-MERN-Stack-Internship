import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { X, Save, PlusCircle } from 'lucide-react';

const TaskModal = () => {
  const { modalState, closeModal, createTask, updateTask } = useTasks();
  const isEditing = modalState.type === 'edit';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    category: 'Work',
    dueDate: ''
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing && modalState.task) {
      const { task } = modalState;
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        category: task.category || 'Work',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        category: 'Work',
        dueDate: ''
      });
    }
    setError('');
  }, [modalState, isEditing]);

  if (!modalState.isOpen || (modalState.type !== 'create' && modalState.type !== 'edit')) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Please provide a task title');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const payload = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
    };

    let result;
    if (isEditing) {
      result = await updateTask(modalState.task._id, payload);
    } else {
      result = await createTask(payload);
    }

    setIsSubmitting(false);
    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEditing ? 'Edit Task' : 'Create New Task'}</h3>
          <button onClick={closeModal} className="action-icon-btn" title="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="alert-box alert-error" style={{ marginBottom: 0 }}>
                <span>{error}</span>
              </div>
            )}

            {/* Title */}
            <div className="form-group">
              <label htmlFor="task-title">Task Title *</label>
              <input
                id="task-title"
                name="title"
                type="text"
                className="form-control"
                placeholder="e.g. Prepare client project presentation"
                value={formData.title}
                onChange={handleChange}
                autoFocus
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="task-desc">Description</label>
              <textarea
                id="task-desc"
                name="description"
                rows={3}
                className="form-control"
                placeholder="Add more details, checklists, or context..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Status & Priority Row */}
            <div className="form-grid-2">
              <div className="form-group">
                <label htmlFor="task-status">Status</label>
                <select
                  id="task-status"
                  name="status"
                  className="form-control"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="task-priority">Priority</label>
                <select
                  id="task-priority"
                  name="priority"
                  className="form-control"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Category & Due Date Row */}
            <div className="form-grid-2">
              <div className="form-group">
                <label htmlFor="task-category">Category</label>
                <select
                  id="task-category"
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Study">Study</option>
                  <option value="Finance">Finance</option>
                  <option value="Health">Health</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="task-due-date">Due Date</label>
                <input
                  id="task-due-date"
                  name="dueDate"
                  type="date"
                  className="form-control"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={closeModal}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              id="btn-submit-task"
            >
              {isEditing ? <Save size={16} /> : <PlusCircle size={16} />}
              <span>{isSubmitting ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
