const TablePagination = ({
  page,
  rowsPerPage,
  count,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const totalPages = Math.ceil(count / rowsPerPage);

  return (
    <div className="flex min-w-[600px] items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="mx-4 flex flex-1 items-center justify-start">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className={`relative inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium ${page === 1 ? 'cursor-default bg-gray-200 text-gray-500' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
        >
          Previous
        </button>
        <span className="ml-2 text-sm text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className={`relative ml-2 inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium ${page === totalPages ? 'cursor-default bg-gray-200 text-gray-500' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-end">
        {/* <div>
                    <p className="text-sm text-gray-700">
                        Showing
                        <span className="font-medium mx-1">{Math.min((page - 1) * rowsPerPage + 1, count)}</span>
                        to
                        <span className="font-medium mx-1">{Math.min(page * rowsPerPage, count)}</span>
                        of
                        <span className="font-medium mx-1">{count}</span>
                        results
                    </p>
                </div> */}
        <div>
          <label htmlFor="rowsPerPage" className="sr-only">
            Rows per page
          </label>
          <select
            id="rowsPerPage"
            name="rowsPerPage"
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="block rounded-md border-gray-300 py-2 pl-3 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TablePagination;
