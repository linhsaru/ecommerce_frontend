export const getExamplePageColumns = (handleEdit, handleDelete) => {
  return [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name', search: 'input', placeholder: 'Search demo' },
    {
      key: 'email',
      label: 'Email',
      search: 'select',
      hiddenSort: true,
      multiple: true,
      options: [
        { value: 'male', label: 'Male', icon: '🐜' },
        { value: 'female', label: 'Female', icon: '🍪' },
      ],
    },
    {
      key: 'actions',
      label: 'Actions',
      hiddenSort: true,
      hiddenRowClick: true,
      render: (item) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(item.id)}
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(item.id)}
            className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];
};
