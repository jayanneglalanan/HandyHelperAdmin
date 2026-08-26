import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface StatusBadgeProps {
  status: string;
}

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  active: { label: 'Active', bg: '#D1FAE5', text: '#059669' },
  verified: { label: 'Verified', bg: '#D1FAE5', text: '#059669' },
  approved: { label: 'Approved', bg: '#D1FAE5', text: '#059669' },
  completed: { label: 'Completed', bg: '#D1FAE5', text: '#059669' },
  resolved: { label: 'Resolved', bg: '#D1FAE5', text: '#059669' },
  pending: { label: 'Pending', bg: '#FEF3C7', text: '#D97706' },
  investigating: { label: 'Investigating', bg: '#FEF3C7', text: '#D97706' },
  needs_update: { label: 'Needs Update', bg: '#FEF3C7', text: '#D97706' },
  open: { label: 'Open', bg: '#DBEAFE', text: '#2563EB' },
  accepted: { label: 'Accepted', bg: '#DBEAFE', text: '#2563EB' },
  in_progress: { label: 'In Progress', bg: '#DBEAFE', text: '#2563EB' },
  suspended: { label: 'Suspended', bg: '#FEE2E2', text: '#DC2626' },
  rejected: { label: 'Rejected', bg: '#FEE2E2', text: '#DC2626' },
  dismissed: { label: 'Dismissed', bg: '#FEE2E2', text: '#DC2626' },
  cancelled: { label: 'Cancelled', bg: '#FEE2E2', text: '#DC2626' },
  flagged: { label: 'Flagged', bg: '#FEE2E2', text: '#DC2626' },
  disputed: { label: 'Disputed', bg: '#FEE2E2', text: '#DC2626' },
  expired: { label: 'Expired', bg: '#FEE2E2', text: '#DC2626' },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, bg: '#F3F4F6', text: '#6B7280' };

  return (
    <Text style={[styles.badge, { backgroundColor: config.bg, color: config.text }]}>
      {config.label}
    </Text>
  );
}

const styles = StyleSheet.create({
  badge: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
});
