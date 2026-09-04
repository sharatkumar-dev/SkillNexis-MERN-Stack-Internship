import React from 'react';
import { useTasks } from '../context/TaskContext';
import TaskCard from './TaskCard';
import { Circle, Clock, CheckCircle2, Plus } from 'lucide-react';

const TaskKanban = () => {
  const { tasks, openCreateModal } = useTasks();

  const columns = [
    {
      id: 'todo',
      title: 'To Do',
      icon: Circle,
      color: '#F59E0B',
      tasks: tasks.filter((t) => t.status === 'todo')
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      icon: Clock,
      color: '#0EA5E9',
      tasks: tasks.filter((t) => t.status === 'in_progress')
    },
    {
      id: 'completed',
      title: 'Completed',
      icon: CheckCircle2,
      color: '#10B981',
      tasks: tasks.filter((t) => t.status === 'completed')
    }
  ];

  return (
    <div className="kanban-board">
      {columns.map((column) => {
        const Icon = column.icon;
        return (
          <div key={column.id} className="kanban-column" id={`kanban-col-${column.id}`}>
            <div className="column-header">
              <div className="column-title" style={{ color: column.color }}>
                <Icon size={18} />
                <span>{column.title}</span>
                <span className="column-badge">{column.tasks.length}</span>
              </div>
              <button
                onClick={openCreateModal}
                className="action-icon-btn"
                title={`Add task to ${column.title}`}
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="task-list-column">
              {column.tasks.length > 0 ? (
                column.tasks.map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))
              ) : (
                <div
                  style={{
                    padding: '2.5rem 1rem',
                    textAlign: 'center',
                    color: '#6b7280',
                    fontSize: '0.85rem',
                    border: '1px dashed rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px'
                  }}
                >
                  No {column.title.toLowerCase()} tasks
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskKanban;
