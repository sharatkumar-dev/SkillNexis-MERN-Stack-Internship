import React from 'react';

const DEFAULT_FALLBACK_COVER = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80';
const DEFAULT_FALLBACK_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

export default function PostCard({
  post,
  onReadPost,
  isBookmarked,
  onToggleBookmark,
  onLikePost,
  onSharePost,
}) {
  return (
    <article className="post-card" onClick={() => onReadPost(post)}>
      {/* Cover Image Container */}
      <div className="post-card__media">
        <img
          src={post.coverImage || DEFAULT_FALLBACK_COVER}
          alt={post.title}
          className="post-card__image"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = DEFAULT_FALLBACK_COVER;
          }}
        />
        <div className="post-card__tags-floating">
          <span className="category-tag">{post.category}</span>
          <span className="readtime-pill">{post.readTime}</span>
        </div>
      </div>

      {/* Post Details */}
      <div className="post-card__body">
        <div className="post-card__meta-date">
          <span>📅 {post.publishDate}</span>
          {post.featured && <span className="featured-mini-badge">★ Featured</span>}
        </div>

        <h3 className="post-card__title">
          {post.title}
        </h3>

        <p className="post-card__excerpt">
          {post.excerpt}
        </p>

        {/* Tags pills */}
        <div className="post-card__tags">
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag-pill tag-pill--sm">
              #{tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="tag-pill tag-pill--sm tag-pill--muted">
              +{post.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Author & Interactive Buttons */}
      <div className="post-card__footer" onClick={(e) => e.stopPropagation()}>
        <div className="author-badge author-badge--sm">
          <img
            src={post.author.avatar || DEFAULT_FALLBACK_AVATAR}
            alt={post.author.name}
            className="author-badge__avatar"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DEFAULT_FALLBACK_AVATAR;
            }}
          />
          <div className="author-badge__info">
            <span className="author-badge__name">{post.author.name}</span>
            <span className="author-badge__role">{post.author.role}</span>
          </div>
        </div>

        <div className="post-card__actions">
          {/* Like Button */}
          <button
            type="button"
            className="action-btn action-btn--sm"
            onClick={() => onLikePost(post.id)}
            title="Like this article"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span>{post.likes}</span>
          </button>

          {/* Bookmark Button */}
          <button
            type="button"
            className={`action-btn action-btn--sm ${isBookmarked ? 'action-btn--active' : ''}`}
            onClick={() => onToggleBookmark(post.id)}
            title={isBookmarked ? 'Remove Bookmark' : 'Save Bookmark'}
          >
            <svg
              viewBox="0 0 24 24"
              fill={isBookmarked ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
              width="16"
              height="16"
            >
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
            </svg>
          </button>

          {/* Share Button */}
          <button
            type="button"
            className="action-btn action-btn--sm"
            onClick={() => onSharePost(post)}
            title="Share article link"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
