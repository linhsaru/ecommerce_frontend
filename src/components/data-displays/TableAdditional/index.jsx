import TableHeader from './TableHeader/TableHeader';
import TableBody from './TableBody/TableBody';
import TableFooter from './TableFooter/TableFooter';
import Pagination from '../Pagination/Pagination';

const TableAdditional = ({
  columns,
  data,
  onRowClick,
  tableState,
  setTableState,
}) => {
  const handleSearchChange = (value) => {
    setTableState((prevState) => ({
      ...prevState,
      valueSearch: value,
    }));
  };

  const handleSortChange = (column) => {
    setTableState((prevState) => ({
      ...prevState,
      sort: {
        column,
        direction:
          prevState.sort.column === column && prevState.sort.direction === 'asc'
            ? 'desc'
            : 'asc',
      },
    }));
  };

  const handlePageChange = (newPage) => {
    setTableState((prevState) => ({
      ...prevState,
      page: newPage,
    }));
  };

  const filteredData = data; // Thêm logic lọc dữ liệu nếu cần

  const sortedData = filteredData.sort((a, b) => {
    if (a[tableState.sort.column] < b[tableState.sort.column])
      return tableState.sort.direction === 'asc' ? -1 : 1;
    if (a[tableState.sort.column] > b[tableState.sort.column])
      return tableState.sort.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedData = sortedData.slice(
    (tableState.page - 1) * tableState.rowsPerPage,
    tableState.page * tableState.rowsPerPage
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-gray-200 bg-white shadow">
        <TableHeader
          columns={columns}
          sort={tableState.sort}
          onSortChange={handleSortChange}
          onSearchChange={handleSearchChange}
          valueSearch={tableState.valueSearch}
        />
        <TableBody
          columns={columns}
          data={paginatedData}
          onRowClick={onRowClick}
        />
        <TableFooter>
          <Pagination
            page={tableState.page}
            count={filteredData.length}
            onPageChange={handlePageChange}
          />
        </TableFooter>
      </table>
    </div>
  );
};

export default TableAdditional;
