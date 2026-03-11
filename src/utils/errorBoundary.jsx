import { errorHandler } from '../services';

/**
 * Global error handling utilities for the application
 */

export const globalErrorHandler = {
  /**
   * Initialize global error handlers
   */
  initialize: () => {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      errorHandler.logError(event.reason, {
        type: 'unhandled_promise_rejection',
        promise: event.promise,
      });

      // Prevent the default handler from firing
      event.preventDefault();
    });

    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      errorHandler.logError(event.error, {
        type: 'uncaught_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    // Handle console errors in production (optional)
    if (import.meta.env.PROD) {
      const originalConsoleError = console.error;
      console.error = (...args) => {
        // Log to external service
        errorHandler.logError(new Error(args.join(' ')), {
          type: 'console_error',
          originalArgs: args,
        });

        // Call original console.error
        originalConsoleError.apply(console, args);
      };
    }
  },

  /**
   * Report error to external service (extend this for your error tracking)
   * @param {Error} error - Error object
   * @param {object} context - Additional context
   */
  reportError: (error, context = {}) => {
    // Example: Send to error tracking service
    // Sentry, LogRocket, Bugsnag, etc.

    const errorReport = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: sessionStorage.getItem('userId'), // If you store user ID
      context,
    };

    // In development, log to console
    if (import.meta.env.DEV) {
      console.error('Error reported:', errorReport);
    }

    // In production, send to error tracking service
    if (import.meta.env.PROD) {
      // Example: Send to your error tracking service
      // errorTrackingService.captureException(error, { extra: context });
      console.error('Production error:', errorReport);
    }
  },

  /**
   * Create a safe async function wrapper
   * @param {Function} fn - Function to wrap
   * @returns {Function} Wrapped function
   */
  safeAsync: (fn) => {
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

  /**
   * Wrap component render with error boundary
   * @param {React.Component} Component - Component to wrap
   * @param {object} options - Error boundary options
   * @returns {React.Component} Wrapped component
   */
  withErrorBoundary: (Component, options = {}) => {
    const {
      fallback: FallbackComponent,
      onError,
    } = options;

    class WrappedComponent extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
      }

      static getDerivedStateFromError(error) {
        return { hasError: true, error };
      }

      componentDidCatch(error, errorInfo) {
        errorHandler.handleGlobalError(error, errorInfo);

        if (onError) {
          onError(error, errorInfo);
        }
      }

      render() {
        if (this.state.hasError) {
          if (FallbackComponent) {
            return <FallbackComponent error={this.state.error} />;
          }

          return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <h3 className="text-red-800 font-medium">Something went wrong</h3>
              <p className="text-red-600 text-sm mt-1">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
            </div>
          );
        }

        return <Component {...this.props} />;
      }
    }

    WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

    return WrappedComponent;
  },
};
