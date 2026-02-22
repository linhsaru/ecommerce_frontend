import TableSortButton from './TableSortButton';
import TableSearch from './TableSearch';
import TableSelect from './TableSelect';

const TableHeader = ({
  columns,
  sort,
  onSortChange,
  onSearchChange,
  valueSearch,
}) => {
  return (
    <thead className="bg-gray-100">
      <tr>
        {columns.map((column) => (
          <th
            key={column.key}
            className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500"
          >
            <div className="flex items-center justify-between">
              <span className="mr-1">{column.label}</span>
              <TableSortButton
                hidden={column.hiddenSort}
                column={column.key}
                sort={sort}
                onSortChange={onSortChange}
                classNames="text-gray-400 hover:text-gray-700 focus:outline-none focus:text-gray-700"
              />
            </div>
            {!column?.search && (
              <div className="mt-2 block h-[38px] w-full px-3 py-2"></div>
            )}
            {column?.search === 'input' && (
              <TableSearch
                column={column}
                onSearchChange={onSearchChange}
                classNames="mt-2 block min-w-[80px] w-full px-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
              />
            )}
            {column?.search === 'select' && (
              <TableSelect
                multiple={column.multiple}
                options={column.options}
                placeholder="Select options"
                column={column}
                onSearchChange={onSearchChange}
                valueSearch={valueSearch}
                classNames="mt-2 block min-w-[80px] w-full px-3 py-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
              />
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
