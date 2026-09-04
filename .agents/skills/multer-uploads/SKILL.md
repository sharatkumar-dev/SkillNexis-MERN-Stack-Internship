---
name: multer-uploads
description: Guide and procedures for implementing secure multipart file uploads using Multer in Express and handling preview & FormData uploads in React.
---

# Multer Image Upload Skill

This skill outlines best practices for implementing file/image upload features using Multer on the backend and React on the frontend.

## Backend Configuration

### 1. Storage & Filter Setup (`middleware/uploadMiddleware.js`)
```javascript
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, WEBP, and GIF images are allowed'), false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter,
});
```

### 2. Static Serving in Express (`server.js`)
```javascript
import express from 'express';
import path from 'path';

const app = express();
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
```

## Frontend React Upload & Preview Pattern

```jsx
import React, { useState } from 'react';
import axios from 'axios';

export function ImageUploader({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!selected.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);
      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onUploadSuccess?.(res.data);
      setFile(null);
      setPreview('');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Preview" width={200} />}
      <button type="submit" disabled={!file || loading}>
        {loading ? 'Uploading...' : 'Upload Image'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
```
