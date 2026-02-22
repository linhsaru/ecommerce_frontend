import { useState } from 'react';
import Select from '../common/Select/Select';
import useClickOutside from '../../hooks/useClickOutside';
import Input from '../common/Input/Input';
import { dataFilterExample } from '../../configs/filter-configs/valueFilterTable';

const Filter = ({
  dataFilter = dataFilterExample,
  onFilterChange,
  showFilterContent,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRefs = useClickOutside(() => setOpen(false));
  const [filters, setFilters] = useState(
    dataFilter.reduce((acc, filter) => {
      acc[filter.fieldName] = filter.defaultValue || '';
      return acc;
    }, {})
  );

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const renderFilterField = (filter) => {
    switch (filter.type) {
      case 'text':
        return (
          <Input
            type="text"
            disabled={filter.disabled}
            value={filters[filter.fieldName]}
            onChange={(e) =>
              handleFilterChange(filter.fieldName, e.target.value)
            }
            className="w-full"
            placeholder={filter.label}
          />
        );
      case 'select':
        return (
          <Select
            options={filter.options}
            value={filters[filter.fieldName]}
            onChange={(value) => handleFilterChange(filter.fieldName, value)}
            isMulti={filter.subtype === 'multiple'}
            placeholder={filter.label}
          />
        );
      case 'checkbox':
        return filter?.options?.map((option) => (
          <label key={option.value} className="flex items-center">
            <input
              type="checkbox"
              disabled={option.disabled}
              checked={filters[filter.fieldName].includes(option.value)}
              onChange={() => {
                const newValue = filters[filter.fieldName].includes(
                  option.value
                )
                  ? filters[filter.fieldName].filter(
                      (val) => val !== option.value
                    )
                  : [...filters[filter.fieldName], option.value];
                handleFilterChange(filter.fieldName, newValue);
              }}
            />
            <span
              className={`ml-2 ${option.disabled ? 'select-none opacity-50' : ''}`}
            >
              {option.icon} {option.label}
            </span>
          </label>
        ));
      case 'radio':
        return filter.options.map((option) => (
          <label key={option.value} className="flex items-center">
            <input
              type="radio"
              disabled={option.disabled}
              name={filter.fieldName}
              checked={filters[filter.fieldName] === option.value}
              onChange={() =>
                handleFilterChange(filter.fieldName, option.value)
              }
            />
            <span
              className={`ml-2 ${option.disabled ? 'select-none opacity-50' : ''}`}
            >
              {option.icon} {option.label}
            </span>
          </label>
        ));
      case 'date':
        return (
          <input
            disabled={filter.disabled}
            type="date"
            value={filters[filter.fieldName]}
            onChange={(e) =>
              handleFilterChange(filter.fieldName, e.target.value)
            }
            className="input-class"
          />
        );
      case 'switch':
        return (
          <label className="flex cursor-pointer items-center">
            <input
              disabled={filter.disabled}
              type="checkbox"
              checked={filters[filter.fieldName]}
              onChange={(e) =>
                handleFilterChange(filter.fieldName, e.target.checked)
              }
              className="sr-only"
            />
            <div className="relative">
              <div
                className={`${filter.disabled ? 'cursor-not-allowed opacity-50' : ''} flex h-6 w-10 items-center rounded-full ${
                  filters[filter.fieldName]
                    ? 'border bg-green-500'
                    : 'bg-gray-400'
                } p-1 shadow-inner transition-colors duration-300`}
              >
                <div
                  className={`h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
                    filters[filter.fieldName]
                      ? 'translate-x-4 ring-1 ring-white'
                      : 'ring-1 ring-white'
                  }`}
                />
              </div>
            </div>
          </label>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-end" ref={dropdownRefs}>
      <div className="relative">
        <button
          className="mt-2 w-40 rounded bg-white p-2"
          onClick={() => setOpen(!open)}
        >
          {' '}
          {showFilterContent
            ? showFilterContent
            : open
              ? 'Hidden Filter'
              : 'Show Filter'}
        </button>
        {open && (
          <div className="absolute right-0 my-4 flex min-w-[430px] flex-col rounded-[24px] border bg-white p-4">
            {dataFilter.map((filter) => (
              <div key={filter.fieldName} className="mb-4">
                <label className="mb-2 flex items-center text-sm font-medium">
                  {filter.icon && <span className="mr-2">{filter.icon}</span>}
                  {filter.label}
                </label>
                <div className="ml-4">{renderFilterField(filter)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Filter;
