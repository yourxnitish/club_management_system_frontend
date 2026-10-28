export function formatDate(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatTime(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function getStatusBadgeVariant(status) {
  switch (status?.toUpperCase()) {
    case 'ACTIVE':
    case 'APPROVED':
    case 'PUBLISHED':
    case 'REGISTERED':
      return 'success';
    case 'PENDING':
    case 'PENDING_APPROVAL':
    case 'WAITLISTED':
    case 'HIGH':
      return 'warning';
    case 'INACTIVE':
    case 'REJECTED':
    case 'CANCELLED':
    case 'URGENT':
      return 'danger';
    case 'COMPLETED':
    case 'NORMAL':
    case 'LOW':
      return 'info';
    default:
      return 'neutral';
  }
}

export function getPriorityBadgeVariant(priority) {
  switch (priority?.toUpperCase()) {
    case 'URGENT':
      return 'danger';
    case 'HIGH':
      return 'warning';
    case 'MEDIUM':
    case 'NORMAL':
      return 'primary';
    case 'LOW':
      return 'neutral';
    default:
      return 'neutral';
  }
}
