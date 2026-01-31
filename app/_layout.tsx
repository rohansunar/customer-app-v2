import { AppProvider } from '@/core/providers/AppProvider';
import { useAuth } from '@/core/providers/AuthProvider';
import { ToastProvider } from '@/core/utils/ToastContext';
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
      <ToastProvider>
        <RootNavigator />
      </ToastProvider>
      {/* <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider> */}
    </AppProvider>
  );
}
