import { colors } from '@/core/theme/colors';
import { AppDrawerContent } from '@/shared/components/AppDrawerContent';
import { HeaderAvatar } from '@/shared/components/HeaderAvatar';
import { useAuthGuard } from '@/shared/hooks/useAuthGuard';
import { Drawer } from 'expo-router/drawer';

export default function DrawerLayout() {
  useAuthGuard();

  return (
    <>
      <Drawer
        drawerContent={(props) => <AppDrawerContent {...props} />}
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.surface,
          headerRight: () => <HeaderAvatar />,
        }}
      >
        <Drawer.Screen name="dashboard" options={{ title: 'Water App' }} />
        <Drawer.Screen
          name="profile"
          options={{
            title: 'My Profile',
            drawerItemStyle: { display: 'none' },
          }}
        />
        <Drawer.Screen name="address" options={{ title: 'Addresses' }} />
      </Drawer>
    </>
  );
}
