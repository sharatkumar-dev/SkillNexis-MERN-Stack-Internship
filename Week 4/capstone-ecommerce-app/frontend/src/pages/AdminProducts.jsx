import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { formatPrice } from '../utils/currency';
import {
  Plus,
  Edit2,
  Trash2,
  Package,
  Upload,
  X,
  Search,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    brand: 'SkillNexis Essentials',
    countInStock: '',
    imageUrl: '',
    isFeatured: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/products?limit=100');
      setProducts(data.data.products || []);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Electronics',
      brand: 'SkillNexis Essentials',
      countInStock: '',
      imageUrl: '',
      isFeatured: false,
    });
    setImageFile(null);
    setMessage({ type: '', text: '' });
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      brand: product.brand,
      countInStock: product.countInStock,
      imageUrl: product.imageUrl,
      isFeatured: product.isFeatured,
    });
    setImageFile(null);
    setMessage({ type: '', text: '' });
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // Create FormData to handle Multer multipart file upload
      const dataPayload = new FormData();
      dataPayload.append('name', formData.name);
      dataPayload.append('description', formData.description);
      dataPayload.append('price', formData.price);
      dataPayload.append('category', formData.category);
      dataPayload.append('brand', formData.brand);
      dataPayload.append('countInStock', formData.countInStock);
      dataPayload.append('isFeatured', formData.isFeatured);

      if (imageFile) {
        dataPayload.append('image', imageFile);
      } else if (formData.imageUrl) {
        dataPayload.append('imageUrl', formData.imageUrl);
      } else {
        throw new Error('Please select an image file or enter an image URL');
      }

      const headers = { 'Content-Type': 'multipart/form-data' };

      if (editingProduct) {
        await API.put(`/products/${editingProduct._id}`, dataPayload, { headers });
        setMessage({ type: 'success', text: 'Product successfully updated!' });
      } else {
        await API.post('/products', dataPayload, { headers });
        setMessage({ type: 'success', text: 'Product created successfully!' });
      }

      await fetchProducts();
      setTimeout(() => {
        setModalOpen(false);
      }, 1200);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Operation failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      try {
        await API.delete(`/products/${id}`);
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } catch (err) {
        alert(err.message || 'Failed to delete product');
      }
    }
  };

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const backendBase = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace('/api', '')
      : 'http://localhost:5000';
    return `${backendBase}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Link to="/admin/dashboard" className="btn btn-outline btn-sm" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2.2rem' }}>Product Inventory Control</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Add new catalog items with image upload, update stock levels, or retire items
          </p>
        </div>

        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {/* Filter and Search */}
      <div style={{ marginBottom: '1.5rem', maxWidth: '400px', position: 'relative' }}>
        <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
        <input
          type="text"
          className="form-control"
          style={{ paddingLeft: '2.5rem' }}
          placeholder="Filter products by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Products Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
          Loading products...
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <img
                        src={getImageUrl(product.imageUrl)}
                        alt={product.name}
                        style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600 }}>{product.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          Brand: {product.brand}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-category">{product.category}</span>
                  </td>
                  <td style={{ fontWeight: 700 }}>{formatPrice(product.price)}</td>
                  <td>
                    <span
                      style={{
                        color: product.countInStock <= 5 ? '#fbbf24' : '#10b981',
                        fontWeight: 600,
                      }}
                    >
                      {product.countInStock} units
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => openEditModal(product)}
                        title="Edit Product"
                        style={{ padding: '0.35rem 0.6rem' }}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(product._id, product.name)}
                        title="Delete Product"
                        style={{ padding: '0.35rem 0.6rem' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem' }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setModalOpen(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={22} />
              </button>
            </div>

            {message.text && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.25rem',
                  background: message.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)',
                  border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`,
                  color: message.type === 'success' ? '#a7f3d0' : '#fecaca',
                  fontSize: '0.9rem',
                }}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="form-control"
                  value={formData.name}
                  onChange={handleFormChange}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    step="1"
                    name="price"
                    required
                    min="0"
                    className="form-control"
                    value={formData.price}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Units in Stock</label>
                  <input
                    type="number"
                    name="countInStock"
                    required
                    min="0"
                    className="form-control"
                    value={formData.countInStock}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    name="category"
                    className="form-control"
                    value={formData.category}
                    onChange={handleFormChange}
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    className="form-control"
                    value={formData.brand}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  required
                  className="form-control"
                  value={formData.description}
                  onChange={handleFormChange}
                />
              </div>

              {/* Image Upload (Multer) or Image URL */}
              <div className="card" style={{ padding: '1rem', background: 'var(--bg-surface-elevated)', marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Upload size={16} /> Upload Image (Multer) or External URL
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  style={{ marginBottom: '0.75rem' }}
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
                <input
                  type="text"
                  name="imageUrl"
                  className="form-control"
                  placeholder="Or provide remote image URL (https://...)"
                  value={formData.imageUrl}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleFormChange}
                />
                <label htmlFor="isFeatured" style={{ cursor: 'pointer', fontSize: '0.9rem' }}>
                  Highlight on Home Page as Featured Product
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
