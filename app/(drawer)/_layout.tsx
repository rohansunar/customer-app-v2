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
        }}
      >
        <Drawer.Screen name="dashboard" options={{ title: 'Dashboard' }} />
        <Drawer.Screen name="profile" options={{ title: 'Profile' }} />
        <Drawer.Screen name="address" options={{ title: 'Address' }} />
      </Drawer>
    </>
  );
}
