import { useController } from 'react-hook-form';

const SelectField = ({
  name,
  label,
  control,
  options = [],
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
    defaultValue: defaultValue.value || '',
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
      <select
        {...inputProps}
        ref={ref}
        id={name}
        name={name}
        {...rest}
        className={`mt-1 block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${invalid ? 'border-red-500' : ''}`}
      >
        {defaultValue !== '' && (
          <option value={defaultValue.value} disabled={defaultValue.disabled}>
            {defaultValue.label}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {invalid && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error?.message || 'Invalid input'}
        </p>
      )}
    </div>
  );
};

export default SelectField;
