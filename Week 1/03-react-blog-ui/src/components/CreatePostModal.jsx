import React, { useState, useEffect } from 'react';

const PRESET_COVERS = [
  { label: 'React & UI Neon', url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&auto=format&fit=crop&q=80' },
  { label: 'TypeScript / Code', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Cloud & Servers', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80' },
  { label: 'AI & Neural Tech', url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=80' },
  { label: 'System Design', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80' },
];

export default function CreatePostModal({
  isOpen,
  onClose,
  onSubmitPost,
  categories = ['React', 'JavaScript', 'CSS & UI', 'Backend', 'AI & Cloud', 'System Design'],
}) {
  const [activeTab, setActiveTab] = useState('edit'); // 'edit' | 'preview'
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('React');
  const [readTime, setReadTime] = useState('5 min read');
  const [authorName, setAuthorName] = useState('Alex Morgan');
  const [authorRole, setAuthorRole] = useState('Frontend Engineer');
  const [coverImage, setCoverImage] = useState(PRESET_COVERS[0].url);
  const [customCoverUrl, setCustomCoverUrl] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tagsInput, setTagsInput] = useState('React, Frontend, WebDev');
  const [content, setContent] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      setErrorMessage('Please fill in all required fields (Title, Summary, and Article Body).');
      return;
    }

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newPost = {
      id: `post-${Date.now()}`,
      title: title.trim(),
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      tags: tagsArray.length > 0 ? tagsArray : ['Tech', category],
      author: {
        name: authorName.trim() || 'Alex Morgan',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: authorRole.trim() || 'Contributor',
      },
      publishDate: new Date().toISOString().split('T')[0],
      readTime,
      coverImage: customCoverUrl.trim() || coverImage,
      excerpt: excerpt.trim(),
      content: content.trim(),
      likes: 1,
      commentsCount: 0,
      featured: false,
    };

    onSubmitPost(newPost);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container modal-container--create" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="create-modal-title-group">
            <h2 className="create-modal-title">✍️ Publish New Article</h2>
            <span className="create-modal-subtitle">Share engineering insights with the community</span>
          </div>

          {/* Tab Switcher */}
          <div className="tab-pill-group">
            <button
              type="button"
              className={`tab-pill-btn ${activeTab === 'edit' ? 'tab-pill-btn--active' : ''}`}
              onClick={() => setActiveTab('edit')}
            >
              Edit
            </button>
            <button
              type="button"
              className={`tab-pill-btn ${activeTab === 'preview' ? 'tab-pill-btn--active' : ''}`}
              onClick={() => setActiveTab('preview')}
            >
              Live Preview
            </button>
          </div>

          <button
            type="button"
            className="btn btn--icon modal-close-btn"
            onClick={onClose}
            aria-label="Close form"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {errorMessage && <div className="form-error-alert">{errorMessage}</div>}

          {activeTab === 'edit' ? (
            <form onSubmit={handleSubmit} className="create-post-form">
              {/* Title & Category Row */}
              <div className="form-grid-2">
                <div className="form-field">
                  <label className="form-label" htmlFor="post-title">
                    Article Title <span className="req">*</span>
                  </label>
                  <input
                    id="post-title"
                    type="text"
                    className="form-input"
                    placeholder="e.g., Deep Dive into React Server Components..."
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setErrorMessage('');
                    }}
                    required
                  />
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="post-category">
                    Category <span className="req">*</span>
                  </label>
                  <select
                    id="post-category"
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Author & Read Time */}
              <div className="form-grid-3">
                <div className="form-field">
                  <label className="form-label" htmlFor="post-author-name">
                    Author Name
                  </label>
                  <input
                    id="post-author-name"
                    type="text"
                    className="form-input"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="post-author-role">
                    Author Role / Title
                  </label>
                  <input
                    id="post-author-role"
                    type="text"
                    className="form-input"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="post-read-time">
                    Estimated Read Time
                  </label>
                  <input
                    id="post-read-time"
                    type="text"
                    className="form-input"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Cover Image Preset Picker */}
              <div className="form-field">
                <label className="form-label">Select Cover Image Artwork:</label>
                <div className="preset-cover-grid">
                  {PRESET_COVERS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      className={`preset-cover-card ${coverImage === preset.url && !customCoverUrl ? 'preset-cover-card--selected' : ''}`}
                      onClick={() => {
                        setCoverImage(preset.url);
                        setCustomCoverUrl('');
                      }}
                    >
                      <img src={preset.url} alt={preset.label} />
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags Input */}
              <div className="form-field">
                <label className="form-label" htmlFor="post-tags">
                  Tags (Comma separated)
                </label>
                <input
                  id="post-tags"
                  type="text"
                  className="form-input"
                  placeholder="e.g. React 19, Hooks, Performance, WebDev"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                />
              </div>

              {/* Summary / Excerpt */}
              <div className="form-field">
                <label className="form-label" htmlFor="post-excerpt">
                  Short Summary / Excerpt <span className="req">*</span>
                </label>
                <textarea
                  id="post-excerpt"
                  className="form-textarea"
                  rows={2}
                  placeholder="A concise 1-2 sentence overview of your article..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  required
                />
              </div>

              {/* Full Article Content */}
              <div className="form-field">
                <label className="form-label" htmlFor="post-content">
                  Article Body (Supports Headings with <code>### Heading</code> and Code with <code>```code```</code>) <span className="req">*</span>
                </label>
                <textarea
                  id="post-content"
                  className="form-textarea form-textarea--body"
                  rows={8}
                  placeholder="Write your article content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>

              {/* Form Action Controls */}
              <div className="form-actions-footer">
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary">
                  🚀 Publish Article
                </button>
              </div>
            </form>
          ) : (
            /* Live Preview Mode */
            <div className="preview-container">
              <span className="category-tag category-tag--accent">{category}</span>
              <h1 className="reader-title">{title || 'Untitled Article Title'}</h1>
              <p className="reader-lead">{excerpt || 'Your short article summary will appear here.'}</p>
              
              <div className="reader-author-row">
                <div className="author-badge">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                    alt={authorName}
                    className="author-badge__avatar"
                  />
                  <div className="author-badge__info">
                    <span className="author-badge__name">{authorName || 'Alex Morgan'}</span>
                    <span className="author-badge__role">{authorRole || 'Contributor'} • {readTime}</span>
                  </div>
                </div>
              </div>

              <div className="reader-cover-wrapper">
                <img
                  src={customCoverUrl || coverImage}
                  alt="Preview Cover"
                  className="reader-cover-image"
                />
              </div>

              <div className="reader-prose">
                {(content || 'Article content body will render here.').split('\n\n').map((block, i) => (
                  <p key={i}>{block}</p>
                ))}
              </div>

              <div className="form-actions-footer" style={{ marginTop: '2rem' }}>
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => setActiveTab('edit')}
                >
                  ← Back to Editor
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
