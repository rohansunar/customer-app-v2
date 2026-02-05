import { AlertProvider } from '@/core/context/AlertContext';
import { ToastProvider } from '@/core/context/ToastContext';
import { AppProvider } from '@/core/providers/AppProvider';
import { useAuth } from '@/core/providers/AuthProvider';
import { SplashProvider } from '@/core/providers/SplashProvider';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';

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
        <AlertProvider>
          <ToastProvider>
            <RootNavigator />
          </ToastProvider>
        </AlertProvider>
      </SplashProvider>
    </AppProvider>
  );
}
