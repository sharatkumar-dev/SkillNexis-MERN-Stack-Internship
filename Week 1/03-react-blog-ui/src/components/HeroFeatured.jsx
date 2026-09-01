import React from 'react';

const DEFAULT_FALLBACK_COVER = 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&auto=format&fit=crop&q=80';
const DEFAULT_FALLBACK_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

export default function HeroFeatured({
  post,
  onReadPost,
  isBookmarked,
  onToggleBookmark,
  onLikePost,
}) {
  if (!post) return null;

  return (
    <section className="hero-featured">
      <div className="hero-featured__card">
        {/* Visual Cover Media */}
        <div className="hero-featured__media" onClick={() => onReadPost(post)}>
          <img
            src={post.coverImage || DEFAULT_FALLBACK_COVER}
            alt={post.title}
            className="hero-featured__image"
            loading="eager"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DEFAULT_FALLBACK_COVER;
            }}
          />
          <div className="hero-featured__overlay" />
          <span className="hero-featured__badge">
            <span className="pulse-dot" /> FEATURED STORY
          </span>
        </div>

        {/* Content Details */}
        <div className="hero-featured__content">
          <div className="hero-featured__meta-top">
            <span className="category-tag category-tag--accent">{post.category}</span>
            <span className="hero-featured__readtime">⏱️ {post.readTime}</span>
            <span className="hero-featured__date">📅 {post.publishDate}</span>
          </div>

          <h2
            className="hero-featured__title"
            onClick={() => onReadPost(post)}
          >
            {post.title}
          </h2>

          <p className="hero-featured__excerpt">{post.excerpt}</p>

          {/* Tags List */}
          <div className="hero-featured__tags">
            {post.tags.map((tag) => (
              <span key={tag} className="tag-pill">
                #{tag}
              </span>
            ))}
          </div>

          {/* Author Credentials & Action CTAs */}
          <div className="hero-featured__footer">
            <div className="author-badge">
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

            <div className="hero-featured__actions">
              {/* Like Button */}
              <button
                type="button"
                className="action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onLikePost(post.id);
                }}
                title="Like Article"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span>{post.likes}</span>
              </button>

              {/* Bookmark Button */}
              <button
                type="button"
                className={`action-btn ${isBookmarked ? 'action-btn--active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(post.id);
                }}
                title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Article'}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill={isBookmarked ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="2"
                  width="18"
                  height="18"
                >
                  <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                </svg>
              </button>

              {/* Read Post CTA */}
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => onReadPost(post)}
              >
                <span>Read Story</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
