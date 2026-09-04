import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { AlertTriangle, Trash2, X } from 'lucide-react';

const DeleteConfirmModal = () => {
  const { modalState, closeModal, deleteTask } = useTasks();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!modalState.isOpen || modalState.type !== 'delete' || !modalState.task) {
    return null;
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteTask(modalState.task._id);
    setIsDeleting(false);
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#EF4444' }}>
            <AlertTriangle size={20} />
            <h3 style={{ fontSize: '1.1rem' }}>Delete Task</h3>
          </div>
          <button onClick={closeModal} className="action-icon-btn" title="Close">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: '#d1d5db', fontSize: '0.95rem' }}>
            Are you sure you want to delete <strong style={{ color: '#fff' }}>"{modalState.task.title}"</strong>?
          </p>
          <p style={{ color: '#9ca3af', fontSize: '0.825rem', marginTop: '0.25rem' }}>
            This action cannot be undone and will permanently remove the task from your board.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            onClick={closeModal}
            className="btn btn-secondary"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="btn btn-danger"
            disabled={isDeleting}
            id="btn-confirm-delete"
          >
            <Trash2 size={16} />
            <span>{isDeleting ? 'Deleting...' : 'Delete Task'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
