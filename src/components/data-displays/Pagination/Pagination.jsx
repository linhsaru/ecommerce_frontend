import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const getPageItems = (page, totalPages) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items = [];
  items.push(1, 2);

  if (page <= 4) {
    for (let p = 3; p <= 5 && p < totalPages; p += 1) {
      items.push(p);
    }
    if (5 < totalPages - 1) {
      items.push('ellipsis-right');
    }
  } else if (page >= totalPages - 3) {
    if (totalPages - 4 > 2) {
      items.push('ellipsis-left');
    }
    for (let p = totalPages - 4; p < totalPages; p += 1) {
      if (p > 2) {
        items.push(p);
      }
    }
  } else {
    if (page - 1 > 3) {
      items.push('ellipsis-left');
    }
    for (let p = page - 1; p <= page + 1; p += 1) {
      if (p > 2 && p < totalPages) {
        items.push(p);
      }
    }
    if (page + 1 < totalPages - 1) {
      items.push('ellipsis-right');
    }
  }

  if (totalPages > 1) {
    items.push(totalPages);
  }

  const seen = new Set();
  return items.filter((item) => {
    const key = String(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const Pagination = ({ page, count, onPageChange, pageSize = 10 }) => {
  const totalPages = Math.max(1, Math.ceil(count / pageSize));
  const items = getPageItems(page, totalPages);

  return (
    <div className="mt-1 flex w-full items-center justify-end space-x-1 font-medium text-xs">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="flex items-center justify-center rounded-md p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
      >
        <HiChevronLeft className="h-4 w-4" />
      </button>
      {items.map((item, idx) =>
        typeof item === 'number' ? (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            className={`flex min-w-[30px] min-h-[30px] items-center justify-center rounded-md px-2 py-2 ${item === page
              ? 'bg-primary-500 text-white'
              : 'bg-transparent text-slate-600 hover:bg-primary-100 hover:text-primary-600'
              }`}
          >
            {item}
          </button>
        ) : (
          <span key={`${item}-${idx}`} className="flex items-center justify-center px-2 text-slate-400">
            ...
          </span>
        )
      )}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="flex items-center justify-center rounded-md p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
      >
        <HiChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Pagination;
