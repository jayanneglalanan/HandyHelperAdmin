import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 32,
  md: 40,
  lg: 48,
};

const fontSizes = {
  sm: 12,
  md: 14,
  lg: 16,
};

export default function Avatar({ initials, size = 'md' }: AvatarProps) {
  return (
    <View style={[styles.avatar, { width: sizes[size], height: sizes[size], borderRadius: sizes[size] / 2 }]}>
      <Text style={[styles.initials, { fontSize: fontSizes[size] }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#374151',
    fontWeight: '600',
  },
});
