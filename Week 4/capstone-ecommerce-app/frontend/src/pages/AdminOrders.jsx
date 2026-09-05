import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { ShoppingBag, ArrowLeft, CheckCircle2, Truck, Eye, X } from 'lucide-react';

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
      <Link to="/admin/dashboard" className="btn btn-outline btn-sm" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem' }}>Order Fulfillment & Tracking</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Review placed customer orders and update dispatch / delivery status in real-time
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h3>No Orders Placed</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Customer orders will appear here once placed.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Order Ref</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status Management</th>
                <th>Inspect</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                    #{order._id.slice(-6)}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{order.shippingAddress?.fullName || order.user?.name || 'Customer'}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {order.user?.email}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    {order.orderItems?.reduce((acc, i) => acc + i.qty, 0)} items
                  </td>
                  <td style={{ fontWeight: 800, color: '#818cf8' }}>
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: order.isPaid ? '#34d399' : '#fbbf24', fontWeight: 600 }}>
                      {order.isPaid ? 'Paid' : 'COD'}
                    </span>
                  </td>
                  <td>
                    <select
                      className="form-control"
                      style={{ padding: '0.35rem 0.6rem', fontSize: '0.82rem', width: 'auto' }}
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
                      style={{ padding: '0.35rem 0.6rem' }}
                      title="Inspect Order Details"
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Inspect Order Modal */}
      {selectedOrder && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem' }}>Order Details #{selectedOrder._id}</h2>
              <button onClick={() => setSelectedOrder(null)} style={{ color: 'var(--text-muted)' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Recipient</p>
                  <p style={{ fontWeight: 600 }}>{selectedOrder.shippingAddress.fullName}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{selectedOrder.shippingAddress.address}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{selectedOrder.shippingAddress.country}</p>
                  <p style={{ fontSize: '0.85rem', color: '#818cf8' }}>Tel: {selectedOrder.shippingAddress.phone}</p>
                </div>

                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Financials</p>
                  <p style={{ fontSize: '0.9rem' }}>Method: <strong>{selectedOrder.paymentMethod}</strong></p>
                  <p style={{ fontSize: '0.9rem' }}>Paid: <strong>{selectedOrder.isPaid ? 'Yes' : 'Pending'}</strong></p>
                  <p style={{ fontSize: '0.9rem' }}>Total: <strong style={{ color: '#818cf8', fontSize: '1.1rem' }}>${selectedOrder.totalPrice.toFixed(2)}</strong></p>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.6rem' }}>Ordered Items</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {selectedOrder.orderItems.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                      <span>{item.qty}x {item.name}</span>
                      <span style={{ fontWeight: 600 }}>${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setSelectedOrder(null)}
                style={{ marginTop: '0.5rem' }}
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
