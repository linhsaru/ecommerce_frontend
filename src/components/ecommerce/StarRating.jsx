import { HiStar } from 'react-icons/hi2';

const StarRating = ({ rating = 0, maxRating = 5, size = 'md', showValue = false, reviewCount = null, interactive = false, onChange = null }) => {
  const sizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4.5 h-4.5',
    lg: 'w-5.5 h-5.5',
    xl: 'w-6 h-6',
  };

  const textSizes = {
    sm: 'text-caption',
    md: 'text-body-sm',
    lg: 'text-body-md',
    xl: 'text-heading-sm',
  };

  const handleClick = (index) => {
    if (interactive && onChange) {
      onChange(index + 1);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }, (_, index) => {
          const filled = index < Math.floor(rating);
          const partial = index === Math.floor(rating) && rating % 1 !== 0;
          const percentage = partial ? (rating % 1) * 100 : 0;

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleClick(index)}
              className={`relative ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
              disabled={!interactive}
            >
              {/* Background star (empty) */}
              <HiStar className={`${sizes[size]} text-neutral-200`} />
              {/* Filled star overlay */}
              {(filled || partial) && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: filled ? '100%' : `${percentage}%` }}
                >
                  <HiStar className={`${sizes[size]} text-amber-400`} />
                </div>
              )}
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className={`${textSizes[size]} font-semibold text-neutral-800`}>
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== null && (
        <span className={`${textSizes[size]} text-neutral-500`}>
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
};

export default StarRating;
