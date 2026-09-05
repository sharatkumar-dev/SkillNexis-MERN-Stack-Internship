import React from 'react';
import { ShoppingBag, ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Value Propositions */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
            paddingBottom: '2rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ padding: '0.75rem', background: 'var(--color-primary-light)', borderRadius: '12px', color: '#818cf8' }}>
              <Truck size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Free Express Delivery</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>On all orders across India over ₹999</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: '#34d399' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Secure Transactions</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Encrypted JWT authentication & checkout</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', color: '#fbbf24' }}>
              <RotateCcw size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>30-Day Hassle-Free Returns</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Instant refund guarantee</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '12px', color: '#22d3ee' }}>
              <Headphones size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>24/7 Dedicated Support</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Real-time team assistance</p>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={20} color="#6366f1" />
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>NexisStore</span>
            <span>— SkillNexis MERN Stack Capstone Project</span>
          </div>
          <div>
            Built with React 18, Express, MongoDB & Node.js • Production Cloud Deployable
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
