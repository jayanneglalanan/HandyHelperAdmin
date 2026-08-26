import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface BadgeProps {
  children: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  style?: TextStyle;
}

const variantColors: Record<string, { bg: string; text: string }> = {
  default: { bg: '#F3F4F6', text: '#374151' },
  success: { bg: '#D1FAE5', text: '#059669' },
  warning: { bg: '#FEF3C7', text: '#D97706' },
  error: { bg: '#FEE2E2', text: '#DC2626' },
  info: { bg: '#DBEAFE', text: '#2563EB' },
  neutral: { bg: '#F3F4F6', text: '#6B7280' },
};

export default function Badge({ children, variant = 'default', style }: BadgeProps) {
  const colors = variantColors[variant] || variantColors.default;

  return (
    <Text style={[styles.badge, { backgroundColor: colors.bg, color: colors.text }, style]}>
      {children}
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
