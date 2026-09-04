import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, ArrowDown } from 'lucide-react';
import Navbar from './components/Navbar';
import StorageStats from './components/StorageStats';
import Dropzone from './components/Dropzone';
import ImageGallery from './components/ImageGallery';
import ImageModal from './components/ImageModal';
import Toast from './components/Toast';
import { getImages, getStorageStats, deleteImage } from './api/imageApi';

function App() {
  const [images, setImages] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters & Sorting
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Lightbox Modal
  const [activeModalImage, setActiveModalImage] = useState(null);

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch images based on active controls
  const loadImages = useCallback(async () => {
    try {
      const params = {
        category: selectedCategory,
        search: searchQuery,
        sortBy: sortBy
      };
      const response = await getImages(params);
      if (response.success && response.data) {
        setImages(response.data.images || []);
      }
    } catch (err) {
      console.error('Failed to load images:', err);
      showToast('Could not load images. Please verify backend server is running.', 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedCategory, searchQuery, sortBy, showToast]);

  // Fetch storage stats
  const loadStats = useCallback(async () => {
    try {
      const response = await getStorageStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadImages();
    loadStats();
  }, [loadImages, loadStats]);

  // Handle manual refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    loadImages();
    loadStats();
  };

  // Handle image upload completion
  const handleUploadSuccess = () => {
    loadImages();
    loadStats();
  };

  // Handle delete image
  const handleDeleteImage = async (id) => {
    try {
      const res = await deleteImage(id);
      showToast(res.message || 'Image deleted successfully', 'success');
      setImages((prev) => prev.filter((img) => img._id !== id));
      loadStats();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete image';
      showToast(errorMsg, 'error');
    }
  };

  const scrollToUpload = () => {
    const el = document.getElementById('upload-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-container">
      <Navbar
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        onScrollToUpload={scrollToUpload}
      />

      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-header">
          <div className="hero-pill">
            <Sparkles size={14} />
            <span>Week 3 Assignment 2 — Full-Stack Multer Pipeline</span>
          </div>
          <h1 className="hero-title">High-Performance Image Vault</h1>
          <p className="hero-desc">
            Seamlessly upload, preview, categorize, and manage high-resolution photos with Express, Multer disk storage, and MongoDB metadata indexing.
          </p>
        </section>

        {/* Storage Stats */}
        <StorageStats stats={stats} />

        {/* Multer Upload Pipeline */}
        <Dropzone
          onUploadSuccess={handleUploadSuccess}
          showToast={showToast}
        />

        {/* Gallery with Filters and Lightbox */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2>Vault Gallery ({images.length})</h2>
        </div>

        <ImageGallery
          images={images}
          isLoading={isLoading}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onSelectImage={setActiveModalImage}
          onDeleteImage={handleDeleteImage}
          showToast={showToast}
        />
      </main>

      {/* Lightbox / Modal */}
      {activeModalImage && (
        <ImageModal
          image={activeModalImage}
          onClose={() => setActiveModalImage(null)}
          onDelete={handleDeleteImage}
          showToast={showToast}
        />
      )}

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
