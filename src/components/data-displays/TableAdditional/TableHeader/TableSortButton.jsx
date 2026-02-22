const TableSortButton = ({
  column,
  sort,
  onSortChange,
  classNames,
  hidden,
}) => {
  if (hidden) {
    return;
  }
  return (
    <button
      onClick={() => onSortChange(column)}
      className={`text-gray-400 hover:text-gray-700 focus:text-gray-700 focus:outline-none ${classNames}`}
    >
      {sort.column === column ? (sort.direction === 'asc' ? '▲' : '▼') : '⇅'}
    </button>
  );
};

export default TableSortButton;
