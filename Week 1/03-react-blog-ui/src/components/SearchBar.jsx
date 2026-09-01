import React from 'react';

export default function SearchBar({
  searchQuery,
  onSearchChange,
  quickTags = ['React 19', 'TypeScript', 'Redis', 'LLMs', 'CSS3', 'System Design'],
  onSelectTag,
}) {
  return (
    <div className="search-bar-wrapper">
      <div className="search-bar-box">
        <svg className="search-bar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>

        <input
          type="text"
          className="search-bar-input"
          placeholder="Search by article title, topics, tags, author..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        {searchQuery && (
          <button
            type="button"
            className="search-bar-clear"
            onClick={() => onSearchChange('')}
            title="Clear Search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Quick Search Chips */}
      <div className="quick-tags-container">
        <span className="quick-tags-label">Trending Topics:</span>
        <div className="quick-tags-list">
          {quickTags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`quick-tag-chip ${searchQuery.toLowerCase() === tag.toLowerCase() ? 'quick-tag-chip--active' : ''}`}
              onClick={() => onSelectTag(tag)}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
