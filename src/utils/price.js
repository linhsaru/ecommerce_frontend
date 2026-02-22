/**
 * Price and currency formatting utilities
 */

export const priceUtils = {
  /**
   * Format price with currency symbol
   * @param {number} price - Price amount
   * @param {string} currency - Currency code (default: 'USD')
   * @param {string} locale - Locale for formatting (default: 'en-US')
   * @returns {string} Formatted price string
   */
  formatPrice: (price, currency = 'USD', locale = 'en-US') => {
    if (price === null || price === undefined || isNaN(price)) {
      return '$0.00';
    }

    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency.toUpperCase(),
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price);
    } catch (error) {
      console.error('Error formatting price:', error);
      return `$${price.toFixed(2)}`;
    }
  },

  /**
   * Format price without currency symbol
   * @param {number} price - Price amount
   * @param {string} locale - Locale for formatting
   * @returns {string} Formatted price string
   */
  formatPriceNumber: (price, locale = 'en-US') => {
    if (price === null || price === undefined || isNaN(price)) {
      return '0.00';
    }

    try {
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price);
    } catch (error) {
      return price.toFixed(2);
    }
  },

  /**
   * Calculate discount percentage
   * @param {number} originalPrice - Original price
   * @param {number} discountedPrice - Discounted price
   * @returns {number} Discount percentage
   */
  calculateDiscountPercent: (originalPrice, discountedPrice) => {
    if (!originalPrice || !discountedPrice || originalPrice <= discountedPrice) {
      return 0;
    }

    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  },

  /**
   * Calculate discounted price
   * @param {number} price - Original price
   * @param {number} discountPercent - Discount percentage
   * @returns {number} Discounted price
   */
  calculateDiscountedPrice: (price, discountPercent) => {
    if (!price || !discountPercent || discountPercent <= 0) {
      return price;
    }

    const discount = (price * discountPercent) / 100;
    return Math.max(0, price - discount);
  },

  /**
   * Calculate tax amount
   * @param {number} price - Price amount
   * @param {number} taxRate - Tax rate (percentage)
   * @returns {number} Tax amount
   */
  calculateTax: (price, taxRate = 0) => {
    if (!price || !taxRate) return 0;
    return (price * taxRate) / 100;
  },

  /**
   * Calculate total price including tax
   * @param {number} price - Base price
   * @param {number} taxRate - Tax rate (percentage)
   * @returns {number} Total price with tax
   */
  calculateTotalWithTax: (price, taxRate = 0) => {
    return price + priceUtils.calculateTax(price, taxRate);
  },

  /**
   * Parse price string to number
   * @param {string} priceString - Price string (e.g., "$123.45", "123.45 USD")
   * @returns {number} Parsed price number
   */
  parsePrice: (priceString) => {
    if (!priceString) return 0;

    // Remove currency symbols and extra characters
    const cleaned = priceString.replace(/[^\d.,-]/g, '');
    const normalized = cleaned.replace(',', '.');

    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? 0 : parsed;
  },

  /**
   * Check if price is valid
   * @param {any} price - Price to validate
   * @returns {boolean} True if price is valid number
   */
  isValidPrice: (price) => {
    return typeof price === 'number' && !isNaN(price) && price >= 0;
  },

  /**
   * Get currency symbol
   * @param {string} currency - Currency code
   * @returns {string} Currency symbol
   */
  getCurrencySymbol: (currency = 'USD') => {
    const symbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      VND: '₫',
      // Add more currencies as needed
    };

    return symbols[currency.toUpperCase()] || '$';
  },

  /**
   * Convert between currencies (simplified - in real app, use exchange rates)
   * @param {number} amount - Amount to convert
   * @param {string} fromCurrency - Source currency
   * @param {string} toCurrency - Target currency
   * @param {number} exchangeRate - Exchange rate
   * @returns {number} Converted amount
   */
  convertCurrency: (amount, fromCurrency, toCurrency, exchangeRate) => {
    if (fromCurrency === toCurrency) return amount;
    if (!exchangeRate || exchangeRate <= 0) return amount;

    return amount * exchangeRate;
  },
};
