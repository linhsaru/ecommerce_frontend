import { forwardRef } from 'react';
import { clsx } from 'clsx';

const Input = forwardRef(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  labelClassName = '',
  inputClassName = '',
  ...props
}, ref) => {
  const inputClasses = clsx(
    'block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm',
    {
      'border-gray-300': !error,
      'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500': error,
      'bg-gray-50 cursor-not-allowed': disabled,
    },
    inputClassName
  );

  return (
    <div className={clsx('space-y-1', className)}>
      {label && (
        <label className={clsx('block text-sm font-medium text-gray-700', labelClassName)}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={inputClasses}
        {...props}
      />

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
