import React from 'react';
import { Eye, Download, Copy, Trash2, Tag, Calendar } from 'lucide-react';
import { getFullImageUrl, downloadImageFile } from '../api/imageApi';

const ImageCard = ({ image, onSelectImage, onDelete, showToast }) => {
  const fullUrl = getFullImageUrl(image.url);

  const handleCopyLink = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(fullUrl);
    showToast('Image link copied to clipboard!', 'info');
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    try {
      showToast(`Downloading "${image.originalName}"...`, 'info');
      await downloadImageFile(image._id, image.originalName);
      showToast(`Downloaded "${image.originalName}" successfully!`, 'success');
    } catch (err) {
      console.error('Download error:', err);
      showToast('Failed to download image. Please try again.', 'error');
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${image.title}"?`)) {
      onDelete(image._id);
    }
  };

  // Format date
  const formattedDate = new Date(image.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="image-card" onClick={() => onSelectImage(image)}>
      <div className="card-img-wrapper">
        <img
          src={fullUrl}
          alt={image.title}
          className="card-img"
          loading="lazy"
        />
        <div className="card-overlay">
          <button
            className="btn btn-secondary btn-icon"
            onClick={(e) => {
              e.stopPropagation();
              onSelectImage(image);
            }}
            title="Inspect / Lightbox"
          >
            <Eye size={16} />
          </button>
          <button
            className="btn btn-secondary btn-icon"
            onClick={handleCopyLink}
            title="Copy Public URL"
          >
            <Copy size={16} />
          </button>
          <button
            className="btn btn-secondary btn-icon"
            onClick={handleDownload}
            title="Download Original"
          >
            <Download size={16} />
          </button>
          <button
            className="btn btn-danger btn-icon"
            onClick={handleDelete}
            title="Delete Image"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="card-content">
        <div>
          <div className="card-title-row">
            <h3 className="card-title" title={image.title}>
              {image.title}
            </h3>
            <span className="category-tag">{image.category}</span>
          </div>

          {image.description && (
            <p className="card-desc" title={image.description}>
              {image.description}
            </p>
          )}

          {image.tags && image.tags.length > 0 && (
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
              {image.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '0.68rem',
                    color: 'var(--text-muted)',
                    background: 'rgba(255,255,255,0.05)',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '4px'
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="card-meta-row">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Calendar size={13} />
            {formattedDate}
          </span>
          <span>{image.formattedSize || `${(image.size / 1024).toFixed(1)} KB`}</span>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
