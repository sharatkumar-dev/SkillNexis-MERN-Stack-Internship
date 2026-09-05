import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';

export const Cart = () => {
  const {
    cartItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    updateQty,
    removeFromCart,
    clearCart,
  } = useCart();
  const navigate = useNavigate();

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const backendBase = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace('/api', '')
      : 'http://localhost:5000';
    return `${backendBase}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  if (cartItems.length === 0) {
    return (
      <div
        className="card"
        style={{
          textAlign: 'center',
          padding: '4.5rem 2rem',
          maxWidth: '560px',
          margin: '3rem auto',
        }}
      >
        <ShoppingBag size={50} color="var(--color-primary)" style={{ margin: '0 auto 1.25rem', opacity: 0.85 }} />
        <h2 style={{ marginBottom: '0.6rem' }}>Your Shopping Cart is Empty</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.8rem', fontSize: '0.92rem' }}>
          Looks like you haven't added any products to your cart yet. Explore our curated catalog to get started.
        </p>
        <Link to="/" className="btn btn-primary btn-lg">
          Explore Products
        </Link>
      </div>
    );
  }

  const freeShippingThreshold = 999;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - itemsPrice);
  const progressPercent = Math.min(100, Math.round((itemsPrice / freeShippingThreshold) * 100));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.8rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span className="spec-chip">SHOPPING CART</span>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              {cartItems.length} {cartItems.length === 1 ? 'ITEM' : 'ITEMS'} ADDED
            </span>
          </div>
          <h1 style={{ fontSize: '1.9rem', letterSpacing: '-0.02em' }}>Shopping Cart</h1>
        </div>
        <button onClick={clearCart} className="btn btn-outline btn-sm">
          Clear Entire Cart
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start',
        }}
      >
        {/* Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {cartItems.map((item) => (
            <div
              key={item.product}
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                padding: '1.15rem',
                flexWrap: 'wrap',
                background: 'var(--bg-surface)',
              }}
            >
              <img
                src={getImageUrl(item.imageUrl)}
                alt={item.name}
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  background: '#0c0e14',
                }}
              />

              <div style={{ flex: 1, minWidth: '180px' }}>
                <span className="spec-chip" style={{ fontSize: '0.65rem', marginBottom: '0.3rem' }}>
                  SKU-{item.product.slice(-6).toUpperCase()}
                </span>
                <Link
                  to={`/product/${item.product}`}
                  style={{ fontWeight: 600, fontSize: '1rem', display: 'block', marginBottom: '0.25rem' }}
                >
                  {item.name}
                </Link>
                <span style={{ color: 'var(--text-amber)', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                  {formatPrice(item.price)} each
                </span>
              </div>

              {/* Quantity Select */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Qty:</label>
                <select
                  className="form-control"
                  style={{ width: '75px', padding: '0.3rem 0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}
                  value={item.qty}
                  onChange={(e) => updateQty(item.product, Number(e.target.value))}
                >
                  {[...Array(Math.min(item.countInStock || 10, 10)).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Line Subtotal */}
              <div style={{ minWidth: '85px', textAlign: 'right', fontWeight: 700, fontSize: '1.05rem', fontFamily: 'var(--font-heading)' }}>
                {formatPrice(item.price * item.qty)}
              </div>

              {/* Remove button */}
              <button
                onClick={() => removeFromCart(item.product)}
                style={{
                  color: 'var(--text-muted)',
                  padding: '0.4rem',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'var(--transition)',
                }}
                title="Remove item"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <Link to="/" className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
            <ArrowLeft size={14} /> Continue Shopping
          </Link>
        </div>

        {/* Order Summary Sticky Card */}
        <div
          className="card"
          style={{
            position: 'sticky',
            top: '90px',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '1.15rem' }}>
              Order Summary
            </h3>
            <span className="status-ping"></span>
          </div>

          {/* Free Shipping Progress Bar */}
          <div style={{ padding: '0.75rem', background: 'var(--bg-surface-dim)', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', marginBottom: '0.4rem' }}>
              <span>EXPRESS DELIVERY:</span>
              <strong style={{ color: remainingForFreeShipping === 0 ? 'var(--success)' : 'var(--text-amber)' }}>
                {remainingForFreeShipping === 0 ? 'QUALIFIED FOR FREE DELIVERY' : `ADD ${formatPrice(remainingForFreeShipping)} FOR FREE`}
              </strong>
            </div>
            <div style={{ width: '100%', height: '5px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--color-primary)', transition: 'width 0.3s ease' }}></div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Items Subtotal</span>
              <span style={{ fontWeight: 600 }}>{formatPrice(itemsPrice)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Estimated Shipping</span>
              <span style={{ fontWeight: 600 }}>{shippingPrice === 0 ? <span style={{ color: 'var(--success)' }}>FREE</span> : formatPrice(shippingPrice)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Estimated GST (18%)</span>
              <span style={{ fontWeight: 600 }}>{formatPrice(taxPrice)}</span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '0.85rem',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '1.25rem',
                fontWeight: 700,
                fontFamily: 'var(--font-heading)',
              }}
            >
              <span>Total Amount</span>
              <span style={{ color: 'var(--text-amber)' }}>{formatPrice(totalPrice)}</span>
            </div>
          </div>

          <button
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
            onClick={() => navigate('/checkout')}
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
