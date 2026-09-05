import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { formatPrice } from '../utils/currency';
import { Package, Calendar, ArrowRight, Eye, ShoppingBag, Terminal } from 'lucide-react';

export const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders/my-orders');
        setOrders(data.data || []);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-muted)' }}>
        <div className="status-ping" style={{ width: '12px', height: '12px', margin: '0 auto 1rem' }}></div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.92rem' }}>
          Loading your orders...
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
          <span className="spec-chip">ACCOUNT // ORDERS</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {orders.length} TOTAL ORDERS
          </span>
        </div>
        <h1 style={{ fontSize: '2.1rem', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
          My Order History
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Track past orders, view invoices, and monitor live delivery updates.
        </p>
      </div>

      {orders.length === 0 ? (
        <div
          className="card"
          style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '520px', margin: '2rem auto' }}
        >
          <Package size={48} color="var(--color-primary)" style={{ margin: '0 auto 1.25rem', opacity: 0.8 }} />
          <h3 style={{ marginBottom: '0.5rem', textTransform: 'uppercase' }}>No Orders Yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            You haven't placed any orders yet. Discover our precision hardware catalog.
          </p>
          <Link to="/" className="btn btn-primary">
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {orders.map((order) => (
            <div key={order._id} className="card">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid var(--border-subtle)',
                  paddingBottom: '0.85rem',
                  marginBottom: '0.85rem',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    DATE PLACED
                  </span>
                  <p style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                    <Calendar size={14} color="var(--text-amber)" />
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    ORDER ID
                  </span>
                  <p style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-amber)', fontSize: '0.88rem' }}>
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    TOTAL AMOUNT
                  </span>
                  <p style={{ fontWeight: 700, fontFamily: 'var(--font-heading)', fontSize: '1.05rem', color: '#ffffff' }}>
                    {formatPrice(order.totalPrice)}
                  </p>
                </div>

                <div>
                  <span className={`badge badge-${order.orderStatus.toLowerCase()}`}>
                    ● {order.orderStatus}
                  </span>
                </div>
              </div>

              {/* Order Items Preview */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '0.85rem' }}>
                {order.orderItems.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.88rem',
                    }}
                  >
                    <span style={{ color: 'var(--text-secondary)' }}>
                      <span className="spec-chip" style={{ marginRight: '0.5rem', fontSize: '0.65rem' }}>{item.qty}x</span>
                      {item.name}
                    </span>
                    <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                      {formatPrice(item.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '0.75rem',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  PAYMENT: <strong style={{ color: order.isPaid ? 'var(--success)' : 'var(--text-amber)' }}>{order.isPaid ? 'PAID' : 'COD'}</strong>
                </div>

                <Link
                  to={`/order-success/${order._id}`}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '0.4rem', fontSize: '0.8rem' }}
                >
                  <Eye size={14} /> View Order Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
