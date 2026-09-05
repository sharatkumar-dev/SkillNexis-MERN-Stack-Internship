import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react';
import logoSvg from '../assets/logo.svg';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Customer Trust Guarantees */}
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
            <div style={{ padding: '0.7rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: 'var(--radius-sm)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <Truck size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#ffffff' }}>Free Express Shipping</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>On all orders across India over ₹999</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ padding: '0.7rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-sm)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#ffffff' }}>100% Genuine Certified</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Official manufacturer warranty included</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ padding: '0.7rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: 'var(--radius-sm)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
              <RotateCcw size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#ffffff' }}>30-Day Easy Returns</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Hassle-free exchange &amp; refunds</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ padding: '0.7rem', background: 'rgba(249, 115, 22, 0.1)', borderRadius: 'var(--radius-sm)', color: '#fb923c', border: '1px solid rgba(249, 115, 22, 0.2)' }}>
              <Headphones size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#ffffff' }}>24/7 Dedicated Support</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Expert assistance via chat and email</p>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img src={logoSvg} alt="NexisStore" style={{ height: '24px' }} />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              NexisStore — Full-Stack MERN E-Commerce Platform • SkillNexis Internship Capstone
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
            <span className="status-ping"></span>
            <span style={{ color: 'var(--success)' }}>SYSTEMS ONLINE</span>
            <span style={{ color: 'var(--border-medium)' }}>|</span>
            <span>SECURE CHECKOUT</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
