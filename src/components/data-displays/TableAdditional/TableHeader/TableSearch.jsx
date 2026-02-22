/* eslint-disable react-hooks/exhaustive-deps */
import debounce from 'lodash.debounce';
import { useCallback } from 'react';
import Input from '../../../common/Input/Input';

const TableSearch = ({ onSearchChange, classNames }) => {
  const debouncedChangeHandler = useCallback(
    debounce((value) => {
      onSearchChange(value);
    }, 500),
    []
  );

  return (
    <Input
      className={`${classNames}`}
      type="text"
      placeholder={''}
      onChange={(e) => debouncedChangeHandler(e.target.value)}
    />
  );
};

export default TableSearch;
