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
        <div className="status-ping" style={{ width: '12px', height: '12px', margin: '0 auto 1rem' }}></div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.92rem' }}>
          Loading product specifications...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', margin: '3rem auto', maxWidth: '520px' }}>
        <AlertCircle size={44} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
        <h3>Product Not Found</h3>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0 1.5rem', fontSize: '0.9rem' }}>
          {error || "The requested product could not be retrieved from our inventory."}
        </p>
        <Link to="/" className="btn btn-primary">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.countInStock <= 0;
  const isLowStock = product.countInStock > 0 && product.countInStock <= 5;
  const skuTag = product._id ? `SKU-${product._id.slice(-6).toUpperCase()}` : 'SKU';

  return (
    <div>
      {/* Navigation Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <Link to="/" className="btn btn-secondary btn-sm">
          <ArrowLeft size={14} /> Back to Products
        </Link>
        <span className="spec-chip">
          {skuTag}
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start',
        }}
      >
        {/* Product Image Stage */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-md)',
            position: 'relative',
          }}
        >
          <div
            style={{
              padding: '0.6rem 1rem',
              background: 'var(--bg-surface-dim)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
            }}
          >
            <span>PRODUCT GALLERY</span>
            <span style={{ color: 'var(--text-amber)' }}>100% GENUINE</span>
          </div>

          <img
            src={getImageUrl(product.imageUrl)}
            alt={product.name}
            style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'cover', display: 'block', background: '#090a0f' }}
          />

          <div
            style={{
              padding: '0.75rem 1rem',
              background: 'var(--bg-surface-dim)',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <span style={{ color: 'var(--text-secondary)' }}>BRAND: {product.brand}</span>
            <span style={{ color: 'var(--success)' }}>CERTIFIED QUALITY</span>
          </div>
        </div>

        {/* Product Details & Purchase Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span className="spec-chip">{product.category}</span>
              <span className="spec-chip" style={{ background: 'transparent', color: 'var(--text-secondary)', borderColor: 'var(--border-subtle)' }}>
                {product.brand}
              </span>
            </div>
            <h1 style={{ fontSize: '2.1rem', margin: '0.3rem 0 0.6rem', letterSpacing: '-0.02em' }}>{product.name}</h1>
            <Rating value={product.rating} text={`${product.rating} / 5 (${product.numReviews} Verified Reviews)`} size={18} />
          </div>

          <div
            style={{
              fontSize: '2.2rem',
              fontWeight: 700,
              fontFamily: 'var(--font-heading)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.5rem',
            }}
          >
            <span>{formatPrice(product.price)}</span>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontWeight: 500 }}>
              INCL. ALL TAXES
            </span>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: '1.7' }}>
            {product.description}
          </p>

          {/* Product Highlights Matrix Box */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.6rem',
              padding: '0.85rem',
              background: 'var(--bg-surface-dim)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem',
            }}
          >
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>AUTHENTICITY</span>
              <strong style={{ color: '#ffffff' }}>100% Certified Genuine</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>WARRANTY</span>
              <strong style={{ color: 'var(--success)' }}>1-Year Included</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>DISPATCH TIME</span>
              <strong style={{ color: '#ffffff' }}>Same-Day Express</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>RETURN POLICY</span>
              <strong style={{ color: 'var(--text-amber)' }}>30-Day Easy Returns</strong>
            </div>
          </div>

          {/* Cart & Quantity Control Box */}
          <div
            className="card"
            style={{
              padding: '1.35rem',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-medium)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                AVAILABILITY:
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: isOutOfStock ? 'var(--danger)' : isLowStock ? 'var(--warning)' : 'var(--success)',
                }}
              >
                {isOutOfStock ? '● Currently Out of Stock' : isLowStock ? `● Only ${product.countInStock} Left` : `● In Stock (${product.countInStock} available)`}
              </span>
            </div>

            {!isOutOfStock && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  SELECT QUANTITY:
                </span>
                <select
                  className="form-control"
                  style={{ width: '90px', padding: '0.35rem 0.65rem', fontFamily: 'var(--font-mono)' }}
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
              style={{ width: '100%', textTransform: 'uppercase' }}
              disabled={isOutOfStock}
              onClick={handleAddToCart}
            >
              <ShoppingBag size={18} />
              {isOutOfStock ? 'Currently Unavailable' : 'Add to Cart & Checkout'}
            </button>
          </div>

          {/* Guarantees */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Truck size={16} color="var(--text-amber)" />
              <span>Complimentary express delivery on orders over ₹999</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <ShieldCheck size={16} color="var(--success)" />
              <span>Official 1-Year Manufacturer Warranty included</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
