import React, { useState, useEffect } from 'react';
import useClickOutside from '../../../hooks/useClickOutside';

const Select = (props) => {
  const { options, value, onChange, isMulti } = props;
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const dropdownRefs = useClickOutside(() => setOpen(false));

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handleSelect = (option) => {
    if (isMulti) {
      if (selectedValue.includes(option.value)) {
        const newValue = selectedValue.filter((val) => val !== option.value);
        setSelectedValue(newValue);
        onChange(newValue);
      } else {
        const newValue = [...selectedValue, option.value];
        setSelectedValue(newValue);
        onChange(newValue);
      }
    } else {
      setSelectedValue(option.value);
      onChange(option.value);
      setOpen(false);
    }
  };

  const handleRemove = (optionValue) => {
    const newValue = selectedValue.filter((val) => val !== optionValue);
    setSelectedValue(newValue);
    onChange(newValue);
  };

  const isSelected = (option) => {
    return isMulti
      ? selectedValue.includes(option.value)
      : selectedValue === option.value;
  };

  return (
    <div className="relative" ref={dropdownRefs}>
      <div
        className="flex cursor-pointer rounded border bg-white p-2"
        onClick={() => setOpen(!open)}
      >
        {isMulti ? (
          <div className="flex w-full flex-wrap gap-1">
            {options
              .filter((option) => selectedValue.includes(option.value))
              .map((option, index, array) => (
                <React.Fragment key={option.value}>
                  <p className="flex gap-1 rounded border p-1">
                    {option.label}
                    <button
                      className="flex h-6 w-6 items-center justify-center rounded-full border p-1 hover:border-red-400 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(option.value);
                      }}
                    >
                      ✘
                    </button>
                  </p>
                  {index < array.length - 1 && ', '}
                </React.Fragment>
              ))}
            {options.filter((option) => selectedValue.includes(option.value))
              .length === 0 && 'Select...'}
          </div>
        ) : (
          <div className="flex w-full flex-wrap gap-1">
            {options.find((option) => option.value === selectedValue)?.label ||
              'Select...'}
          </div>
        )}
        <div className="flex items-center justify-center">
          <span
            className={`transform transition-transform ${open ? 'rotate-180' : ''}`}
          >
            &#9660;
          </span>
        </div>
      </div>
      {open && (
        <div className="absolute z-10 mt-2 max-h-60 w-full overflow-y-auto rounded border bg-white">
          {options.map((option) => (
            <div
              key={option.value}
              disabled={option.disabled}
              className={`flex cursor-pointer items-center p-2 hover:bg-gray-200 ${isSelected(option) ? 'bg-gray-300' : ''} ${option.disabled ? 'cursor-not-allowed select-none opacity-50' : ''}`}
              onClick={() => {
                if (option.disabled) return;
                handleSelect(option);
              }}
            >
              {option.icon && <span className="mr-2">{option.icon}</span>}
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
