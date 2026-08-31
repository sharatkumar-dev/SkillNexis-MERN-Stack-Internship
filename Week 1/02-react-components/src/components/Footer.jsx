import React from 'react';
import Button from './Button';
import '../styles/components.css';

/**
 * Reusable Footer Component
 * @param {Object} props
 * @param {string} props.author - Student/Author name
 * @param {string|number} [props.year] - Current copyright year
 * @param {string} [props.organization] - Internship / Program organization
 * @param {Array<{label: string, url: string}>} [props.links] - Footer links
 * @param {string} [props.statusText] - Status summary
 */
export default function Footer({
  author = 'Alex Morgan',
  year = new Date().getFullYear(),
  organization = 'SkillNexis MERN Stack Internship',
  links = [
    { label: 'Portfolio (Assignment 1)', url: '../01-portfolio/index.html' },
    { label: 'React Blog UI (Mini Project)', url: '../03-react-blog-ui/index.html' },
    { label: 'GitHub Repository', url: 'https://github.com/sharatkumar-dev/SkillNexis-MERN-Stack-Internship' },
  ],
  statusText = 'Week 1 Submission • 5 Reusable Components Implemented',
}) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="app-footer">
      <div className="app-footer__container">
        <div className="app-footer__main">
          <div className="app-footer__brand">
            <h3 className="app-footer__title">
              <span className="app-footer__icon">🚀</span> {organization}
            </h3>
            <p className="app-footer__desc">
              Building modern, component-driven full stack web applications with React.js and the MERN stack.
            </p>
            <span className="app-footer__status-badge">
              <span className="app-footer__status-dot"></span> {statusText}
            </span>
          </div>

          <div className="app-footer__links-section">
            <h4 className="app-footer__section-title">Quick Links</h4>
            <ul className="app-footer__links-list">
              {links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    className="app-footer__link"
                    target={link.url.startsWith('http') ? '_blank' : '_self'}
                    rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="app-footer__bottom">
          <p className="app-footer__copyright">
            © {year} <strong>{author}</strong>. All rights reserved. Built with React & Vite.
          </p>

          <Button
            variant="outline"
            size="sm"
            onClick={scrollToTop}
            className="app-footer__top-btn"
          >
            ↑ Back to Top
          </Button>
        </div>
      </div>
    </footer>
  );
}
