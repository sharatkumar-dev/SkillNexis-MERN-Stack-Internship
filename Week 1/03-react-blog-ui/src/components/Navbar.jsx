import React from 'react';

export default function Navbar({
  theme,
  onToggleTheme,
  bookmarksCount,
  onOpenBookmarks,
  onOpenCreatePost,
  searchQuery,
  onSearchChange,
}) {
  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand & Logo */}
        <div className="navbar-brand">
          <a href="#" className="brand-logo" aria-label="DevPulse Home">
            <span className="brand-icon">⚡</span>
            <div className="brand-text">
              <h1 className="brand-title">DevPulse</h1>
              <span className="brand-badge">Tech Chronicle</span>
            </div>
          </a>
          <span className="brand-internship-tag">SkillNexis • Week 1 Mini Project</span>
        </div>

        {/* Search Bar in Navbar */}
        <div className="navbar-search">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            className="navbar-search-input"
            placeholder="Search articles, topics, authors..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="navbar-search-clear"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="navbar-actions">
          {/* Write New Post Button */}
          <button
            type="button"
            className="btn btn--primary btn--sm nav-write-btn"
            onClick={onOpenCreatePost}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>Write Story</span>
          </button>

          {/* Bookmarks Drawer Trigger */}
          <button
            type="button"
            className="btn btn--icon nav-bookmark-btn"
            onClick={onOpenBookmarks}
            title="View Saved Bookmarks"
            aria-label="View Saved Bookmarks"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
            </svg>
            {bookmarksCount > 0 && (
              <span className="bookmark-badge-count">{bookmarksCount}</span>
            )}
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            className="btn btn--icon theme-toggle-btn"
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle visual theme"
          >
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
