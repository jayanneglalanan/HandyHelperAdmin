import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '../hooks/useTheme';
import { BrandProvider } from '../hooks/useBrand';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <BrandProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(admin)" />
        </Stack>
      </BrandProvider>
    </ThemeProvider>
  );
}
