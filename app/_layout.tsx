import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="country-selection" />
        <Stack.Screen name="profile-setup" />
        <Stack.Screen name="paywall" />
        <Stack.Screen name="categories" />
        <Stack.Screen name="chat" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}