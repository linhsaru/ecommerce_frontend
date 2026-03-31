export const formatVnd = (value) => {
  const amount = typeof value === 'number' ? value : Number(value) || 0;
  return `${amount.toLocaleString('vi-VN', { maximumFractionDigits: 0 })} VND`;
};
