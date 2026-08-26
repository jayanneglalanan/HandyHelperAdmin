export const lightColors = {
  // Primary
  primary: '#111111',
  primaryHover: '#333333',

  // Secondary
  secondary: '#F5F5F5',
  secondaryHover: '#E5E5E5',

  // Tertiary
  tertiary: '#8A8A8A',

  // Neutral
  neutral: '#E5E5E5',
  neutralHover: '#D5D5D5',

  // Background
  background: '#FFFFFF',
  backgroundAlt: '#F8F8F8',

  // Accent (purple — consistent across themes)
  accent: '#5B4BDB',
  accentLight: '#EDE9FE',
  accentHover: '#4A3BC9',

  // Text
  text: '#111111',
  textSecondary: '#8A8A8A',
  textMuted: '#B0B0B0',

  // Status
  success: '#2E8B57',
  successLight: '#DCFCE7',
  warning: '#D99A00',
  warningLight: '#FEF9C3',
  danger: '#D64545',
  dangerLight: '#FEE2E2',
  info: '#5B4BDB',
  infoLight: '#EDE9FE',

  // Utility
  white: '#FFFFFF',
  black: '#111111',
  border: '#E5E5E5',
  borderLight: '#F0F0F0',
  overlay: 'rgba(0, 0, 0, 0.5)',
  surface: '#FFFFFF',
  surfaceAlt: '#F8F8F8',
} as const;

export const darkColors = {
  // Primary
  primary: '#FFFFFF',
  primaryHover: '#E5E5E5',

  // Secondary
  secondary: '#1A1A1A',
  secondaryHover: '#252525',

  // Tertiary
  tertiary: '#8A8A8A',

  // Neutral
  neutral: '#333333',
  neutralHover: '#444444',

  // Background
  background: '#111111',
  backgroundAlt: '#1A1A1A',

  // Accent (same purple — consistent across themes)
  accent: '#5B4BDB',
  accentLight: '#1E1547',
  accentHover: '#6C5CE7',

  // Text
  text: '#FFFFFF',
  textSecondary: '#8A8A8A',
  textMuted: '#666666',

  // Status
  success: '#34D399',
  successLight: '#064E3B',
  warning: '#FBBF24',
  warningLight: '#78350F',
  danger: '#F87171',
  dangerLight: '#7F1D1D',
  info: '#6C5CE7',
  infoLight: '#1E1547',

  // Utility
  white: '#FFFFFF',
  black: '#111111',
  border: '#333333',
  borderLight: '#252525',
  overlay: 'rgba(0, 0, 0, 0.7)',
  surface: '#1A1A1A',
  surfaceAlt: '#252525',
} as const;

export type ThemeColors = typeof lightColors;
