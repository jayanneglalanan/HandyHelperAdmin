export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`;
}

export function formatName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function getStatusColor(status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
  const statusMap: Record<string, 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
    active: 'success',
    verified: 'success',
    approved: 'success',
    completed: 'success',
    resolved: 'success',
    visible: 'success',
    pending: 'warning',
    investigating: 'warning',
    open: 'info',
    accepted: 'info',
    in_progress: 'info',
    suspended: 'error',
    rejected: 'error',
    dismissed: 'error',
    cancelled: 'error',
    flagged: 'error',
    disputed: 'error',
    needs_update: 'warning',
    expired: 'error',
    inactive: 'neutral',
    hidden: 'neutral',
  };
  return statusMap[status] || 'neutral';
}

export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}
