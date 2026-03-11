/**
 * Price calculator - handles subtotal, discount (coupon), shipping, and total
 * Matches orders table: subtotal_amount, discount_amount, shipping_amount, total_amount
 * Currency: VND
 */

/**
 * Calculate discount amount from coupon
 * @param {Object} coupon - { discount_type: 'percent'|'fixed', discount_value, max_discount }
 * @param {number} subtotalAmount
 * @returns {number} discount_amount
 */
export function calculateDiscountAmount(coupon, subtotalAmount) {
  if (!coupon) return 0;
  let discount = 0;
  if (coupon.discount_type === 'percent') {
    discount = (subtotalAmount * Number(coupon.discount_value)) / 100;
    if (coupon.max_discount != null && discount > Number(coupon.max_discount)) {
      discount = Number(coupon.max_discount);
    }
  } else {
    discount = Number(coupon.discount_value);
  }
  return Math.min(discount, subtotalAmount);
}

/**
 * Calculate shipping amount
 * @param {number} subtotalAmount
 * @param {number} freeShippingThreshold - e.g. 199 for $199
 * @param {number} standardShippingFee
 * @returns {number}
 */
export function calculateShippingAmount(subtotalAmount, freeShippingThreshold = 199, standardShippingFee = 9.99) {
  return subtotalAmount >= freeShippingThreshold ? 0 : standardShippingFee;
}

/**
 * Get full price breakdown for order
 * @param {Object} params
 * @param {number} params.subtotalAmount - cart subtotal
 * @param {Object|null} params.coupon - applied coupon
 * @param {number} [params.freeShippingThreshold]
 * @param {number} [params.shippingFee]
 * @param {string} [params.currency='VND']
 * @returns {{ subtotalAmount, discountAmount, shippingAmount, totalAmount, currency }}
 */
export function calculateOrderTotals({
  subtotalAmount,
  coupon = null,
  freeShippingThreshold = 199,
  shippingFee = 9.99,
  currency = 'VND',
}) {
  const discountAmount = calculateDiscountAmount(coupon, subtotalAmount);
  const amountAfterDiscount = subtotalAmount - discountAmount;
  const shippingAmount = calculateShippingAmount(amountAfterDiscount, freeShippingThreshold, shippingFee);
  const totalAmount = amountAfterDiscount + shippingAmount;

  return {
    subtotal_amount: subtotalAmount,
    discount_amount: discountAmount,
    shipping_amount: shippingAmount,
    total_amount: Math.round(totalAmount * 100) / 100,
    currency,
  };
}
