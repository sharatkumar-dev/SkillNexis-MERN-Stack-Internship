import React from 'react';
import { useTasks } from '../context/TaskContext';
import StatsOverview from '../components/StatsOverview';
import FilterBar from '../components/FilterBar';
import TaskKanban from '../components/TaskKanban';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { ClipboardList, Plus } from 'lucide-react';

const DashboardPage = () => {
  const { tasks, isLoading, viewMode, openCreateModal, filters } = useTasks();

  const isFiltering =
    filters.search ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.category !== 'all';

  return (
    <div className="main-content">
      {/* Metrics Top Section */}
      <StatsOverview />

      {/* Filter and Control Bar */}
      <FilterBar />

      {/* Main Task Display Area */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#9ca3af' }}>
          <p>Loading your workspace...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <ClipboardList size={30} />
          </div>
          <h3 className="empty-state-title">
            {isFiltering ? 'No tasks matched your filter criteria' : 'No tasks created yet'}
          </h3>
          <p className="empty-state-desc">
            {isFiltering
              ? 'Try modifying your search keywords, clear active status filters, or create a new task.'
              : 'Organize your goals, projects, and daily to-dos in one centralized workspace.'}
          </p>
          <button
            onClick={openCreateModal}
            className="btn btn-primary"
            id="btn-empty-create-task"
          >
            <Plus size={16} />
            <span>Create Your First Task</span>
          </button>
        </div>
      ) : viewMode === 'kanban' ? (
        <TaskKanban />
      ) : (
        <div className="task-grid-view">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      )}

      {/* Modals */}
      <TaskModal />
      <DeleteConfirmModal />
    </div>
  );
};

export default DashboardPage;
