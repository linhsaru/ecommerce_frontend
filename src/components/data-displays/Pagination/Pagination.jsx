const Pagination = ({ page, count, onPageChange }) => {
  const totalPages = Math.ceil(count / 10); // Giả sử mỗi trang có 10 mục

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="mt-4 flex w-full items-center justify-center space-x-2 font-bold">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
      >
        &lt;
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`rounded-md border px-4 py-2 ${p === page ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'} hover:bg-blue-100`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
