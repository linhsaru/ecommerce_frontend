/**
 * Global error handling and logging utilities
 */

export class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = {
  // Log error to console and potentially to external service
  logError: (error, context = {}) => {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('Error logged:', errorInfo);
    }

    // In production, you might want to send to error tracking service
    // Example: Sentry, LogRocket, etc.
    // errorTrackingService.captureException(error, { extra: context });
  },

  // Handle API errors
  handleApiError: (error) => {
    let message = 'An unexpected error occurred';
    let statusCode = 500;

    if (error.response) {
      // Server responded with error
      statusCode = error.response.status;
      message = error.response.data?.message || error.message;
    } else if (error.request) {
      // Network error
      message = 'Network error - Please check your connection';
    } else {
      // Other error
      message = error.message;
    }

    return new AppError(message, statusCode);
  },

  // Handle form validation errors
  handleValidationError: (errors) => {
    const formattedErrors = {};

    if (Array.isArray(errors)) {
      errors.forEach(error => {
        if (error.field && error.message) {
          formattedErrors[error.field] = error.message;
        }
      });
    } else if (typeof errors === 'object') {
      Object.assign(formattedErrors, errors);
    }

    return formattedErrors;
  },

  // Show user-friendly error message
  showErrorMessage: (error, showToast = true) => {
    const message = error.message || 'Something went wrong';

    if (showToast) {
      // You can integrate with your toast notification system here
      // Example: toast.error(message);
      console.error('Error message:', message);
    }

    return message;
  },

  // Global error boundary handler
  handleGlobalError: (error, errorInfo) => {
    errorHandler.logError(error, {
      componentStack: errorInfo?.componentStack,
      type: 'global_error',
    });

    // In development, show error overlay
    if (import.meta.env.DEV) {
      console.error('Global error:', error, errorInfo);
    }
  },

  // Async error wrapper
  asyncErrorHandler: (fn) => {
    return (...args) => {
      const result = fn(...args);
      if (result && typeof result.catch === 'function') {
        return result.catch(error => {
          errorHandler.logError(error);
          throw error;
        });
      }
      return result;
    };
  },
};
