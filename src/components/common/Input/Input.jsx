const Input = ({ type, placeholder, className, ...rest }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`rounded-md border border-gray-300 p-2 outline-none ${className}`}
      {...rest}
    />
  );
};

export default Input;
