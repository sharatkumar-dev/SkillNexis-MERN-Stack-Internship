import React from 'react';
import { Star, StarHalf } from 'lucide-react';

export const Rating = ({ value = 0, text = '', size = 16 }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
      <div style={{ display: 'flex', color: '#f59e0b' }}>
        {[1, 2, 3, 4, 5].map((index) => {
          if (value >= index) {
            return <Star key={index} size={size} fill="#f59e0b" />;
          } else if (value >= index - 0.5) {
            return <StarHalf key={index} size={size} fill="#f59e0b" />;
          } else {
            return <Star key={index} size={size} stroke="#475569" fill="transparent" />;
          }
        })}
      </div>
      {text && (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.2rem' }}>
          {text}
        </span>
      )}
    </div>
  );
};

export default Rating;
