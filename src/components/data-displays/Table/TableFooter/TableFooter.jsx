const TableFooter = ({ children }) => {
  return (
    <tfoot className="">
      <tr>
        <td colSpan="100%">{children}</td>
      </tr>
    </tfoot>
  );
};

export default TableFooter;
