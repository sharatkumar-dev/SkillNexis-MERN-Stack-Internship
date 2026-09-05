import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye } from 'lucide-react';
import Rating from './Rating';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const isOutOfStock = product.countInStock <= 0;

  // Resolve image URL (handle local uploads vs external URLs)
  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';
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
          <span className="product-featured-badge">Featured</span>
        )}
      </div>

      <div className="product-card-body">
        <span className="product-category-text">{product.category}</span>
        <Link to={`/product/${product._id}`}>
          <h3 className="product-title" title={product.name}>
            {product.name}
          </h3>
        </Link>

        <div style={{ margin: '0.35rem 0' }}>
          <Rating value={product.rating} text={`(${product.numReviews})`} />
        </div>

        <div style={{ fontSize: '0.82rem', color: isOutOfStock ? '#ef4444' : '#10b981', fontWeight: 600 }}>
          {isOutOfStock ? '● Out of Stock' : `● ${product.countInStock} In Stock`}
        </div>

        <div className="product-card-footer">
          <span className="product-price">{formatPrice(product.price)}</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link
              to={`/product/${product._id}`}
              className="btn btn-secondary btn-sm"
              title="View Details"
              style={{ padding: '0.45rem' }}
            >
              <Eye size={16} />
            </Link>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => addToCart(product, 1)}
              disabled={isOutOfStock}
              title={isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              style={{ padding: '0.45rem 0.8rem' }}
            >
              <ShoppingBag size={16} />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
