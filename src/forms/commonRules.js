export const usernameRules = {
  required: 'Username is required',
  minLength: {
    value: 3,
    message: 'Username must be at least 3 characters',
  },
  maxLength: {
    value: 20,
    message: 'Username must not exceed 20 characters',
  },
  pattern: {
    value: /^[a-zA-Z0-9_]+$/,
    message: 'Username can only contain letters, numbers, and underscores',
  },
};

export const emailRules = {
  required: 'Email is required',
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Invalid email address',
  },
};

export const passwordRules = {
  required: 'Password is required',
  minLength: {
    value: 6,
    message: 'Password must be at least 6 characters',
  },
};

export const fullNameRules = {
  required: 'Full name is required',
  minLength: {
    value: 2,
    message: 'Full name must be at least 2 characters',
  },
  maxLength: {
    value: 50,
    message: 'Full name must not exceed 50 characters',
  },
};

export const addressRules = {
  required: 'Address is required',
  minLength: {
    value: 5,
    message: 'Address must be at least 5 characters',
  },
  maxLength: {
    value: 100,
    message: 'Address must not exceed 100 characters',
  },
};
