const TableFooter = ({ children }) => {
  return (
    <tfoot className="divide-y divide-gray-200 bg-white">
      <tr>
        <td colSpan="100%">{children}</td>
      </tr>
    </tfoot>
  );
};

export default TableFooter;
