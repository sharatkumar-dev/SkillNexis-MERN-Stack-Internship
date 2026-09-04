import React from 'react';
import { Search, SlidersHorizontal, ImageOff, Layers } from 'lucide-react';
import ImageCard from './ImageCard';

const CATEGORIES = [
  { id: 'all', label: 'All Photos' },
  { id: 'wallpaper', label: 'Wallpapers' },
  { id: 'nature', label: 'Nature' },
  { id: 'technology', label: 'Tech' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'art', label: 'Art' },
  { id: 'portrait', label: 'Portraits' },
  { id: 'general', label: 'General' }
];

const ImageGallery = ({
  images,
  isLoading,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onSelectImage,
  onDeleteImage,
  showToast
}) => {
  return (
    <section className="gallery-section">
      <div className="gallery-controls-bar">
        {/* Category Pills */}
        <div className="filter-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`pill-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="search-sort-group">
          <div className="search-input-wrapper">
            <Search size={16} />
            <input
              type="text"
              className="search-input"
              placeholder="Search images or tags..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="size_desc">Largest Size</option>
            <option value="size_asc">Smallest Size</option>
            <option value="title_asc">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Grid Content */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'inline-block', width: '36px', height: '36px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ marginTop: '1rem' }}>Loading image vault...</p>
        </div>
      ) : images.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <ImageOff size={28} />
          </div>
          <h3>No Images Found</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', fontSize: '0.92rem' }}>
            {searchQuery || selectedCategory !== 'all'
              ? 'No uploaded images match your active filters or search terms. Try clearing your filters.'
              : 'Your vault is currently empty. Drop an image into the upload pipeline above to start building your gallery!'}
          </p>
        </div>
      ) : (
        <div className="images-grid">
          {images.map((img) => (
            <ImageCard
              key={img._id}
              image={img}
              onSelectImage={onSelectImage}
              onDelete={onDeleteImage}
              showToast={showToast}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ImageGallery;
