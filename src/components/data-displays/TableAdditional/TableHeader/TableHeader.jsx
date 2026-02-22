import Filter from '../../Filter';
import TableSearch from './TableSearch';
import TableSortButton from './TableSortButton';

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
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
