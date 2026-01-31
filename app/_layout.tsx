import { AlertProvider } from '@/core/context/AlertContext';
import { ToastProvider } from '@/core/context/ToastContext';
import { AppProvider } from '@/core/providers/AppProvider';
import { useAuth } from '@/core/providers/AuthProvider';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

// Prevent splash from auto hiding
SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      // Auth check finished → hide splash
      SplashScreen.hideAsync();
    }
  }, [loading]);

  // Do not render navigation until auth is ready
  if (loading) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }}></Stack>;
}

export default function RootLayout() {
  return (
    <AppProvider>
      <AlertProvider>
        <ToastProvider>
          <RootNavigator />
        </ToastProvider>
      </AlertProvider>
    </AppProvider>
  );
}
