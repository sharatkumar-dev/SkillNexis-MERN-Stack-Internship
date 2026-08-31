import React from 'react';
import Button from './Button';
import '../styles/components.css';

/**
 * Reusable Header Component
 * @param {Object} props
 * @param {string} props.title - Brand / Application title
 * @param {string} [props.subtitle] - Brief descriptive tag
 * @param {string} [props.badgeText] - Status or version badge label
 * @param {'dark'|'light'} [props.theme='dark'] - Current active theme
 * @param {Function} [props.onThemeToggle] - Callback to toggle theme state
 * @param {Array<{label: string, count?: number, active?: boolean, onClick?: Function}>} [props.navTabs] - Navigation tabs
 */
export default function Header({
  title = 'React Components Practice',
  subtitle = 'SkillNexis MERN Stack Internship • Week 1',
  badgeText = 'Assignment 2',
  theme = 'dark',
  onThemeToggle,
  navTabs = [],
}) {
  return (
    <header className={`app-header ${theme === 'light' ? 'app-header--light' : ''}`}>
      <div className="app-header__container">
        <div className="app-header__branding">
          <div className="app-header__logo-wrap">
            <span className="app-header__react-icon">⚛️</span>
            <div>
              <div className="app-header__title-row">
                <h1 className="app-header__title">{title}</h1>
                {badgeText && <span className="app-header__badge">{badgeText}</span>}
              </div>
              {subtitle && <p className="app-header__subtitle">{subtitle}</p>}
            </div>
          </div>
        </div>

        <div className="app-header__actions">
          {navTabs.length > 0 && (
            <nav className="app-header__nav" aria-label="Component categories">
              {navTabs.map((tab, index) => (
                <button
                  key={index}
                  type="button"
                  className={`app-header__tab ${tab.active ? 'is-active' : ''}`}
                  onClick={tab.onClick}
                >
                  {tab.label}
                  {typeof tab.count === 'number' && (
                    <span className="app-header__tab-count">{tab.count}</span>
                  )}
                </button>
              ))}
            </nav>
          )}

          {onThemeToggle && (
            <Button
              variant="outline"
              size="sm"
              onClick={onThemeToggle}
              className="app-header__theme-btn"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
