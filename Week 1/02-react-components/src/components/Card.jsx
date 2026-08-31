import React from 'react';
import Button from './Button';
import '../styles/components.css';

/**
 * Reusable Card Component
 * @param {Object} props
 * @param {string|number} props.id - Unique card identifier
 * @param {string} props.title - Card header/title
 * @param {string} props.description - Body description
 * @param {string} [props.category] - Category or domain label
 * @param {Array<string>} [props.tags] - Array of technology/skill badges
 * @param {string} [props.icon] - Emoji or icon symbol
 * @param {number} [props.likes=0] - Interactive likes/counter prop
 * @param {boolean} [props.completed=false] - Status completion flag
 * @param {'high'|'medium'|'low'} [props.priority='medium'] - Priority badge
 * @param {Function} [props.onLike] - Callback for like action
 * @param {Function} [props.onToggleComplete] - Callback for toggle completion
 * @param {Function} [props.onDelete] - Callback to delete card from state
 * @param {React.ReactNode} [props.children] - Additional nested elements
 * @param {string} [props.className=''] - Custom CSS class overrides
 */
export default function Card({
  id,
  title,
  description,
  category = 'General',
  tags = [],
  icon = '💡',
  likes = 0,
  completed = false,
  priority = 'medium',
  onLike,
  onToggleComplete,
  onDelete,
  children,
  className = '',
}) {
  const priorityClass = `card__priority--${priority.toLowerCase()}`;

  return (
    <article className={`card ${completed ? 'card--completed' : ''} ${className}`.trim()}>
      <div className="card__header">
        <div className="card__title-group">
          <span className="card__icon" role="img" aria-label="card icon">{icon}</span>
          <div>
            <span className="card__category">{category}</span>
            <h3 className="card__title">{title}</h3>
          </div>
        </div>

        <span className={`card__priority ${priorityClass}`}>
          {priority.toUpperCase()}
        </span>
      </div>

      <div className="card__body">
        <p className="card__description">{description}</p>
        
        {tags && tags.length > 0 && (
          <div className="card__tags">
            {tags.map((tag, idx) => (
              <span key={idx} className="card__tag">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {children && <div className="card__custom-content">{children}</div>}
      </div>

      <div className="card__footer">
        <div className="card__actions">
          {onLike && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onLike(id)}
              className="card__like-btn"
              title="Like this component"
            >
              ❤️ {likes}
            </Button>
          )}

          {onToggleComplete && (
            <Button
              variant={completed ? 'success' : 'secondary'}
              size="sm"
              onClick={() => onToggleComplete(id)}
            >
              {completed ? '✓ Completed' : '○ Mark Done'}
            </Button>
          )}
        </div>

        {onDelete && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(id)}
            className="card__delete-btn"
            title="Delete card"
          >
            🗑️
          </Button>
        )}
      </div>
    </article>
  );
}
