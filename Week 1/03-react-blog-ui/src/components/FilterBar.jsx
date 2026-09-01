import React from 'react';

export default function FilterBar({
  categories = [],
  activeCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  totalResults,
  onResetFilters,
  isFiltered,
}) {
  return (
    <div className="filter-bar-container">
      {/* Category Pills Row */}
      <div className="filter-categories-scroll">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.name;
          return (
            <button
              key={cat.name}
              type="button"
              className={`category-pill ${isActive ? 'category-pill--active' : ''}`}
              onClick={() => onSelectCategory(cat.name)}
            >
              <span>{cat.name}</span>
              <span className="category-pill__count">{cat.count}</span>
            </button>
          );
        })}
      </div>

      {/* Controls & Sorters Bar */}
      <div className="filter-controls-row">
        <div className="results-count-badge">
          <span>Showing <strong>{totalResults}</strong> {totalResults === 1 ? 'article' : 'articles'}</span>
          {isFiltered && (
            <button
              type="button"
              className="reset-filter-btn"
              onClick={onResetFilters}
            >
              Reset Filters ↺
            </button>
          )}
        </div>

        {/* Sort Select Dropdown */}
        <div className="sort-dropdown-wrapper">
          <label htmlFor="blog-sort-select" className="sort-label">
            Sort by:
          </label>
          <select
            id="blog-sort-select"
            className="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="newest">Newest First (Recent)</option>
            <option value="popular">Most Popular (Likes)</option>
            <option value="readTimeAsc">Shortest Read Time</option>
            <option value="readTimeDesc">Longest Read Time</option>
          </select>
        </div>
      </div>
    </div>
  );
}
