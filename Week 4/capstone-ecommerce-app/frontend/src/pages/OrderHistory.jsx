import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { Package, Calendar, ArrowRight, Eye, ShoppingBag } from 'lucide-react';

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
      <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
        Loading your order history...
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem' }}>My Orders</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track and manage your order deliveries and purchase receipts</p>
      </div>

      {orders.length === 0 ? (
        <div
          className="card"
          style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '500px', margin: '2rem auto' }}
        >
          <Package size={52} color="#6366f1" style={{ margin: '0 auto 1.5rem', opacity: 0.8 }} />
          <h3 style={{ marginBottom: '0.6rem' }}>No Orders Yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            You haven't placed any orders yet. Check out our store and explore current offers!
          </p>
          <Link to="/" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => (
            <div key={order._id} className="card">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid var(--border-subtle)',
                  paddingBottom: '1rem',
                  marginBottom: '1rem',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Order Placed
                  </span>
                  <p style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={14} color="#818cf8" />
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Order Reference
                  </span>
                  <p style={{ fontWeight: 600, fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                    #{order._id}
                  </p>
                </div>

                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Total Amount
                  </span>
                  <p style={{ fontWeight: 800, color: '#818cf8' }}>
                    ${order.totalPrice.toFixed(2)}
                  </p>
                </div>

                <div>
                  <span className={`badge badge-${order.orderStatus.toLowerCase()}`}>
                    ● {order.orderStatus}
                  </span>
                </div>
              </div>

              {/* Order Items Preview */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                {order.orderItems.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.92rem',
                    }}
                  >
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {item.qty}x {item.name}
                    </span>
                    <span style={{ fontWeight: 600 }}>
                      ${(item.price * item.qty).toFixed(2)}
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
                  paddingTop: '0.85rem',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <span style={{ fontSize: '0.85rem', color: order.isPaid ? '#34d399' : '#fbbf24' }}>
                  {order.isPaid ? '✓ Payment Complete' : '⏳ Payment on Delivery'}
                </span>

                <Link to={`/order-success/${order._id}`} className="btn btn-secondary btn-sm">
                  <Eye size={16} /> View Order Receipt
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
