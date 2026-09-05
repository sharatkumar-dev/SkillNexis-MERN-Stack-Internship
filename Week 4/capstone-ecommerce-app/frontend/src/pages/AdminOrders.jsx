import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { formatPrice } from '../utils/currency';
import { ShoppingBag, ArrowLeft, CheckCircle2, Truck, Eye, X, Terminal } from 'lucide-react';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/orders');
      setOrders(data.data || []);
    } catch (err) {
      console.error('Failed to load all orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setStatusUpdating(orderId);
    try {
      await API.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((ord) =>
          ord._id === orderId
            ? {
                ...ord,
                orderStatus: newStatus,
                isDelivered: newStatus === 'Delivered' ? true : ord.isDelivered,
                isPaid: newStatus === 'Delivered' ? true : ord.isPaid,
              }
            : ord
        )
      );
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setStatusUpdating(null);
    }
  };

  return (
    <div>
      <Link to="/admin/dashboard" className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
          <span className="spec-chip">ADMIN // ORDERS</span>
          <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            {orders.length} TOTAL ORDERS
          </span>
        </div>
        <h1 style={{ fontSize: '2.1rem', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
          Order Management &amp; Fulfillment
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Track incoming customer orders, update shipping and delivery statuses, and view customer addresses.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
          <div className="status-ping" style={{ width: '12px', height: '12px', margin: '0 auto 1rem' }}></div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.92rem' }}>Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h3 style={{ textTransform: 'uppercase' }}>No Orders Found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Customer orders will appear here once placed.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>CUSTOMER</th>
                <th>DATE</th>
                <th>ITEMS</th>
                <th>TOTAL</th>
                <th>PAYMENT</th>
                <th>STATUS</th>
                <th>DETAILS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-amber)', fontSize: '0.82rem' }}>
                    #{order._id.slice(-6).toUpperCase()}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{order.shippingAddress?.fullName || order.user?.name || 'Customer'}</div>
                    <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {order.user?.email}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                    {order.orderItems?.reduce((acc, i) => acc + i.qty, 0)} items
                  </td>
                  <td style={{ fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#ffffff' }}>
                    {formatPrice(order.totalPrice)}
                  </td>
                  <td>
                    <span
                      className="spec-chip"
                      style={{
                        color: order.isPaid ? 'var(--success)' : 'var(--warning)',
                        borderColor: order.isPaid ? 'var(--border-emerald)' : 'var(--border-amber)',
                        fontSize: '0.68rem',
                      }}
                    >
                      {order.isPaid ? 'PAID' : 'COD'}
                    </span>
                  </td>
                  <td>
                    <select
                      className="form-control"
                      style={{ padding: '0.3rem 0.55rem', fontSize: '0.78rem', width: 'auto', fontFamily: 'var(--font-mono)' }}
                      value={order.orderStatus}
                      disabled={statusUpdating === order._id}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedOrder(order)}
                      style={{ padding: '0.35rem 0.55rem' }}
                      title="View Order Details"
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Inspection Modal */}
      {selectedOrder && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <div>
                <span className="spec-chip" style={{ marginBottom: '0.2rem' }}>
                  ORDER // #{selectedOrder._id}
                </span>
                <h2 style={{ fontSize: '1.35rem', textTransform: 'uppercase' }}>
                  Order Details
                </h2>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem', background: 'var(--bg-surface-dim)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.82rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block' }}>SHIPPING DETAILS</span>
                <strong style={{ color: '#ffffff' }}>{selectedOrder.shippingAddress?.fullName}</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city} {selectedOrder.shippingAddress?.postalCode}
                </p>
                <p style={{ color: 'var(--text-secondary)' }}>{selectedOrder.shippingAddress?.country}</p>
                <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>Phone: {selectedOrder.shippingAddress?.phone}</p>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block' }}>STATUS &amp; PAYMENT</span>
                <p style={{ marginTop: '0.2rem' }}>
                  <span className={`badge badge-${selectedOrder.orderStatus.toLowerCase()}`}>
                    {selectedOrder.orderStatus}
                  </span>
                </p>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.35rem' }}>Method: {selectedOrder.paymentMethod}</p>
                <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>Placed on: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <h4 style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>
              ORDER ITEMS
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
              {selectedOrder.orderItems?.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', padding: '0.4rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span>{item.qty}x {item.name}</span>
                  <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>TOTAL AMOUNT</span>
              <span style={{ color: 'var(--text-amber)', fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                {formatPrice(selectedOrder.totalPrice)}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedOrder(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
