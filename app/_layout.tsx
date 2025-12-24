import { AppProvider } from '@/core/providers/AppProvider';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';

import { useAuth } from '@/core/providers/AuthProvider';
import { useEffect } from 'react';
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

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Auth routes */}
      <Stack.Screen name="(auth)" />

      {/* App routes (with drawer) */}
      <Stack.Screen name="(drawer)" />
    </Stack>
  );
}

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <AppProvider>
      <RootNavigator />
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
