import React from 'react';
import '../styles/components.css';

/**
 * Reusable Button Component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button label or inner content
 * @param {'primary'|'secondary'|'outline'|'danger'|'success'} [props.variant='primary'] - Visual style
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Button size
 * @param {Function} [props.onClick] - Click event handler
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {string} [props.type='button'] - Button type (button, submit, reset)
 * @param {React.ReactNode} [props.icon] - Optional leading icon
 * @param {boolean} [props.isLoading=false] - Loading indicator state
 * @param {string} [props.className=''] - Additional custom CSS classes
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  type = 'button',
  icon,
  isLoading = false,
  className = '',
  ...rest
}) {
  const baseClasses = `btn btn--${variant} btn--${size} ${className} ${isLoading ? 'is-loading' : ''}`;

  return (
    <button
      type={type}
      className={baseClasses.trim()}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <span className="btn__spinner" aria-hidden="true" />
      ) : (
        icon && <span className="btn__icon">{icon}</span>
      )}
      <span className="btn__text">{children}</span>
    </button>
  );
}
