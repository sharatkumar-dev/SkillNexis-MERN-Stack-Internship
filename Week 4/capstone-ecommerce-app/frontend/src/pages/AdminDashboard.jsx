import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { formatPrice } from '../utils/currency';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Layers,
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/admin/stats');
        setStats(data.data);
      } catch (err) {
        console.error('Failed to load admin metrics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-muted)' }}>
        Loading admin telemetry & statistics...
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2.2rem' }}>Admin Operations Center</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Real-time overview of revenue, inventory, active orders, and catalog health
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/products" className="btn btn-secondary btn-sm">
            <Package size={16} /> Manage Products
          </Link>
          <Link to="/admin/orders" className="btn btn-primary btn-sm">
            <ShoppingBag size={16} /> Manage Orders
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        {/* Total Revenue */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.12)', borderRadius: '16px', color: '#10b981' }}>
            <DollarSign size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Total Revenue</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#ffffff' }}>
              {formatPrice(stats?.totalRevenue || 0)}
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.12)', borderRadius: '16px', color: '#818cf8' }}>
            <ShoppingBag size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Total Orders</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#ffffff' }}>
              {stats?.totalOrders || 0}
            </div>
          </div>
        </div>

        {/* Total Products */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(6, 182, 212, 0.12)', borderRadius: '16px', color: '#06b6d4' }}>
            <Package size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Catalog Products</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#ffffff' }}>
              {stats?.totalProducts || 0}
            </div>
          </div>
        </div>

        {/* Active Customers */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(168, 85, 247, 0.12)', borderRadius: '16px', color: '#c084fc' }}>
            <Users size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Customer Accounts</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#ffffff' }}>
              {stats?.totalUsers || 0}
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.12)', borderRadius: '16px', color: '#fbbf24' }}>
            <AlertTriangle size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Low Stock Alert</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: stats?.lowStockProducts > 0 ? '#fbbf24' : '#ffffff' }}>
              {stats?.lowStockProducts || 0} items
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Orders & Category Health */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Recent Orders */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem' }}>Recent Customer Orders</h3>
            <Link to="/admin/orders" style={{ fontSize: '0.85rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {stats?.recentOrders?.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No orders placed yet</p>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Recipient</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentOrders?.map((ord) => (
                    <tr key={ord._id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{ord.shippingAddress?.fullName || 'Customer'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-${ord.orderStatus.toLowerCase()}`}>
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: '#818cf8' }}>
                        {formatPrice(ord.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Categories Distribution */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem' }}>Category Inventory</h3>
            <Layers size={18} color="var(--text-muted)" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats?.categories?.map((cat) => (
              <div key={cat.category} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontWeight: 600 }}>{cat.category}</span>
                <span className="badge badge-category">{cat.count} products</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
