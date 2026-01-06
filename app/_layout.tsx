import { AppProvider } from '@/core/providers/AppProvider';
import { useAuth } from '@/core/providers/AuthProvider';
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

// export const unstable_settings = {
//   anchor: '(drawer)',
// };

export default function RootLayout() {
  return (
    <AppProvider>
      <RootNavigator />
      <Toast config={toastConfig} position="top" />
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
