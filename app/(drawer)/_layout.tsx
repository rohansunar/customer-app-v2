import { colors } from '@/core/theme/colors';
import { HeaderAddressSelector } from '@/shared/components/HeaderAddressSelector';
import { HeaderAvatar } from '@/shared/components/HeaderAvatar';
import { useAuthGuard } from '@/shared/hooks/useAuthGuard';
import { Stack } from 'expo-router';

export default function AppLayout() {
  useAuthGuard();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.surface,
        headerTitleAlign: 'left',
        headerRight: () => <HeaderAvatar />,
      }}
    >
      <Stack.Screen
        name="home"
        options={{
          headerTitle: () => <HeaderAddressSelector />,
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: 'My Profile',
        }}
      />
    </Stack>
  );
}
