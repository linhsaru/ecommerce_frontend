import { useController } from 'react-hook-form';

const CheckboxField = ({
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
    <div className={`flex items-center ${className}`}>
      <input
        {...inputProps}
        ref={ref}
        id={name}
        name={name}
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        {...rest}
      />
      <label htmlFor={name} className="ml-2 block text-sm text-gray-900">
        {label}
      </label>
      {invalid && (
        <p className="ml-2 text-sm text-red-600" role="alert">
          {error?.message || 'Invalid input'}
        </p>
      )}
    </div>
  );
};

export default CheckboxField;
