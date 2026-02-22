import { useController } from 'react-hook-form';

const TextField = ({
  name,
  label,
  control,
  defaultValue = '',
  className = '',
  rules = {},
  ...rest
}) => {
  const {
    field: { ref, ...inputProps },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
    defaultValue,
    rules,
  });

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <input
        {...inputProps}
        ref={ref}
        id={name}
        name={name}
        autoComplete={'off'}
        {...rest}
        className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${invalid ? 'border-red-500' : ''}`}
      />
      {invalid && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error?.message || 'Invalid input'}
        </p>
      )}
    </div>
  );
};

export default TextField;
