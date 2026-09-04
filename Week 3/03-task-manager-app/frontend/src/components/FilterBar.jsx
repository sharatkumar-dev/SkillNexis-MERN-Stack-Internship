import React from 'react';
import { useTasks } from '../context/TaskContext';
import { Search, SlidersHorizontal, LayoutGrid, Kanban, X, RotateCcw } from 'lucide-react';

const FilterBar = () => {
  const { filters, updateFilter, resetFilters, viewMode, setViewMode } = useTasks();

  const statusOptions = [
    { label: 'All', value: 'all' },
    { label: 'To Do', value: 'todo' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' }
  ];

  const hasActiveFilters =
    filters.search !== '' ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.category !== 'all' ||
    filters.sortBy !== 'createdAt';

  return (
    <div className="glass-panel filter-bar">
      {/* Top Row: Search Input & Controls */}
      <div className="filter-row-top">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            id="input-task-search"
          />
          {filters.search && (
            <button
              onClick={() => updateFilter('search', '')}
              className="action-icon-btn"
              style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)' }}
              title="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* View Toggle (Kanban vs Grid) */}
        <div className="view-toggle">
          <button
            onClick={() => setViewMode('kanban')}
            className={`view-btn ${viewMode === 'kanban' ? 'active' : ''}`}
            title="Kanban Board View"
            id="btn-view-kanban"
          >
            <Kanban size={17} style={{ marginRight: '0.35rem' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>Kanban</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            title="Grid / List View"
            id="btn-view-grid"
          >
            <LayoutGrid size={17} style={{ marginRight: '0.35rem' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>Grid</span>
          </button>
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="btn btn-secondary btn-sm"
            title="Reset all filters"
            id="btn-reset-filters"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Bottom Row: Status pills, Priority dropdown, Category dropdown, Sort selector */}
      <div className="filter-row-bottom">
        {/* Status Pills */}
        <div className="filter-group">
          <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 500 }}>Status:</span>
          <div className="filter-pills">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => updateFilter('status', opt.value)}
                className={`filter-pill ${filters.status === opt.value ? 'active' : ''}`}
                id={`filter-status-${opt.value}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dropdowns Group */}
        <div className="filter-group">
          {/* Priority Select */}
          <select
            value={filters.priority}
            onChange={(e) => updateFilter('priority', e.target.value)}
            className="custom-select"
            id="select-priority-filter"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Category Select */}
          <select
            value={filters.category}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="custom-select"
            id="select-category-filter"
          >
            <option value="all">All Categories</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Study">Study</option>
            <option value="Finance">Finance</option>
            <option value="Health">Health</option>
            <option value="Other">Other</option>
          </select>

          {/* Sort By Select */}
          <select
            value={`${filters.sortBy}-${filters.order}`}
            onChange={(e) => {
              const [sortBy, order] = e.target.value.split('-');
              updateFilter('sortBy', sortBy);
              updateFilter('order', order);
            }}
            className="custom-select"
            id="select-sort-filter"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="dueDate-asc">Due Date (Earliest)</option>
            <option value="dueDate-desc">Due Date (Latest)</option>
            <option value="title-asc">Title (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
