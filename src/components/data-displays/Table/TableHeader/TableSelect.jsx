import { useEffect, useState } from 'react';
import useClickOutside from '../../../../hooks/useClickOutside';

const TableSelect = ({
  options,
  column,
  placeholder = 'Select...',
  onSearchChange,
  multiple,
  valueSearch,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const dropdownRef = useClickOutside(() => setIsOpen(false));

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option) => {
    if (multiple) {
      const newSelectedOptions = selectedOptions?.some(
        (data) => data.value === option.value
      )
        ? selectedOptions.filter((selected) => selected.value !== option.value)
        : [...selectedOptions, option];
      setSelectedOptions(newSelectedOptions);
      onSearchChange(
        column.key,
        newSelectedOptions?.map((item) => item.value)
      );
    } else {
      setSelectedOptions([option]);
      onSearchChange(column.key, option.value);
    }
  };

  useEffect(() => {
    if (valueSearch[column.key] === undefined) {
      setSelectedOptions([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueSearch[column?.key]]);

  return (
    <div className="relative mt-2 w-full max-w-xs" ref={dropdownRef}>
      <div
        className="mt-2 flex w-full cursor-pointer justify-between rounded-md border border-gray-300 p-2 px-3 shadow-sm outline-none focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        onClick={toggleDropdown}
      >
        <span>
          {selectedOptions.length > 0
            ? selectedOptions.map((option) => option.label).join(', ')
            : placeholder}
        </span>
        <span
          className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          &#9660;
        </span>
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full rounded border border-gray-300 bg-white">
          {options.map((option) => (
            <div
              key={option.value}
              className={`cursor-pointer p-2 hover:bg-gray-200 ${
                selectedOptions?.some((data) => data.value === option.value)
                  ? 'bg-gray-200'
                  : ''
              }`}
              onClick={() => handleOptionClick(option)}
            >
              <div className="flex gap-2">
                <div>{option.icon}</div>
                <p>{option.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TableSelect;
