import TableHeader from './TableHeader/TableHeader';
import TableBody from './TableBody/TableBody';
import TableFooter from './TableFooter/TableFooter';
import TablePagination from './TableFooter/TablePagination';

const Table = ({ columns, data, onRowClick, tableState, setTableState }) => {
  const handleSearchChange = (column, value) => {
    setTableState((prevState) => ({
      ...prevState,
      valueSearch: { ...prevState.valueSearch, [column]: value },
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

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setTableState((prevState) => ({
      ...prevState,
      rowsPerPage: newRowsPerPage,
    }));
  };

  const handleResetSearch = () => {
    setTableState((prevState) => ({
      ...prevState,
      valueSearch: {},
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
        <button
          onClick={() => handleResetSearch({})}
          className="m-2 rounded bg-red-300 p-3"
        >
          Reset
        </button>
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
          <TablePagination
            page={tableState.page}
            rowsPerPage={tableState.rowsPerPage}
            count={filteredData.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </TableFooter>
      </table>
    </div>
  );
};

export default Table;
