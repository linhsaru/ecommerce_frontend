import { clsx } from 'clsx';

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  showFirstLast = true,
  maxVisiblePages = 5,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - delta);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();

  const PageButton = ({ page, children, disabled, active, ...props }) => (
    <button
      onClick={() => !disabled && onPageChange(page)}
      disabled={disabled}
      className={clsx(
        'relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200',
        {
          'bg-blue-600 text-white hover:bg-blue-700': active,
          'text-gray-700 hover:bg-gray-50 border border-gray-300 bg-white': !active && !disabled,
          'text-gray-400 cursor-not-allowed': disabled,
        }
      )}
      {...props}
    >
      {children}
    </button>
  );

  return (
    <nav className={clsx('flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6', className)}>
      <div className="flex justify-between flex-1 sm:hidden">
        <PageButton
          page={currentPage - 1}
          disabled={currentPage <= 1}
        >
          Previous
        </PageButton>
        <PageButton
          page={currentPage + 1}
          disabled={currentPage >= totalPages}
        >
          Next
        </PageButton>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Page <span className="font-medium">{currentPage}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>

        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            {/* First page */}
            {showFirstLast && currentPage > maxVisiblePages - 1 && (
              <>
                <PageButton page={1}>
                  1
                </PageButton>
                {currentPage > maxVisiblePages && (
                  <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300">
                    ...
                  </span>
                )}
              </>
            )}

            {/* Visible pages */}
            {visiblePages.map(page => (
              <PageButton
                key={page}
                page={page}
                active={page === currentPage}
              >
                {page}
              </PageButton>
            ))}

            {/* Last page */}
            {showFirstLast && currentPage < totalPages - maxVisiblePages + 2 && (
              <>
                {currentPage < totalPages - maxVisiblePages + 1 && (
                  <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300">
                    ...
                  </span>
                )}
                <PageButton page={totalPages}>
                  {totalPages}
                </PageButton>
              </>
            )}
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default Pagination;
