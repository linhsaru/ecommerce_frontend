import { formatVnd } from '../../utils/price';

const PriceDisplay = ({ price, discountPrice, size = 'md', showDiscount = true, className = '' }) => {
  const hasDiscount = discountPrice && discountPrice < price;
  const discountPercent = hasDiscount ? Math.round(((price - discountPrice) / price) * 100) : 0;



  const sizes = {
    sm: { current: 'text-body-sm font-semibold', original: 'text-caption', badge: 'text-[10px] px-1.5 py-0.5' },
    md: { current: 'text-heading-md font-bold', original: 'text-body-sm', badge: 'text-caption px-2 py-0.5' },
    lg: { current: 'text-display-sm font-bold', original: 'text-body-md', badge: 'text-body-sm px-2.5 py-1' },
    xl: { current: 'text-display-md font-bold', original: 'text-heading-sm', badge: 'text-body-sm px-3 py-1' },
  };

  const s = sizes[size];

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      <span className={`${s.current} ${hasDiscount ? 'text-danger-600' : 'text-neutral-900'}`}>
        {formatVnd(hasDiscount ? discountPrice : price)}
      </span>
      {hasDiscount && (
        <>
          <span className={`${s.original} text-neutral-400 line-through`}>
            {formatVnd(price)}
          </span>
          {showDiscount && (
            <span className={`${s.badge} bg-danger-50 text-danger-600 rounded-full font-semibold`}>
              -{discountPercent}%
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default PriceDisplay;
