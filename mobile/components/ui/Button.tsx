import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
}: ButtonProps) {
  const { colors } = useTheme();

  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'primary':
        return {
          container: { backgroundColor: colors.primary },
          text: { color: colors.white },
        };
      case 'secondary':
        return {
          container: { backgroundColor: colors.surfaceAlt },
          text: { color: colors.text },
        };
      case 'outline':
        return {
          container: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border },
          text: { color: colors.text },
        };
      case 'ghost':
        return {
          container: { backgroundColor: 'transparent' },
          text: { color: colors.textSecondary },
        };
      case 'danger':
        return {
          container: { backgroundColor: colors.error },
          text: { color: colors.white },
        };
      case 'success':
        return {
          container: { backgroundColor: colors.success },
          text: { color: colors.white },
        };
      default:
        return {
          container: { backgroundColor: colors.primary },
          text: { color: colors.white },
        };
    }
  };

  const getSizeStyles = (): ViewStyle & { text: TextStyle } => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, text: { fontSize: 13 } };
      case 'md':
        return { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, text: { fontSize: 14 } };
      case 'lg':
        return { paddingVertical: 14, paddingHorizontal: 20, borderRadius: 12, text: { fontSize: 16 } };
      default:
        return { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, text: { fontSize: 14 } };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.container,
        variantStyles.container,
        sizeStyles,
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.text.color} size="small" />
      ) : (
        <Text style={[styles.text, variantStyles.text, sizeStyles.text]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
  },
});
