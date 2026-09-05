import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
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
          maxWidth: '550px',
          margin: '3rem auto',
        }}
      >
        <ShoppingBag size={56} color="#6366f1" style={{ margin: '0 auto 1.5rem', opacity: 0.8 }} />
        <h2 style={{ marginBottom: '0.8rem' }}>Your Shopping Cart is Empty</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Looks like you haven't added anything to your cart yet. Explore our curated catalog to get started.
        </p>
        <Link to="/" className="btn btn-primary btn-lg">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>Shopping Bag</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Review your items before proceeding to checkout</p>
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
        {/* Cart Items Table / List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cartItems.map((item) => (
            <div
              key={item.product}
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                padding: '1.25rem',
                flexWrap: 'wrap',
              }}
            >
              <img
                src={getImageUrl(item.imageUrl)}
                alt={item.name}
                style={{
                  width: '90px',
                  height: '90px',
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-md)',
                }}
              />

              <div style={{ flex: 1, minWidth: '180px' }}>
                <Link
                  to={`/product/${item.product}`}
                  style={{ fontWeight: 600, fontSize: '1.05rem', display: 'block', marginBottom: '0.3rem' }}
                >
                  {item.name}
                </Link>
                <span style={{ color: '#818cf8', fontWeight: 700 }}>
                  ${Number(item.price).toFixed(2)} each
                </span>
              </div>

              {/* Quantity Select */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Qty:</label>
                <select
                  className="form-control"
                  style={{ width: '80px', padding: '0.35rem 0.6rem' }}
                  value={item.qty}
                  onChange={(e) => updateQty(item.product, Number(e.target.value))}
                >
                  {[...Array(Math.min(item.countInStock, 10)).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Line Subtotal */}
              <div style={{ minWidth: '90px', textAlign: 'right', fontWeight: 700, fontSize: '1.1rem' }}>
                ${(item.price * item.qty).toFixed(2)}
              </div>

              {/* Remove button */}
              <button
                onClick={() => removeFromCart(item.product)}
                style={{
                  color: 'var(--text-muted)',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'var(--transition)',
                }}
                title="Remove item"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}

          <Link to="/" className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
            <ArrowLeft size={16} /> Continue Shopping
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
          <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
            Order Summary
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Items Subtotal</span>
              <span>${itemsPrice.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Estimated Shipping</span>
              <span>{shippingPrice === 0 ? <span style={{ color: '#34d399' }}>FREE</span> : `$${shippingPrice.toFixed(2)}`}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Estimated Sales Tax (8%)</span>
              <span>${taxPrice.toFixed(2)}</span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '0.85rem',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '1.2rem',
                fontWeight: 800,
                fontFamily: 'var(--font-heading)',
              }}
            >
              <span>Total</span>
              <span style={{ color: '#818cf8' }}>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
            onClick={() => navigate('/checkout')}
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
