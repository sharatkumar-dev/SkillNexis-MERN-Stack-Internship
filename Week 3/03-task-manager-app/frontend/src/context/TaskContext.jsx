import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from './AuthContext';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    byStatus: { todo: 0, in_progress: 0, completed: 0 },
    byPriority: { low: 0, medium: 0, high: 0, urgent: 0 },
    overdue: 0,
    completionRate: 0
  });

  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    category: 'all',
    sortBy: 'createdAt',
    order: 'desc'
  });

  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'grid'
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null, // 'create' | 'edit' | 'delete'
    task: null
  });

  // Fetch task analytics / stats
  const fetchStats = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await axiosClient.get('/tasks/stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error.message);
    }
  }, [isAuthenticated]);

  // Fetch tasks with active query params
  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.priority !== 'all') params.priority = filters.priority;
      if (filters.category !== 'all') params.category = filters.category;
      if (filters.sortBy) params.sortBy = filters.sortBy;
      if (filters.order) params.order = filters.order;

      const res = await axiosClient.get('/tasks', { params });
      if (res.data.success) {
        setTasks(res.data.data.tasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, filters]);

  // Refresh data when user logs in or filters change
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
      fetchStats();
    } else {
      setTasks([]);
    }
  }, [isAuthenticated, fetchTasks, fetchStats]);

  // Create Task
  const createTask = async (taskData) => {
    try {
      const res = await axiosClient.post('/tasks', taskData);
      if (res.data.success) {
        // Optimistic / fast update
        setTasks((prev) => [res.data.data.task, ...prev]);
        fetchStats();
        closeModal();
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to create task';
      return { success: false, error: msg };
    }
  };

  // Update Task
  const updateTask = async (id, updatedData) => {
    try {
      const res = await axiosClient.put(`/tasks/${id}`, updatedData);
      if (res.data.success) {
        setTasks((prev) =>
          prev.map((t) => (t._id === id ? res.data.data.task : t))
        );
        fetchStats();
        closeModal();
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update task';
      return { success: false, error: msg };
    }
  };

  // Fast Update Status (e.g., Kanban movement or status dropdown)
  const updateTaskStatus = async (id, status) => {
    // Optimistic local state update
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, status } : t))
    );

    try {
      const res = await axiosClient.patch(`/tasks/${id}/status`, { status });
      if (res.data.success) {
        fetchStats();
      }
    } catch (error) {
      console.error('Failed to patch task status:', error.message);
      // Rollback
      fetchTasks();
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    try {
      const res = await axiosClient.delete(`/tasks/${id}`);
      if (res.data.success) {
        setTasks((prev) => prev.filter((t) => t._id !== id));
        fetchStats();
        closeModal();
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to delete task';
      return { success: false, error: msg };
    }
  };

  // Modal Handlers
  const openCreateModal = () => {
    setModalState({ isOpen: true, type: 'create', task: null });
  };

  const openEditModal = (task) => {
    setModalState({ isOpen: true, type: 'edit', task });
  };

  const openDeleteModal = (task) => {
    setModalState({ isOpen: true, type: 'delete', task });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, type: null, task: null });
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      priority: 'all',
      category: 'all',
      sortBy: 'createdAt',
      order: 'desc'
    });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        stats,
        isLoading,
        filters,
        viewMode,
        modalState,
        setViewMode,
        updateFilter,
        resetFilters,
        fetchTasks,
        fetchStats,
        createTask,
        updateTask,
        updateTaskStatus,
        deleteTask,
        openCreateModal,
        openEditModal,
        openDeleteModal,
        closeModal
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
