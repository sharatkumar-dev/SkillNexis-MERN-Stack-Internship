import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye } from 'lucide-react';
import Rating from './Rating';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const isOutOfStock = product.countInStock <= 0;
  const isLowStock = product.countInStock > 0 && product.countInStock <= 5;
  const skuTag = product._id ? `SKU-${product._id.slice(-6).toUpperCase()}` : 'SKU';

  // Resolve image URL (handle local uploads vs external URLs)
  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const backendBase = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace('/api', '')
      : 'http://localhost:5000';
    return `${backendBase}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <div className="product-card">
      <div className="product-image-wrap">
        <img
          src={getImageUrl(product.imageUrl)}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        {product.isFeatured && (
          <span className="product-featured-badge">FEATURED</span>
        )}
        <div style={{ position: 'absolute', bottom: '8px', right: '8px' }}>
          <span className="spec-chip" style={{ background: 'rgba(9, 10, 15, 0.85)', backdropFilter: 'blur(4px)' }}>
            {skuTag}
          </span>
        </div>
      </div>

      <div className="product-card-body">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
          <span className="product-category-text">{product.category}</span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 600,
              color: isOutOfStock ? 'var(--danger)' : isLowStock ? 'var(--warning)' : 'var(--success)',
            }}
          >
            {isOutOfStock ? '● Out of Stock' : isLowStock ? `● Only ${product.countInStock} Left` : `● ${product.countInStock} In Stock`}
          </span>
        </div>

        <Link to={`/product/${product._id}`}>
          <h3 className="product-title" title={product.name}>
            {product.name}
          </h3>
        </Link>

        <div style={{ margin: '0.35rem 0 0.5rem' }}>
          <Rating value={product.rating} text={`(${product.numReviews})`} />
        </div>

        <div className="product-card-footer">
          <div>
            <span style={{ display: 'block', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>PRICE</span>
            <span className="product-price">{formatPrice(product.price)}</span>
          </div>

          <div style={{ display: 'flex', gap: '0.45rem' }}>
            <Link
              to={`/product/${product._id}`}
              className="btn btn-secondary btn-sm"
              title="View Product Details"
              style={{ padding: '0.45rem 0.6rem' }}
            >
              <Eye size={15} />
            </Link>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => addToCart(product, 1)}
              disabled={isOutOfStock}
              title={isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              style={{ padding: '0.45rem 0.85rem' }}
            >
              <ShoppingBag size={15} />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
