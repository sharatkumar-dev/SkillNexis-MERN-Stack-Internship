import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';
import { ShieldCheck, Truck, CreditCard, Banknote, ArrowLeft, Terminal, CheckCircle2 } from 'lucide-react';

export const Checkout = () => {
  const { user } = useAuth();
  const {
    cartItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    clearCart,
  } = useCart();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    address: 'Plot 42, Electronics City Phase 1',
    city: 'Bengaluru',
    postalCode: '560100',
    country: 'India',
    phone: '+91 98765 43210',
  });

  const [paymentMethod, setPaymentMethod] = useState('CashOnDelivery');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item.product,
          name: item.name,
          qty: item.qty,
          price: item.price,
          imageUrl: item.imageUrl,
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      const { data } = await API.post('/orders', orderPayload);

      clearCart();
      navigate(`/order-success/${data.data._id}`);
    } catch (err) {
      setError(err.message || 'Failed to place order. Please check inventory and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <Link to="/cart" className="btn btn-secondary btn-sm">
          <ArrowLeft size={14} /> Back to Cart
        </Link>
        <span className="spec-chip">
          SECURE 256-BIT ENCRYPTION
        </span>
      </div>

      {/* Multi-Step Checkout Stepper */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '0.85rem 1.25rem',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '2rem',
          overflowX: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-amber)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', background: 'rgba(245, 158, 11, 0.15)', padding: '0.2rem 0.5rem', borderRadius: '2px', fontWeight: 700 }}>
            01
          </span>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase' }}>SHIPPING ADDRESS</span>
        </div>
        <span style={{ color: 'var(--border-medium)' }}>➔</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-amber)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', background: 'rgba(245, 158, 11, 0.15)', padding: '0.2rem 0.5rem', borderRadius: '2px', fontWeight: 700 }}>
            02
          </span>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase' }}>PAYMENT METHOD</span>
        </div>
        <span style={{ color: 'var(--border-medium)' }}>➔</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.2rem 0.5rem', borderRadius: '2px' }}>
            03
          </span>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase' }}>ORDER CONFIRMATION</span>
        </div>
      </div>

      {error && (
        <div
          className="card"
          style={{
            background: 'var(--danger-bg)',
            borderColor: '#ef4444',
            color: '#fecaca',
            marginBottom: '1.5rem',
            padding: '1rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
          }}
        >
          Order Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start',
          }}
        >
          {/* Destination and Payment Forms */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Step 1: Shipping Address */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <Truck size={18} color="var(--text-amber)" />
                <h3 style={{ fontSize: '1.1rem', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                  1. Shipping Address
                </h3>
              </div>

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  className="form-control"
                  value={shippingAddress.fullName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Street Address / House No.</label>
                <input
                  type="text"
                  name="address"
                  required
                  className="form-control"
                  value={shippingAddress.address}
                  onChange={handleInputChange}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    className="form-control"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Postal / PIN Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    className="form-control"
                    value={shippingAddress.postalCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    name="country"
                    required
                    className="form-control"
                    value={shippingAddress.country}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    required
                    className="form-control"
                    value={shippingAddress.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <CreditCard size={18} color="var(--text-amber)" />
                <h3 style={{ fontSize: '1.1rem', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                  2. Payment Method
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.95rem 1.15rem',
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${paymentMethod === 'CashOnDelivery' ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
                    background: paymentMethod === 'CashOnDelivery' ? 'rgba(245, 158, 11, 0.08)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CashOnDelivery"
                    checked={paymentMethod === 'CashOnDelivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <Banknote size={20} color="var(--success)" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>Cash on Delivery (COD)</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      Pay via cash or UPI when your package arrives
                    </div>
                  </div>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.95rem 1.15rem',
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${paymentMethod === 'CreditCard' ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
                    background: paymentMethod === 'CreditCard' ? 'rgba(245, 158, 11, 0.08)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CreditCard"
                    checked={paymentMethod === 'CreditCard'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <CreditCard size={20} color="var(--text-amber)" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>Credit / Debit Card (Instant Test Payment)</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      Instant secure checkout with simulated transaction
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary & Place Order Button */}
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
              <h3 style={{ fontSize: '1.15rem', textTransform: 'uppercase' }}>
                Order Summary ({cartItems.length})
              </h3>
              <span className="spec-chip">VERIFIED</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem', maxHeight: '200px', overflowY: 'auto' }}>
              {cartItems.map((item) => (
                <div key={item.product} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {item.qty}x {item.name}
                  </span>
                  <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{formatPrice(itemsPrice)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{shippingPrice === 0 ? <span style={{ color: 'var(--success)' }}>FREE</span> : formatPrice(shippingPrice)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Estimated Tax (GST 18%)</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{formatPrice(taxPrice)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '0.85rem',
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-heading)',
                }}
              >
                <span>Total</span>
                <span style={{ color: 'var(--text-amber)' }}>{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', textTransform: 'uppercase' }}
              disabled={submitting}
            >
              <ShieldCheck size={18} />
              {submitting ? 'Placing Order...' : `Place Order • ${formatPrice(totalPrice)}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
