import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000
});

// Fetch all images with filtering, search, and sorting
export const getImages = async (params = {}) => {
  const response = await api.get('/images', { params });
  return response.data;
};

// Fetch storage statistics
export const getStorageStats = async () => {
  const response = await api.get('/images/stats');
  return response.data;
};

// Upload single image with multipart/form-data
export const uploadSingleImage = async (formData, onProgress) => {
  const response = await api.post('/images/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    }
  });
  return response.data;
};

// Upload multiple images (up to 5)
export const uploadMultipleImages = async (formData, onProgress) => {
  const response = await api.post('/images/upload-multiple', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    }
  });
  return response.data;
};

// Delete image by ID
export const deleteImage = async (id) => {
  const response = await api.delete(`/images/${id}`);
  return response.data;
};

// Helper to construct full image URL from relative path
export const getFullImageUrl = (relativeUrl) => {
  if (!relativeUrl) return '';
  if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
    return relativeUrl;
  }
  const cleanPath = relativeUrl.startsWith('/') ? relativeUrl : `/${relativeUrl}`;
  return `${SERVER_URL}${cleanPath}`;
};

// Helper for download URL
export const getDownloadUrl = (id) => {
  return `${API_BASE_URL}/images/${id}/download`;
};

// Trigger direct native file download with original filename
export const downloadImageFile = (id, originalName = 'downloaded-image') => {
  const downloadUrl = getDownloadUrl(id);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', originalName);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    if (document.body.contains(link)) {
      document.body.removeChild(link);
    }
  }, 1500);
};

export default api;
