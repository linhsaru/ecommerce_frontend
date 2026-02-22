import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

/**
 * Date and time formatting utilities
 */

export const dateTimeUtils = {
  /**
   * Format date to readable string
   * @param {Date|string} date - Date to format
   * @param {string} formatStr - Format pattern
   * @param {object} options - Additional options
   * @returns {string} Formatted date string
   */
  formatDate: (date, formatStr = 'MMM dd, yyyy', options = {}) => {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      if (!isValid(dateObj)) return 'Invalid Date';

      return format(dateObj, formatStr, options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  },

  /**
   * Format date and time
   * @param {Date|string} date - Date to format
   * @param {string} formatStr - Format pattern
   * @returns {string} Formatted date and time string
   */
  formatDateTime: (date, formatStr = 'MMM dd, yyyy hh:mm a') => {
    return dateTimeUtils.formatDate(date, formatStr);
  },

  /**
   * Get relative time (e.g., "2 hours ago")
   * @param {Date|string} date - Date to compare
   * @param {object} options - Additional options
   * @returns {string} Relative time string
   */
  getRelativeTime: (date, options = {}) => {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      if (!isValid(dateObj)) return 'Invalid Date';

      return formatDistanceToNow(dateObj, { addSuffix: true, ...options });
    } catch (error) {
      console.error('Error getting relative time:', error);
      return 'Invalid Date';
    }
  },

  /**
   * Check if date is today
   * @param {Date|string} date - Date to check
   * @returns {boolean} True if date is today
   */
  isToday: (date) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const today = new Date();
    return dateObj.toDateString() === today.toDateString();
  },

  /**
   * Check if date is yesterday
   * @param {Date|string} date - Date to check
   * @returns {boolean} True if date is yesterday
   */
  isYesterday: (date) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return dateObj.toDateString() === yesterday.toDateString();
  },

  /**
   * Check if date is within last N days
   * @param {Date|string} date - Date to check
   * @param {number} days - Number of days
   * @returns {boolean} True if date is within range
   */
  isWithinDays: (date, days) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const now = new Date();
    const diffTime = Math.abs(now - dateObj);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= days;
  },

  /**
   * Get start of day
   * @param {Date|string} date - Date
   * @returns {Date} Start of day
   */
  getStartOfDay: (date) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
    dateObj.setHours(0, 0, 0, 0);
    return dateObj;
  },

  /**
   * Get end of day
   * @param {Date|string} date - Date
   * @returns {Date} End of day
   */
  getEndOfDay: (date) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
    dateObj.setHours(23, 59, 59, 999);
    return dateObj;
  },

  /**
   * Add days to date
   * @param {Date|string} date - Base date
   * @param {number} days - Days to add
   * @returns {Date} New date
   */
  addDays: (date, days) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
    dateObj.setDate(dateObj.getDate() + days);
    return dateObj;
  },

  /**
   * Calculate age from birth date
   * @param {Date|string} birthDate - Birth date
   * @returns {number} Age in years
   */
  calculateAge: (birthDate) => {
    const birth = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  },

  /**
   * Format duration in milliseconds to human readable string
   * @param {number} milliseconds - Duration in milliseconds
   * @returns {string} Formatted duration
   */
  formatDuration: (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  },

  /**
   * Get business days between two dates
   * @param {Date|string} startDate - Start date
   * @param {Date|string} endDate - End date
   * @returns {number} Number of business days
   */
  getBusinessDays: (startDate, endDate) => {
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;

    let businessDays = 0;
    let currentDate = new Date(start);

    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Saturday or Sunday
        businessDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return businessDays;
  },

  /**
   * Validate date string
   * @param {string} dateString - Date string to validate
   * @param {string} format - Expected format (optional)
   * @returns {boolean} True if date string is valid
   */
  isValidDateString: (dateString, format) => {
    if (!dateString) return false;

    try {
      const date = parseISO(dateString);
      return isValid(date);
    } catch {
      return false;
    }
  },

  /**
   * Convert date to ISO string
   * @param {Date|string} date - Date to convert
   * @returns {string} ISO date string
   */
  toISOString: (date) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return dateObj.toISOString();
  },

  /**
   * Get date range presets
   * @returns {object} Date range presets
   */
  getDateRangePresets: () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setDate(monthAgo.getDate() - 30);
    const yearAgo = new Date(today);
    yearAgo.setDate(yearAgo.getDate() - 365);

    return {
      today: { start: today, end: today },
      yesterday: { start: yesterday, end: yesterday },
      last7Days: { start: weekAgo, end: today },
      last30Days: { start: monthAgo, end: today },
      last365Days: { start: yearAgo, end: today },
    };
  },
};
