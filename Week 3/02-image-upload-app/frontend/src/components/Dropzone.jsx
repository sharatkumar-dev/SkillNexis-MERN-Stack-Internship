import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Check, FileCheck, AlertTriangle } from 'lucide-react';
import { uploadSingleImage, uploadMultipleImages } from '../api/imageApi';

const CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'wallpaper', label: 'Wallpaper' },
  { value: 'nature', label: 'Nature' },
  { value: 'technology', label: 'Technology' },
  { value: 'architecture', label: 'Architecture' },
  { value: 'art', label: 'Art' },
  { value: 'portrait', label: 'Portrait' }
];

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const Dropzone = ({ onUploadSuccess, showToast }) => {
  const [uploadMode, setUploadMode] = useState('single'); // 'single' | 'multiple'
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]); // Array of File objects
  const [previews, setPreviews] = useState([]); // Array of { file, url, name, size, type }
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Metadata form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('general');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  const fileInputRef = useRef(null);

  // Validate individual file
  const validateFile = (file) => {
    if (!file.type.startsWith('image/')) {
      showToast(`'${file.name}' is not an image file.`, 'error');
      return false;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      showToast(`'${file.name}' exceeds the 5MB size limit (${sizeMB} MB).`, 'error');
      return false;
    }
    return true;
  };

  // Handle newly selected files
  const processFiles = (fileList) => {
    const validFiles = [];
    const newPreviews = [];

    const filesArray = Array.from(fileList);

    if (uploadMode === 'single') {
      const file = filesArray[0];
      if (file && validateFile(file)) {
        validFiles.push(file);
        newPreviews.push({
          file,
          url: URL.createObjectURL(file),
          name: file.name,
          size: (file.size / 1024).toFixed(1) + ' KB',
          type: file.type
        });
        // Suggest title based on filename
        const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        setTitle(baseName.replace(/[-_]/g, ' '));
      }
    } else {
      // Multiple mode - max 5
      const totalCount = selectedFiles.length + filesArray.length;
      if (totalCount > 5) {
        showToast('You can only upload up to 5 images at a time.', 'error');
      }

      const availableSlots = 5 - selectedFiles.length;
      const filesToAdd = filesArray.slice(0, Math.max(0, availableSlots));

      filesToAdd.forEach((file) => {
        if (validateFile(file)) {
          validFiles.push(file);
          newPreviews.push({
            file,
            url: URL.createObjectURL(file),
            name: file.name,
            size: (file.size / 1024).toFixed(1) + ' KB',
            type: file.type
          });
        }
      });
    }

    if (uploadMode === 'single') {
      // Clean up previous preview URLs
      previews.forEach((p) => URL.revokeObjectURL(p.url));
      setSelectedFiles(validFiles);
      setPreviews(newPreviews);
    } else {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  // Drag event handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // File picker handler
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  // Clear single or multi preview
  const handleClear = () => {
    previews.forEach((p) => URL.revokeObjectURL(p.url));
    setSelectedFiles([]);
    setPreviews([]);
    setTitle('');
    setDescription('');
    setTags('');
    setCategory('general');
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove specific file in multi mode
  const handleRemoveFile = (index) => {
    URL.revokeObjectURL(previews[index].url);
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    setPreviews(updatedPreviews);
  };

  // Switch mode
  const handleModeSwitch = (mode) => {
    if (isUploading) return;
    handleClear();
    setUploadMode(mode);
  };

  // Submit upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      showToast('Please choose an image to upload.', 'error');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      if (uploadMode === 'single') {
        const formData = new FormData();
        formData.append('image', selectedFiles[0]);
        formData.append('title', title);
        formData.append('category', category);
        formData.append('description', description);
        formData.append('tags', tags);

        const response = await uploadSingleImage(formData, (progress) => {
          setUploadProgress(progress);
        });

        showToast(response.message || 'Image uploaded successfully!', 'success');
        handleClear();
        onUploadSuccess();
      } else {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append('images', file);
        });
        formData.append('category', category);
        formData.append('tags', tags);

        const response = await uploadMultipleImages(formData, (progress) => {
          setUploadProgress(progress);
        });

        showToast(response.message || 'Images uploaded successfully!', 'success');
        handleClear();
        onUploadSuccess();
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        'Failed to upload image. Please check server logs.';
      showToast(errorMsg, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="upload-panel" id="upload-section">
      <div className="upload-panel-header">
        <h2 className="upload-panel-title">
          <UploadCloud className="text-indigo-400" size={24} />
          Image Upload Pipeline
        </h2>

        <div className="mode-toggle">
          <button
            type="button"
            className={`mode-btn ${uploadMode === 'single' ? 'active' : ''}`}
            onClick={() => handleModeSwitch('single')}
            disabled={isUploading}
          >
            Single Upload
          </button>
          <button
            type="button"
            className={`mode-btn ${uploadMode === 'multiple' ? 'active' : ''}`}
            onClick={() => handleModeSwitch('multiple')}
            disabled={isUploading}
          >
            Batch Upload (Max 5)
          </button>
        </div>
      </div>

      {/* Hidden Native File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        multiple={uploadMode === 'multiple'}
        style={{ display: 'none' }}
      />

      {/* Drag & Drop Surface */}
      {previews.length === 0 ? (
        <div
          className={`dropzone ${isDragOver ? 'dragover' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="dropzone-icon-circle">
            <UploadCloud size={32} />
          </div>
          <div className="dropzone-primary-text">
            Drag & drop your image{uploadMode === 'multiple' ? 's' : ''} here, or{' '}
            <span style={{ color: 'var(--primary)', textDecoration: 'underline' }}>browse</span>
          </div>
          <p className="dropzone-subtext">
            Supports JPEG, PNG, WEBP, GIF, and SVG formats up to 5MB
          </p>
          <div className="badge-limits">
            <span>🛡️ Multer MIME validation</span>
            <span>•</span>
            <span>⚡ Instant client preview</span>
            <span>•</span>
            <span>📦 Auto disk storage</span>
          </div>
        </div>
      ) : null}

      {/* Pre-Upload Inspection & Metadata Form */}
      {previews.length > 0 && (
        <form onSubmit={handleSubmit} className="preview-container">
          {uploadMode === 'single' ? (
            <div className="single-preview-card">
              <div className="preview-thumb-box">
                <img src={previews[0].url} alt="Upload preview" />
                <span className="preview-badge-overlay">{previews[0].size}</span>
              </div>

              <div className="preview-inputs-form">
                <div className="form-group">
                  <label htmlFor="title-input">Image Title</label>
                  <input
                    id="title-input"
                    type="text"
                    className="form-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Neon Horizon Skyline"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label htmlFor="category-select">Category</label>
                    <select
                      id="category-select"
                      className="form-select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="tags-input">Tags (comma-separated)</label>
                    <input
                      id="tags-input"
                      type="text"
                      className="form-input"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="e.g. night, cyberpunk, neon"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="desc-input">Description (Optional)</label>
                  <textarea
                    id="desc-input"
                    className="form-textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add notes, camera specs, or background story..."
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="multi-preview-grid">
                {previews.map((preview, index) => (
                  <div key={index} className="multi-thumb-box">
                    <img src={preview.url} alt={`Preview ${index}`} />
                    <button
                      type="button"
                      className="remove-thumb-btn"
                      onClick={() => handleRemoveFile(index)}
                      title="Remove file"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}

                {previews.length < 5 && (
                  <button
                    type="button"
                    className="dropzone"
                    style={{ padding: '1rem', height: '100%', minHeight: '130px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <UploadCloud size={20} style={{ margin: '0 auto 0.25rem', color: 'var(--primary)' }} />
                    <span style={{ fontSize: '0.78rem' }}>Add more ({5 - previews.length} left)</span>
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="batch-category">Assign Category</label>
                  <select
                    id="batch-category"
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="batch-tags">Common Tags</label>
                  <input
                    id="batch-tags"
                    type="text"
                    className="form-input"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g. photoshoot, batch-1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {isUploading && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <span>Uploading to server...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="progress-container">
                <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClear}
              disabled={isUploading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isUploading}>
              <FileCheck size={18} />
              <span>{isUploading ? `Uploading (${uploadProgress}%)` : 'Upload Now'}</span>
            </button>
          </div>
        </form>
      )}
    </section>
  );
};

export default Dropzone;
