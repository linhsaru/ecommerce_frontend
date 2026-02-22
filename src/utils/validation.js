/**
 * Validation utilities for forms and data
 */

export const validationUtils = {
  /**
   * Validate email address
   * @param {string} email - Email to validate
   * @returns {boolean} True if email is valid
   */
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate phone number (basic validation)
   * @param {string} phone - Phone number to validate
   * @returns {boolean} True if phone is valid
   */
  isValidPhone: (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  },

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @param {object} options - Validation options
   * @returns {object} Validation result with isValid and errors
   */
  validatePassword: (password, options = {}) => {
    const {
      minLength = 8,
      requireUppercase = true,
      requireLowercase = true,
      requireNumbers = true,
      requireSpecialChars = false,
    } = options;

    const errors = [];

    if (!password || password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters long`);
    }

    if (requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validate credit card number (basic Luhn algorithm)
   * @param {string} cardNumber - Card number to validate
   * @returns {boolean} True if card number is valid
   */
  isValidCreditCard: (cardNumber) => {
    // Remove spaces and dashes
    const cleaned = cardNumber.replace(/[\s-]/g, '');

    // Check if all digits
    if (!/^\d+$/.test(cleaned)) return false;

    // Luhn algorithm
    let sum = 0;
    let shouldDouble = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  },

  /**
   * Validate URL
   * @param {string} url - URL to validate
   * @returns {boolean} True if URL is valid
   */
  isValidUrl: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Validate required field
   * @param {any} value - Value to check
   * @returns {boolean} True if value is not empty
   */
  isRequired: (value) => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  },

  /**
   * Validate minimum length
   * @param {string} value - String value
   * @param {number} minLength - Minimum length
   * @returns {boolean} True if value meets minimum length
   */
  hasMinLength: (value, minLength) => {
    return value && value.length >= minLength;
  },

  /**
   * Validate maximum length
   * @param {string} value - String value
   * @param {number} maxLength - Maximum length
   * @returns {boolean} True if value is within maximum length
   */
  hasMaxLength: (value, maxLength) => {
    return !value || value.length <= maxLength;
  },

  /**
   * Validate numeric range
   * @param {number} value - Numeric value
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {boolean} True if value is within range
   */
  isInRange: (value, min, max) => {
    if (value === null || value === undefined) return true;
    const num = Number(value);
    if (isNaN(num)) return false;
    return num >= min && num <= max;
  },

  /**
   * Validate form data against rules
   * @param {object} data - Form data
   * @param {object} rules - Validation rules
   * @returns {object} Validation result with errors
   */
  validateForm: (data, rules) => {
    const errors = {};

    Object.keys(rules).forEach(field => {
      const value = data[field];
      const fieldRules = rules[field];
      const fieldErrors = [];

      fieldRules.forEach(rule => {
        const { type, param, message } = rule;

        let isValid = true;

        switch (type) {
          case 'required':
            isValid = validationUtils.isRequired(value);
            break;
          case 'email':
            isValid = !value || validationUtils.isValidEmail(value);
            break;
          case 'phone':
            isValid = !value || validationUtils.isValidPhone(value);
            break;
          case 'minLength':
            isValid = validationUtils.hasMinLength(value, param);
            break;
          case 'maxLength':
            isValid = validationUtils.hasMaxLength(value, param);
            break;
          case 'range':
            isValid = validationUtils.isInRange(value, param.min, param.max);
            break;
          case 'password':
            const passwordValidation = validationUtils.validatePassword(value, param);
            isValid = passwordValidation.isValid;
            if (!isValid) fieldErrors.push(...passwordValidation.errors);
            break;
          default:
            isValid = true;
        }

        if (!isValid && !fieldErrors.includes(message)) {
          fieldErrors.push(message);
        }
      });

      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors;
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};
