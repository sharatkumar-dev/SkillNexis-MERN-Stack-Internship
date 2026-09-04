import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import StatsBar from '../components/StatsBar';
import TodoFilter from '../components/TodoFilter';
import TodoCard from '../components/TodoCard';
import TodoFormModal from '../components/TodoFormModal';
import api from '../api/axiosInstance';
import { ListTodo, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const DashboardPage = () => {
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Fetch todos from backend
  const fetchTodos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (status !== 'all') params.status = status;
      if (priority !== 'all') params.priority = priority;

      const response = await api.get('/todos', { params });
      if (response.data.success) {
        setTodos(response.data.data.todos || []);
        setStats(response.data.data.stats || { total: 0, completed: 0, pending: 0 });
      }
    } catch (err) {
      console.error('Error fetching todos:', err);
      setError(
        err.response?.data?.message || 'Failed to fetch tasks. Make sure the backend server is running.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [search, status, priority]);

  // Debounced fetch on search or filter change
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchTodos();
    }, 250);
    return () => clearTimeout(handler);
  }, [fetchTodos]);

  // Toggle todo status
  const handleToggle = async (id) => {
    // Optimistic UI update
    setTodos((prev) =>
      prev.map((t) => (t._id === id ? { ...t, isCompleted: !t.isCompleted } : t))
    );

    try {
      const response = await api.patch(`/todos/${id}/toggle`);
      if (response.data.success) {
        const updated = response.data.data;
        showToast(
          `Task marked as ${updated.isCompleted ? 'completed' : 'pending'}`,
          'success'
        );
        // Refresh full stats
        fetchTodos();
      }
    } catch (err) {
      showToast('Failed to update task status.', 'error');
      // Revert if error
      fetchTodos();
    }
  };

  // Save todo (Create or Update)
  const handleSaveTodo = async (todoData, id) => {
    try {
      if (id) {
        // Update existing
        const res = await api.put(`/todos/${id}`, todoData);
        if (res.data.success) {
          showToast('Task updated successfully!');
          fetchTodos();
          return { success: true };
        }
      } else {
        // Create new
        const res = await api.post('/todos', todoData);
        if (res.data.success) {
          showToast('New task created successfully!');
          fetchTodos();
          return { success: true };
        }
      }
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0] ||
        err.response?.data?.message ||
        'Failed to save task.';
      return { success: false, message: msg };
    }
  };

  // Delete todo
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }
    try {
      const res = await api.delete(`/todos/${id}`);
      if (res.data.success) {
        showToast('Task removed.');
        fetchTodos();
      }
    } catch (err) {
      showToast('Failed to delete task.', 'error');
    }
  };

  const handleOpenCreate = () => {
    setEditingTodo(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        <StatsBar stats={stats} />

        <TodoFilter
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          priority={priority}
          setPriority={setPriority}
          onOpenCreate={handleOpenCreate}
        />

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            <Loader2 className="animate-spin" size={36} style={{ margin: '0 auto 1rem', display: 'block' }} />
            <p>Loading your tasks...</p>
          </div>
        ) : todos.length === 0 ? (
          <div className="glass-panel empty-state">
            <div className="empty-icon-wrapper">
              <ListTodo size={32} />
            </div>
            <h3 className="empty-title">
              {search || status !== 'all' || priority !== 'all'
                ? 'No matching tasks found'
                : 'No tasks yet'}
            </h3>
            <p style={{ maxWidth: '400px', margin: '0 auto 1.5rem', fontSize: '0.875rem' }}>
              {search || status !== 'all' || priority !== 'all'
                ? 'Try adjusting your search criteria or filter tags.'
                : 'Stay organized and boost your productivity. Create your first task now!'}
            </p>
            <button onClick={handleOpenCreate} className="btn btn-primary">
              Create a Task
            </button>
          </div>
        ) : (
          <div className="tasks-grid">
            {todos.map((todo) => (
              <TodoCard
                key={todo._id}
                todo={todo}
                onToggle={handleToggle}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      <TodoFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTodo}
        editingTodo={editingTodo}
      />

      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type === 'error' ? 'alert-danger' : ''}`}>
            {toast.type === 'error' ? (
              <AlertCircle size={18} color="#ef4444" />
            ) : (
              <CheckCircle2 size={18} color="#10b981" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
