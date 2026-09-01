import React, { useEffect } from 'react';

const DEFAULT_FALLBACK_COVER = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80';

export default function BookmarksDrawer({
  isOpen,
  onClose,
  bookmarkedPosts = [],
  onReadPost,
  onRemoveBookmark,
  onClearAllBookmarks,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="drawer-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-header__title-group">
            <h3 className="drawer-title">
              🔖 Saved Articles ({bookmarkedPosts.length})
            </h3>
            <span className="drawer-subtitle">Your personal reading library</span>
          </div>

          <button
            type="button"
            className="btn btn--icon drawer-close-btn"
            onClick={onClose}
            aria-label="Close bookmarks"
          >
            ✕
          </button>
        </div>

        {/* Drawer Content Body */}
        <div className="drawer-body">
          {bookmarkedPosts.length > 0 ? (
            <div className="drawer-list">
              {bookmarkedPosts.map((post) => (
                <div key={post.id} className="drawer-item">
                  <img
                    src={post.coverImage || DEFAULT_FALLBACK_COVER}
                    alt={post.title}
                    className="drawer-item__img"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = DEFAULT_FALLBACK_COVER;
                    }}
                    onClick={() => {
                      onClose();
                      onReadPost(post);
                    }}
                  />
                  <div className="drawer-item__content">
                    <div className="drawer-item__meta">
                      <span className="category-tag category-tag--xs">{post.category}</span>
                      <span className="drawer-item__read">⏱️ {post.readTime}</span>
                    </div>

                    <h4
                      className="drawer-item__title"
                      onClick={() => {
                        onClose();
                        onReadPost(post);
                      }}
                    >
                      {post.title}
                    </h4>

                    <div className="drawer-item__actions">
                      <button
                        type="button"
                        className="btn btn--sm btn--primary drawer-read-btn"
                        onClick={() => {
                          onClose();
                          onReadPost(post);
                        }}
                      >
                        Read Now
                      </button>

                      <button
                        type="button"
                        className="drawer-remove-btn"
                        onClick={() => onRemoveBookmark(post.id)}
                        title="Remove bookmark"
                      >
                        Remove 🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="drawer-empty-state">
              <span className="drawer-empty-icon">📭</span>
              <h4 className="drawer-empty-title">No Saved Articles Yet</h4>
              <p className="drawer-empty-desc">
                Click the bookmark icon on any post card to save technical stories for offline reading.
              </p>
              <button
                type="button"
                className="btn btn--primary btn--sm"
                onClick={onClose}
              >
                Explore Articles
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {bookmarkedPosts.length > 0 && (
          <div className="drawer-footer">
            <button
              type="button"
              className="drawer-clear-btn"
              onClick={onClearAllBookmarks}
            >
              Clear All Bookmarks
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
