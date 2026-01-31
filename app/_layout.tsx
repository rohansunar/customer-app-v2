import { AppProvider } from '@/core/providers/AppProvider';
import { useAuth } from '@/core/providers/AuthProvider';
import { SplashProvider } from '@/core/providers/SplashProvider';
import { toastConfig } from '@/core/ui/toastConfig';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';

// Prevent splash from auto hiding
SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { loading } = useAuth();

  // Do not render navigation until auth is ready
  if (loading) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AppProvider>
      <SplashProvider>
        <RootNavigator />
        <Toast config={toastConfig} position="top" />
      </SplashProvider>
    </AppProvider>
  );
}
