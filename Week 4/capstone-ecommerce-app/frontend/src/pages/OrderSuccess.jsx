import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { formatPrice } from '../utils/currency';
import { CheckCircle2, Package, ArrowRight, Home } from 'lucide-react';

export const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await API.get(`/orders/${id}`);
        setOrder(data.data);
      } catch (err) {
        console.error('Failed to load order', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-muted)' }}>
        Retrieving order receipt...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div
        className="card"
        style={{
          textAlign: 'center',
          padding: '3rem 2rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(99, 102, 241, 0.1))',
          border: '1px solid rgba(16, 185, 129, 0.3)',
        }}
      >
        <CheckCircle2 size={64} color="#10b981" style={{ margin: '0 auto 1rem' }} />
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>Thank You For Your Order!</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '1rem' }}>
          Your order has been recorded and is currently being processed by our fulfillment center.
        </p>
        <span
          style={{
            display: 'inline-block',
            padding: '0.4rem 1rem',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            color: '#818cf8',
            fontFamily: 'monospace',
          }}
        >
          Order Reference: #{id}
        </span>
      </div>

      {order && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.2rem' }}>Order Information</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className={`badge badge-${order.orderStatus.toLowerCase()}`}>
                Status: {order.orderStatus}
              </span>
              <span
                style={{
                  padding: '0.3rem 0.7rem',
                  borderRadius: '9999px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  background: order.isPaid ? 'var(--success-bg)' : 'var(--warning-bg)',
                  color: order.isPaid ? '#34d399' : '#fbbf24',
                  border: `1px solid ${order.isPaid ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                }}
              >
                {order.isPaid ? 'Payment Received' : 'Payment on Delivery'}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ship To</p>
              <p style={{ fontWeight: 600 }}>{order.shippingAddress.fullName}</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{order.shippingAddress.country}</p>
            </div>

            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Payment Details</p>
              <p style={{ fontWeight: 600 }}>{order.paymentMethod}</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            Items Ordered
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {order.orderItems.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {item.qty}x {item.name}
                </span>
                <span style={{ fontWeight: 600 }}>{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '1.25rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
            }}
          >
            <span>Total Amount</span>
            <span style={{ color: '#818cf8' }}>{formatPrice(order.totalPrice)}</span>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link to="/my-orders" className="btn btn-secondary">
          <Package size={18} /> View All My Orders
        </Link>
        <Link to="/" className="btn btn-primary">
          <Home size={18} /> Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
