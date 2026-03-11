const STATUSES = {
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  warning: 'bg-amber-50 text-amber-700 border border-amber-100',
  error: 'bg-rose-50 text-rose-700 border border-rose-100',
};

const BadgeNotification = ({ status = 'success', children, className = '' }) => {
  const baseClasses =
    'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium';
  const statusClasses = STATUSES[status] || STATUSES.success;

  return (
    <span className={`${baseClasses} ${statusClasses} ${className}`}>
      {children}
    </span>
  );
};

export default BadgeNotification;

