import React, { useState, useEffect, useRef } from 'react';

const DEFAULT_FALLBACK_COVER = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80';
const DEFAULT_FALLBACK_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

export default function PostModal({
  post,
  allPosts = [],
  onClose,
  isBookmarked,
  onToggleBookmark,
  onLikePost,
  onSelectRelatedPost,
  onSharePost,
}) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [isFollowingAuthor, setIsFollowingAuthor] = useState(false);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState(null);

  // Local comments state for this article
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'David Wright',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      time: '2 hours ago',
      content: 'This is exceptionally well explained! Especially the breakdown of state rollbacks in optimistic UI.',
      upvotes: 8,
    },
    {
      id: 2,
      author: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      time: '5 hours ago',
      content: 'Using this in our next production upgrade. Great work on simplifying the concepts!',
      upvotes: 4,
    },
  ]);

  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const modalBodyRef = useRef(null);

  // Keyboard escape listener & body scroll lock
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  // Track reading progress inside modal
  const handleScroll = () => {
    if (!modalBodyRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = modalBodyRef.current;
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setReadingProgress(Math.min(100, Math.max(0, progress)));
  };

  const handleCopyCode = (codeText, index) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newEntry = {
      id: Date.now(),
      author: newCommentName.trim() || 'Tech Reader',
      avatar: DEFAULT_FALLBACK_AVATAR,
      time: 'Just now',
      content: newCommentText.trim(),
      upvotes: 0,
    };

    setComments([newEntry, ...comments]);
    setNewCommentText('');
  };

  const handleUpvoteComment = (commentId) => {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, upvotes: c.upvotes + 1 } : c))
    );
  };

  if (!post) return null;

  // Filter related articles (same category or others)
  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id && (p.category === post.category || p.featured))
    .slice(0, 3);

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      {/* Modal Container */}
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Sticky Reading Progress Bar */}
        <div className="reading-progress-track">
          <div
            className="reading-progress-fill"
            style={{ width: `${readingProgress}%` }}
          />
        </div>

        {/* Modal Header Bar */}
        <div className="modal-header">
          <div className="modal-header__meta">
            <span className="category-tag category-tag--accent">{post.category}</span>
            <span className="modal-header__readtime">⏱️ {post.readTime}</span>
            <span className="modal-header__date">📅 {post.publishDate}</span>
          </div>

          <div className="modal-header__actions">
            {/* Like */}
            <button
              type="button"
              className="action-btn"
              onClick={() => onLikePost(post.id)}
              title="Like Article"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>{post.likes}</span>
            </button>

            {/* Bookmark */}
            <button
              type="button"
              className={`action-btn ${isBookmarked ? 'action-btn--active' : ''}`}
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

            {/* Share */}
            <button
              type="button"
              className="action-btn"
              onClick={() => onSharePost(post)}
              title="Share Article Link"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
              </svg>
            </button>

            {/* Close Modal Button */}
            <button
              type="button"
              className="btn btn--icon modal-close-btn"
              onClick={onClose}
              title="Close Reader (Esc)"
              aria-label="Close Reader"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable Reader Content Body */}
        <div className="modal-body" ref={modalBodyRef} onScroll={handleScroll}>
          {/* Article Title & Hero Cover */}
          <h1 className="reader-title">{post.title}</h1>
          <p className="reader-lead">{post.excerpt}</p>

          <div className="reader-author-row">
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

            <button
              type="button"
              className={`btn btn--sm ${isFollowingAuthor ? 'btn--secondary' : 'btn--outline'}`}
              onClick={() => setIsFollowingAuthor(!isFollowingAuthor)}
            >
              {isFollowingAuthor ? '✓ Following' : '+ Follow Author'}
            </button>
          </div>

          <div className="reader-cover-wrapper">
            <img
              src={post.coverImage || DEFAULT_FALLBACK_COVER}
              alt={post.title}
              className="reader-cover-image"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_FALLBACK_COVER;
              }}
            />
          </div>

          {/* Formatted Article Body */}
          <div className="reader-prose">
            {post.content.split('\n\n').map((block, idx) => {
              if (block.startsWith('### ')) {
                return <h3 key={idx}>{block.replace('### ', '')}</h3>;
              }
              if (block.startsWith('```')) {
                const lines = block.split('\n');
                const lang = lines[0].replace('```', '') || 'javascript';
                const codeBody = lines.slice(1, lines.length - 1).join('\n');
                return (
                  <div key={idx} className="code-block-container">
                    <div className="code-block-header">
                      <span className="code-lang-label">{lang.toUpperCase()}</span>
                      <button
                        type="button"
                        className="copy-code-btn"
                        onClick={() => handleCopyCode(codeBody, idx)}
                      >
                        {copiedCodeIndex === idx ? '✓ Copied!' : 'Copy Code'}
                      </button>
                    </div>
                    <pre className="code-block-pre">
                      <code>{codeBody}</code>
                    </pre>
                  </div>
                );
              }
              return <p key={idx}>{block}</p>;
            })}
          </div>

          {/* Tags */}
          <div className="reader-tags-section">
            <span className="reader-tags-label">Tagged in:</span>
            <div className="reader-tags-list">
              {post.tags.map((tag) => (
                <span key={tag} className="tag-pill">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <hr className="reader-divider" />

          {/* Interactive Comments Section */}
          <section className="comments-section">
            <div className="comments-header">
              <h3 className="comments-title">
                💬 Discussion & Thoughts ({comments.length})
              </h3>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="comment-form">
              <div className="comment-form__inputs">
                <input
                  type="text"
                  placeholder="Your Name (Optional)"
                  className="comment-input comment-input--name"
                  value={newCommentName}
                  onChange={(e) => setNewCommentName(e.target.value)}
                />
                <textarea
                  placeholder="Join the discussion... Share your technical insight or question."
                  className="comment-textarea"
                  rows={3}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  required
                />
              </div>
              <div className="comment-form__footer">
                <button type="submit" className="btn btn--primary btn--sm">
                  Post Comment
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <img
                    src={comment.avatar}
                    alt={comment.author}
                    className="comment-avatar"
                  />
                  <div className="comment-body">
                    <div className="comment-meta">
                      <strong className="comment-author">{comment.author}</strong>
                      <span className="comment-time">{comment.time}</span>
                    </div>
                    <p className="comment-text">{comment.content}</p>
                    <div className="comment-actions">
                      <button
                        type="button"
                        className="comment-upvote-btn"
                        onClick={() => handleUpvoteComment(comment.id)}
                      >
                        ▲ Upvote ({comment.upvotes})
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Related Articles Footer */}
          {relatedPosts.length > 0 && (
            <section className="related-section">
              <h3 className="related-title">📚 Recommended For You</h3>
              <div className="related-grid">
                {relatedPosts.map((relPost) => (
                  <div
                    key={relPost.id}
                    className="related-card"
                    onClick={() => onSelectRelatedPost(relPost)}
                  >
                    <img
                      src={relPost.coverImage}
                      alt={relPost.title}
                      className="related-card__img"
                    />
                    <div className="related-card__content">
                      <span className="category-tag category-tag--xs">{relPost.category}</span>
                      <h4 className="related-card__title">{relPost.title}</h4>
                      <span className="related-card__read">⏱️ {relPost.readTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
