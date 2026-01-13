import { colors } from '@/core/theme/colors';
import { AppDrawerContent } from '@/shared/components/AppDrawerContent';
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
        }}
      >
        <Drawer.Screen name="dashboard" options={{ title: 'Water App' }} />
        <Drawer.Screen name="profile" options={{ title: 'My Profile' }} />
        <Drawer.Screen name="address" options={{ title: 'Addresses' }} />
      </Drawer>
    </>
  );
}
