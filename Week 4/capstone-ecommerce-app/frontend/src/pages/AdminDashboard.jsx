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
  Activity,
  Cpu,
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
        <div className="status-ping" style={{ width: '12px', height: '12px', margin: '0 auto 1rem' }}></div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.92rem' }}>
          Loading dashboard metrics...
        </p>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
            <span className="spec-chip">ADMIN // CONSOLE</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--success)' }}>
              <span className="status-ping" style={{ width: '6px', height: '6px' }}></span> SYSTEM HEALTHY
            </span>
          </div>
          <h1 style={{ fontSize: '2.1rem', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            Admin Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Overview of store revenue, order fulfillments, inventory levels, and customer accounts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <Link to="/admin/products" className="btn btn-secondary btn-sm" style={{ textTransform: 'uppercase' }}>
            <Package size={15} /> Products &amp; Inventory
          </Link>
          <Link to="/admin/orders" className="btn btn-primary btn-sm" style={{ textTransform: 'uppercase' }}>
            <ShoppingBag size={15} /> Orders &amp; Delivery
          </Link>
        </div>
      </div>

      {/* Metric Telemetry Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        {/* Total Revenue */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'var(--bg-surface)' }}>
          <div style={{ padding: '0.9rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-sm)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>TOTAL REVENUE</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#ffffff' }}>
              {formatPrice(stats?.totalRevenue || 0)}
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'var(--bg-surface)' }}>
          <div style={{ padding: '0.9rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: 'var(--radius-sm)', color: 'var(--text-amber)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>TOTAL ORDERS</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#ffffff' }}>
              {stats?.totalOrders || 0}
            </div>
          </div>
        </div>

        {/* Total Products */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'var(--bg-surface)' }}>
          <div style={{ padding: '0.9rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: 'var(--radius-sm)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <Package size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>TOTAL PRODUCTS</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#ffffff' }}>
              {stats?.totalProducts || 0}
            </div>
          </div>
        </div>

        {/* Active Customers */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'var(--bg-surface)' }}>
          <div style={{ padding: '0.9rem', background: 'rgba(249, 115, 22, 0.1)', borderRadius: 'var(--radius-sm)', color: '#fb923c', border: '1px solid rgba(249, 115, 22, 0.2)' }}>
            <Users size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>TOTAL CUSTOMERS</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#ffffff' }}>
              {stats?.totalUsers || 0}
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'var(--bg-surface)', border: stats?.lowStockProducts > 0 ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-subtle)' }}>
          <div style={{ padding: '0.9rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-sm)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>LOW STOCK ALERTS</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: stats?.lowStockProducts > 0 ? 'var(--text-amber)' : 'var(--success)' }}>
              {stats?.lowStockProducts || 0} ITEMS
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Orders & Category Health */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
        {/* Recent Orders */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.05rem', textTransform: 'uppercase' }}>Recent Orders</h3>
            <Link to="/admin/orders" style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-amber)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              VIEW ALL ORDERS <ArrowRight size={13} />
            </Link>
          </div>

          {stats?.recentOrders?.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No recent orders found.</p>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>CUSTOMER</th>
                    <th>STATUS</th>
                    <th>TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentOrders?.map((ord) => (
                    <tr key={ord._id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{ord.shippingAddress?.fullName || 'Customer'}</div>
                        <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-${ord.orderStatus.toLowerCase()}`}>
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#ffffff' }}>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.05rem', textTransform: 'uppercase' }}>Inventory By Category</h3>
            <Layers size={16} color="var(--text-muted)" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {stats?.categories?.map((cat) => (
              <div key={cat.category} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>{cat.category}</span>
                <span className="spec-chip">{cat.count} PRODUCTS</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
