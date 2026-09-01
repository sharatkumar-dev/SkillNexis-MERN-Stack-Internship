import React from 'react';

export default function Footer({ onSelectCategory, onScrollToTop }) {
  const categories = ['React', 'JavaScript', 'CSS & UI', 'Backend', 'AI & Cloud', 'System Design'];

  return (
    <footer className="footer-container">
      <div className="footer-inner">
        {/* Brand & Mission Column */}
        <div className="footer-col footer-col--brand">
          <div className="footer-brand">
            <span className="brand-icon">⚡</span>
            <div className="brand-text">
              <h2 className="brand-title">DevPulse</h2>
              <span className="brand-badge">Tech Chronicle</span>
            </div>
          </div>

          <p className="footer-desc">
            An open technical publication dedicated to advancing frontend engineering, component systems, full-stack scalability, and cloud software development.
          </p>

          <div className="footer-tags-row">
            <span className="footer-tag-pill">React 19</span>
            <span className="footer-tag-pill">Vite</span>
            <span className="footer-tag-pill">SPA Architecture</span>
            <span className="footer-tag-pill">JSON Feed</span>
          </div>
        </div>

        {/* Categories Directory Column */}
        <div className="footer-col">
          <h4 className="footer-col__title">Explore Topics</h4>
          <ul className="footer-links">
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => {
                    onSelectCategory(cat);
                    onScrollToTop();
                  }}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Project & Internship Metadata */}
        <div className="footer-col">
          <h4 className="footer-col__title">SkillNexis Internship</h4>
          <ul className="footer-meta-list">
            <li>
              <strong>Track:</strong> Full Stack Web Development (MERN)
            </li>
            <li>
              <strong>Milestone:</strong> Week 1 • Mini Project
            </li>
            <li>
              <strong>Developer:</strong> Alex Morgan
            </li>
            <li>
              <strong>Status:</strong> Completed & Compliant
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Sub-Footer Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom__inner">
          <p className="footer-copy">
            © {new Date().getFullYear()} DevPulse Publication. Created for <strong>SkillNexis MERN Stack Internship</strong> (Week 1 Mini Project).
          </p>

          <button
            type="button"
            className="back-to-top-btn"
            onClick={onScrollToTop}
            title="Scroll to top of page"
          >
            Back to Top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
