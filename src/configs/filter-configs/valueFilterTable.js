export const dataFilterExample = [
  {
    fieldName: 'name',
    label: 'Name',
    type: 'text',
    defaultValue: '',
  },
  {
    fieldName: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { value: 'tech', label: 'Tech', icon: '🔍', disabled: true },
      { value: 'health', label: 'Health', icon: '🔍' },
    ],
    defaultValue: '',
  },
  {
    fieldName: 'tags',
    label: 'Tags',
    type: 'select',
    options: [
      {
        value: 'frontend',
        label: 'Frontend',
        icon: '🌐',
        disabled: true,
      },
      { value: 'backend', label: 'Backend', icon: '💻' },
      { value: 'fullstack', label: 'Fullstack', icon: '🔧' },
    ],
    subtype: 'multiple',
    defaultValue: [],
  },
  {
    fieldName: 'status',
    label: 'Status',
    type: 'checkbox',
    options: [
      { value: 'active', label: 'Active', icon: '✅', disabled: true },
      { value: 'inactive', label: 'Inactive', icon: '❌' },
    ],
    defaultValue: [],
  },
  {
    fieldName: 'priority',
    label: 'Priority',
    type: 'radio',
    options: [
      { value: 'high', label: 'High', icon: '⬆️' },
      { value: 'medium', label: 'Medium', icon: '↔️' },
      { value: 'low', label: 'Low', icon: '⬇️' },
    ],
    defaultValue: 'medium',
  },
  {
    fieldName: 'deadline',
    label: 'Deadline',
    type: 'date',
    disabled: true,
    defaultValue: '',
  },
  {
    fieldName: 'notification',
    label: 'Notification',
    type: 'switch',
    disabled: true,
    defaultValue: false,
  },
  {
    fieldName: 'open',
    label: 'Open',
    type: 'switch',
    defaultValue: true,
  },
];

export const dataFilterUserExample = [
  {
    fieldName: 'name',
    label: 'Name',
    type: 'text',
    defaultValue: '',
  },
  {
    fieldName: 'email',
    label: 'Email',
    type: 'text',
    defaultValue: '',
  },
  {
    fieldName: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { value: 'tech', label: 'Tech', icon: '🔍', disabled: true },
      { value: 'health', label: 'Health', icon: '🔍' },
    ],
    defaultValue: '',
  },
];
