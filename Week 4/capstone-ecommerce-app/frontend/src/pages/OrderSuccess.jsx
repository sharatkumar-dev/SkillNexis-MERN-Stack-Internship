import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { formatPrice } from '../utils/currency';
import { CheckCircle2, Package, ArrowRight, Home, Cpu, Truck, Clock, ShieldCheck } from 'lucide-react';

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
        <div className="status-ping" style={{ width: '12px', height: '12px', margin: '0 auto 1rem' }}></div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.92rem' }}>
          Loading your order details...
        </p>
      </div>
    );
  }

  // Stages calculation
  const getStageIndex = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing': return 1;
      case 'shipped': return 2;
      case 'delivered': return 3;
      case 'cancelled': return -1;
      case 'pending':
      default: return 0;
    }
  };

  const currentStage = order ? getStageIndex(order.orderStatus) : 0;
  const stages = [
    { label: 'PLACED', desc: 'Order Confirmed' },
    { label: 'PROCESSING', desc: 'Packed & Verified' },
    { label: 'SHIPPED', desc: 'In Transit' },
    { label: 'DELIVERED', desc: 'Delivered' },
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div
        className="card"
        style={{
          textAlign: 'center',
          padding: '2.75rem 2rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(16, 185, 129, 0.06)), var(--bg-surface)',
          border: '1px solid var(--border-amber)',
        }}
      >
        <CheckCircle2 size={54} color="var(--success)" style={{ margin: '0 auto 1rem' }} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span className="spec-chip">ORDER CONFIRMED</span>
          <span className="spec-chip" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
            <span className="status-ping" style={{ width: '6px', height: '6px' }}></span> PREPARING SHIPMENT
          </span>
        </div>
        <h1 style={{ fontSize: '2.1rem', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
          Thank You! Your Order is Confirmed
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
          We've received your order and our lab specialists are packing your hardware for fast dispatch.
        </p>
        <span
          style={{
            display: 'inline-block',
            padding: '0.35rem 0.9rem',
            background: 'var(--bg-surface-dim)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xs)',
            fontSize: '0.8rem',
            color: 'var(--text-amber)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          ORDER ID: #{id}
        </span>
      </div>

      {/* 4-Stage Horizontal Live Tracking Timeline Stepper */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.6rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            LIVE SHIPMENT TRACKING
          </span>
          <span className="spec-chip" style={{ color: order?.orderStatus === 'Delivered' ? 'var(--success)' : 'var(--text-amber)' }}>
            CURRENT: {order?.orderStatus?.toUpperCase()}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', textAlign: 'center' }}>
          {stages.map((stage, idx) => {
            const isCompleted = currentStage >= idx;
            const isCurrent = currentStage === idx;
            return (
              <div key={stage.label} style={{ position: 'relative' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-xs)',
                    margin: '0 auto 0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    background: isCompleted ? 'var(--color-primary)' : 'var(--bg-surface-dim)',
                    color: isCompleted ? '#090a0f' : 'var(--text-muted)',
                    border: `1px solid ${isCurrent ? 'var(--color-primary-bright)' : isCompleted ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
                    boxShadow: isCurrent ? '0 0 12px rgba(245, 158, 11, 0.4)' : 'none',
                  }}
                >
                  0{idx + 1}
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.78rem', fontWeight: 700, color: isCompleted ? '#ffffff' : 'var(--text-muted)' }}>
                  {stage.label}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  {stage.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {order && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase' }}>Order Details &amp; Receipt</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className={`badge badge-${order.orderStatus.toLowerCase()}`}>
                {order.orderStatus}
              </span>
              <span
                className="spec-chip"
                style={{
                  color: order.isPaid ? 'var(--success)' : 'var(--warning)',
                  borderColor: order.isPaid ? 'var(--border-emerald)' : 'var(--border-amber)',
                }}
              >
                {order.isPaid ? 'PAID ONLINE' : 'PAYMENT PENDING (COD)'}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem', background: 'var(--bg-surface-dim)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div>
              <p style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>DELIVERY ADDRESS</p>
              <p style={{ fontWeight: 600, color: '#ffffff' }}>{order.shippingAddress.fullName}</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{order.shippingAddress.country}</p>
            </div>

            <div>
              <p style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>PAYMENT METHOD</p>
              <p style={{ fontWeight: 600, color: '#ffffff' }}>{order.paymentMethod}</p>
              <p style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                PLACED: {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            ITEMS ORDERED
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
            {order.orderItems.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {item.qty}x {item.name}
                </span>
                <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '0.85rem',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '1.2rem',
              fontWeight: 700,
              fontFamily: 'var(--font-heading)',
            }}
          >
            <span>TOTAL AMOUNT</span>
            <span style={{ color: 'var(--text-amber)' }}>{formatPrice(order.totalPrice)}</span>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link to="/my-orders" className="btn btn-secondary">
          <Package size={16} /> View Order History
        </Link>
        <Link to="/" className="btn btn-primary">
          <Home size={16} /> Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
