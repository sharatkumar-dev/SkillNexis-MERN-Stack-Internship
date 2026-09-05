import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import Rating from '../components/Rating';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';
import { ArrowLeft, ShoppingBag, Truck, ShieldCheck, Check, AlertCircle } from 'lucide-react';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data.data);
      } catch (err) {
        setError(err.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product && product.countInStock > 0) {
      const added = addToCart(product, qty);
      if (added) {
        navigate('/cart');
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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-muted)' }}>
        Loading product details...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', margin: '3rem auto', maxWidth: '500px' }}>
        <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
        <h3>Product Not Found</h3>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0 1.5rem' }}>
          {error || "The requested item could not be retrieved."}
        </p>
        <Link to="/" className="btn btn-primary">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.countInStock <= 0;

  return (
    <div>
      <Link to="/" className="btn btn-outline btn-sm" style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={16} /> Back to Catalog
      </Link>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'start',
        }}
      >
        {/* Product Image Stage */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <img
            src={getImageUrl(product.imageUrl)}
            alt={product.name}
            style={{ width: '100%', height: 'auto', maxHeight: '520px', objectFit: 'cover' }}
          />
        </div>

        {/* Product Details & Purchase Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <span
              style={{
                fontSize: '0.85rem',
                color: '#818cf8',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {product.category} • {product.brand}
            </span>
            <h1 style={{ fontSize: '2.2rem', margin: '0.4rem 0 0.8rem' }}>{product.name}</h1>
            <Rating value={product.rating} text={`${product.rating} / 5 (${product.numReviews} customer reviews)`} size={20} />
          </div>

          <div
            style={{
              fontSize: '2.4rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: '#ffffff',
            }}
          >
            {formatPrice(product.price)}
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7' }}>
            {product.description}
          </p>

          {/* Stock & Quantity Control Box */}
          <div
            className="card"
            style={{
              padding: '1.5rem',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-medium)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
              <span
                style={{
                  fontWeight: 700,
                  color: isOutOfStock ? '#ef4444' : '#10b981',
                }}
              >
                {isOutOfStock ? 'Out of Stock' : `In Stock (${product.countInStock} available)`}
              </span>
            </div>

            {!isOutOfStock && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Quantity:</span>
                <select
                  className="form-control"
                  style={{ width: '100px', padding: '0.4rem 0.8rem' }}
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                >
                  {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              disabled={isOutOfStock}
              onClick={handleAddToCart}
            >
              <ShoppingBag size={20} />
              {isOutOfStock ? 'Currently Unavailable' : 'Add to Cart & Checkout'}
            </button>
          </div>

          {/* Guarantees */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Truck size={18} color="#818cf8" />
              <span>Complimentary insured express delivery on orders over ₹999</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <ShieldCheck size={18} color="#34d399" />
              <span>Official 1-Year Manufacturer Warranty included</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
