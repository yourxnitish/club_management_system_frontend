import React from 'react';
import { Star } from 'lucide-react';

export function StarRating({ rating = 0, onRatingChange, interactive = false, size = 'md' }) {
  const sizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRatingChange?.(star)}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} p-0.5 focus:outline-none`}
        >
          <Star
            className={`${sizes[size] || sizes.md} ${
              star <= Math.round(rating)
                ? 'fill-gold text-gold'
                : 'fill-transparent text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
}
