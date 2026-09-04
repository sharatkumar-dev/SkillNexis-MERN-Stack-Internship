import React, { useEffect } from 'react';
import { X, Download, Copy, Trash2, Calendar, FileText, HardDrive, Tag } from 'lucide-react';
import { getFullImageUrl, downloadImageFile } from '../api/imageApi';

const ImageModal = ({ image, onClose, onDelete, showToast }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!image) return null;

  const fullUrl = getFullImageUrl(image.url);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    showToast('Direct image link copied to clipboard!', 'info');
  };

  const handleDownload = async () => {
    try {
      showToast(`Downloading "${image.originalName}"...`, 'info');
      await downloadImageFile(image._id, image.originalName);
      showToast(`Downloaded "${image.originalName}" successfully!`, 'success');
    } catch (err) {
      console.error('Download error:', err);
      showToast('Failed to download image. Please try again.', 'error');
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${image.title}"?`)) {
      onDelete(image._id);
      onClose();
    }
  };

  const formattedDate = new Date(image.createdAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h2 style={{ fontSize: '1.25rem' }}>{image.title}</h2>
            <span className="category-tag">{image.category}</span>
          </div>
          <button
            className="btn btn-secondary btn-icon"
            onClick={onClose}
            title="Close (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-image-display">
            <img src={fullUrl} alt={image.title} />
          </div>

          <div className="modal-info-panel">
            <div>
              {image.description ? (
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.92rem' }}>
                  {image.description}
                </p>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '1rem', fontSize: '0.88rem' }}>
                  No description provided.
                </p>
              )}

              {image.tags && image.tags.length > 0 && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Tag size={14} />
                    Tags
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {image.tags.map((tag, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '0.75rem',
                          background: 'rgba(99, 102, 241, 0.15)',
                          color: '#c7d2fe',
                          padding: '0.2rem 0.6rem',
                          borderRadius: 'var(--radius-full)',
                          border: '1px solid rgba(99, 102, 241, 0.3)'
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="meta-table">
                <div className="meta-row">
                  <span className="meta-row-label">Original Filename:</span>
                  <span className="meta-row-value" style={{ wordBreak: 'break-all' }}>{image.originalName}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-row-label">Saved Storage Name:</span>
                  <span className="meta-row-value" style={{ wordBreak: 'break-all', fontSize: '0.8rem' }}>{image.filename}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-row-label">MIME Type:</span>
                  <span className="meta-row-value">{image.mimeType}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-row-label">File Size:</span>
                  <span className="meta-row-value">{image.formattedSize || `${(image.size / 1024).toFixed(1)} KB`}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-row-label">Uploaded At:</span>
                  <span className="meta-row-value">{formattedDate}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              <button className="btn btn-secondary" onClick={handleCopyLink}>
                <Copy size={16} />
                <span>Copy URL</span>
              </button>
              <button className="btn btn-primary" onClick={handleDownload}>
                <Download size={16} />
                <span>Download</span>
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
