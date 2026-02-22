const TableBody = ({ columns, data, onRowClick }) => {
  const handleRowClick = (item) => {
    if (onRowClick) {
      onRowClick(item);
    }
  };

  const renderCell = (row, column) => {
    if (column.render) {
      return column.render(row);
    } else {
      return row[column.key];
    }
  };

  return (
    <tbody className="divide-y divide-gray-200 bg-white">
      {data.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {columns.map((column) => (
            <td
              key={`${column.key}-${rowIndex}`}
              onClick={() =>
                !column.hiddenRowClick ? handleRowClick(row) : ''
              }
              className="whitespace-nowrap px-6 py-4 text-sm text-gray-900"
            >
              {renderCell(row, column)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default TableBody;
