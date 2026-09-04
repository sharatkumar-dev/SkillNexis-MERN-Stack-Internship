import React from 'react';
import { Search, Plus, Filter } from 'lucide-react';

const TodoFilter = ({
  search,
  setSearch,
  status,
  setStatus,
  priority,
  setPriority,
  onOpenCreate
}) => {
  return (
    <div className="filter-bar glass-panel">
      <div className="search-box">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search tasks by title or description..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="filter-controls">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${status === 'all' ? 'active' : ''}`}
            onClick={() => setStatus('all')}
          >
            All
          </button>
          <button
            className={`filter-tab ${status === 'active' ? 'active' : ''}`}
            onClick={() => setStatus('active')}
          >
            Pending
          </button>
          <button
            className={`filter-tab ${status === 'completed' ? 'active' : ''}`}
            onClick={() => setStatus('completed')}
          >
            Completed
          </button>
        </div>

        <select
          className="select-filter"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          aria-label="Filter by priority"
        >
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>

        <button onClick={onOpenCreate} className="btn btn-primary">
          <Plus size={18} />
          <span>New Task</span>
        </button>
      </div>
    </div>
  );
};

export default TodoFilter;
