import { AlertProvider } from '@/core/context/AlertContext';
import { ToastProvider } from '@/core/context/ToastContext';
import { AppProvider } from '@/core/providers/AppProvider';
import { useAuth } from '@/core/providers/AuthProvider';
import { colors } from '@/core/theme/colors';
import { Stack } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

function RootNavigator() {
  const { loading } = useAuth();

  // Do not render navigation until auth is ready
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
