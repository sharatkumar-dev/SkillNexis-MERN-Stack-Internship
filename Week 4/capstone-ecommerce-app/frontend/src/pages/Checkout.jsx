import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';
import { ShieldCheck, Truck, CreditCard, Banknote, ArrowLeft } from 'lucide-react';

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
    address: '742 Evergreen Terrace',
    city: 'Springfield',
    postalCode: '97477',
    country: 'United States',
    phone: '+1 (555) 019-2834',
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
      <Link to="/cart" className="btn btn-outline btn-sm" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Bag
      </Link>

      <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Secure Checkout</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Please confirm your destination address and preferred payment method.
      </p>

      {error && (
        <div
          className="card"
          style={{
            background: 'var(--danger-bg)',
            borderColor: '#ef4444',
            color: '#fecaca',
            marginBottom: '1.5rem',
            padding: '1rem',
          }}
        >
          {error}
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
          {/* Shipping and Payment Forms */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Step 1: Shipping Address */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <Truck size={22} color="#6366f1" />
                <h3 style={{ fontSize: '1.25rem' }}>1. Shipping Address</h3>
              </div>

              <div className="form-group">
                <label className="form-label">Full Recipient Name</label>
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
                <label className="form-label">Street Address</label>
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
                  <label className="form-label">Postal / ZIP Code</label>
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
                  <label className="form-label">Contact Phone</label>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <CreditCard size={22} color="#6366f1" />
                <h3 style={{ fontSize: '1.25rem' }}>2. Payment Method</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${paymentMethod === 'CashOnDelivery' ? '#6366f1' : 'var(--border-subtle)'}`,
                    background: paymentMethod === 'CashOnDelivery' ? 'var(--color-primary-light)' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CashOnDelivery"
                    checked={paymentMethod === 'CashOnDelivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <Banknote size={20} color="#10b981" />
                  <div>
                    <div style={{ fontWeight: 600 }}>Cash on Delivery (COD)</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Pay with cash or POS terminal upon courier delivery
                    </div>
                  </div>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${paymentMethod === 'CreditCard' ? '#6366f1' : 'var(--border-subtle)'}`,
                    background: paymentMethod === 'CreditCard' ? 'var(--color-primary-light)' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CreditCard"
                    checked={paymentMethod === 'CreditCard'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <CreditCard size={20} color="#6366f1" />
                  <div>
                    <div style={{ fontWeight: 600 }}>Credit / Debit Card (Instant Simulation)</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Simulated automatic authorization and paid status
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Review & Place Order Button */}
          <div
            className="card"
            style={{
              position: 'sticky',
              top: '90px',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-medium)',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
              Order Review ({cartItems.length} items)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', maxHeight: '200px', overflowY: 'auto' }}>
              {cartItems.map((item) => (
                <div key={item.product} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {item.qty}x {item.name}
                  </span>
                  <span style={{ fontWeight: 600 }}>{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                <span>{formatPrice(itemsPrice)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                <span>{shippingPrice === 0 ? <span style={{ color: '#34d399' }}>FREE</span> : formatPrice(shippingPrice)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Estimated GST (18%)</span>
                <span>{formatPrice(taxPrice)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '0.85rem',
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-heading)',
                }}
              >
                <span>Total</span>
                <span style={{ color: '#818cf8' }}>{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              disabled={submitting}
            >
              <ShieldCheck size={20} />
              {submitting ? 'Placing Order...' : `Authorize & Place Order (${formatPrice(totalPrice)})`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
