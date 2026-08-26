interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'neutral' }> = {
  active: { label: 'Active', variant: 'info' },
  verified: { label: 'Verified', variant: 'success' },
  approved: { label: 'Approved', variant: 'success' },
  completed: { label: 'Completed', variant: 'success' },
  resolved: { label: 'Resolved', variant: 'success' },
  visible: { label: 'Visible', variant: 'success' },
  pending: { label: 'Pending', variant: 'warning' },
  investigating: { label: 'Investigating', variant: 'warning' },
  needs_update: { label: 'Needs Update', variant: 'warning' },
  open: { label: 'Open', variant: 'info' },
  accepted: { label: 'Accepted', variant: 'info' },
  in_progress: { label: 'In Progress', variant: 'info' },
  suspended: { label: 'Suspended', variant: 'error' },
  rejected: { label: 'Rejected', variant: 'error' },
  dismissed: { label: 'Dismissed', variant: 'error' },
  cancelled: { label: 'Cancelled', variant: 'error' },
  flagged: { label: 'Flagged', variant: 'error' },
  disputed: { label: 'Disputed', variant: 'error' },
  expired: { label: 'Expired', variant: 'error' },
  inactive: { label: 'Inactive', variant: 'neutral' },
  hidden: { label: 'Hidden', variant: 'neutral' },
};

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, variant: 'neutral' as const };
  
  const variants = {
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    info: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    neutral: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full transition-colors duration-200 ${variants[config.variant]} ${className}`}>
      {config.label}
    </span>
  );
}
