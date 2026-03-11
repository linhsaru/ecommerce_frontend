import { HiMinus, HiPlus } from 'react-icons/hi2';

const QuantitySelector = ({ quantity, onChange, min = 1, max = 99, size = 'md' }) => {
  const sizes = {
    sm: { btn: 'w-7 h-7', text: 'text-body-sm w-8', gap: 'gap-0' },
    md: { btn: 'w-9 h-9', text: 'text-body-md w-10', gap: 'gap-0' },
    lg: { btn: 'w-11 h-11', text: 'text-heading-sm w-12', gap: 'gap-0' },
  };

  const s = sizes[size];

  const decrease = () => {
    if (quantity > min) onChange(quantity - 1);
  };

  const increase = () => {
    if (quantity < max) onChange(quantity + 1);
  };

  return (
    <div className={`inline-flex items-center ${s.gap} border border-neutral-200 rounded-xl overflow-hidden bg-white`}>
      <button
        onClick={decrease}
        disabled={quantity <= min}
        className={`${s.btn} flex items-center justify-center text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150`}
      >
        <HiMinus className="w-3.5 h-3.5" />
      </button>
      <span className={`${s.text} text-center font-semibold text-neutral-800 select-none border-x border-neutral-200`}>
        {quantity}
      </span>
      <button
        onClick={increase}
        disabled={quantity >= max}
        className={`${s.btn} flex items-center justify-center text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150`}
      >
        <HiPlus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default QuantitySelector;
