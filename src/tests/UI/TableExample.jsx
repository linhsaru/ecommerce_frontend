import { useState } from 'react';
import Table from '../../components/data-displays/Table';
import { getExamplePageColumns } from '../../configs/table-configs/columns/examplePageColumns';

const TableExample = () => {
  const [tableState, setTableState] = useState({
    valueSearch: {},
    sort: { column: null, direction: 'asc' },
    page: 1,
    rowsPerPage: 5,
  });

  const handleEdit = (id) => {
    console.log(`Edit item with ID ${id}`);
    // Add your edit logic here
  };

  const handleDelete = (id) => {
    console.log(`Delete item with ID ${id}`);
    // Add your delete logic here
  };
  const columns = getExamplePageColumns(handleEdit, handleDelete);
  const data = [
    { id: 1, age: 'Demo', name: 'John Doe', email: 'john.doe@example.com' },
    { id: 2, age: 'Demo', name: 'Jane Smith', email: 'jane.smith@example.com' },
    { id: 3, age: 'Demo', name: 'Sam Green', email: 'sam.green@example.com' },
    {
      id: 4,
      age: 'Demo',
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
    },
    { id: 5, age: 'Demo', name: 'Bob Brown', email: 'bob.brown@example.com' },
    {
      id: 6,
      age: 'Demo',
      name: 'Charlie White',
      email: 'charlie.white@example.com',
    },
    {
      id: 7,
      age: 'Demo',
      name: 'David Black',
      email: 'david.black@example.com',
    },
    { id: 8, age: 'Demo', name: 'Eva Blue', email: 'eva.blue@example.com' },
    {
      id: 9,
      age: 'Demo',
      name: 'Frank Yellow',
      email: 'frank.yellow@example.com',
    },
    {
      id: 10,
      age: 'Demo',
      name: 'Grace Pink',
      email: 'grace.pink@example.com',
    },
    { id: 13, age: 'Demo', name: 'Sam Green', email: 'sam.green@example.com' },
    {
      id: 14,
      age: 'Demo',
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
    },
    { id: 15, age: 'Demo', name: 'Bob Brown', email: 'bob.brown@example.com' },
    {
      id: 16,
      age: 'Demo',
      name: 'Charlie White',
      email: 'charlie.white@example.com',
    },
    {
      id: 17,
      age: 'Demo',
      name: 'David Black',
      email: 'david.black@example.com',
    },
    { id: 18, age: 'Demo', name: 'Eva Blue', email: 'eva.blue@example.com' },
    {
      id: 19,
      age: 'Demo',
      name: 'Frank Yellow',
      email: 'frank.yellow@example.com',
    },
    {
      id: 20,
      age: 'Demo',
      name: 'Grace Pink',
      email: 'grace.pink@example.com',
    },
    { id: 23, age: 'Demo', name: 'Sam Green', email: 'sam.green@example.com' },
    {
      id: 24,
      age: 'Demo',
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
    },
    { id: 25, age: 'Demo', name: 'Bob Brown', email: 'bob.brown@example.com' },
    {
      id: 26,
      age: 'Demo',
      name: 'Charlie White',
      email: 'charlie.white@example.com',
    },
    {
      id: 27,
      age: 'Demo',
      name: 'David Black',
      email: 'david.black@example.com',
    },
    { id: 28, age: 'Demo', name: 'Eva Blue', email: 'eva.blue@example.com' },
    {
      id: 29,
      age: 'Demo',
      name: 'Frank Yellow',
      email: 'frank.yellow@example.com',
    },
    {
      id: 30,
      age: 'Demo',
      name: 'Grace Pink',
      email: 'grace.pink@example.com',
    },
  ];

  const handleRowClick = (item) => {
    console.log(`Clicked row with ID ${item.id}`);
  };

  return (
    <div>
      <div>
        <h1 className="mb-4 text-2xl font-bold">Table Example</h1>

        <div className="my-4 flex justify-between gap-4">
          <div className="mt-4 w-full">
            <h2 className="my-2 text-xl font-semibold">Search :</h2>
            <pre className="rounded bg-gray-100 p-4">
              {JSON.stringify(tableState, null, 2)}
            </pre>
          </div>
        </div>
        <Table
          tableState={tableState}
          setTableState={setTableState}
          columns={columns}
          data={data}
          onRowClick={handleRowClick}
        />
      </div>
    </div>
  );
};

export default TableExample;
