import { CartSummary } from '@/features/cart/components/CartSummary';
import { AppDrawerContent } from '@/shared/components/AppDrawerContent';
import { useAuthGuard } from '@/shared/hooks/useAuthGuard';
import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';

export default function DrawerLayout() {
  useAuthGuard();
  const [isCartVisible, setIsCartVisible] = useState(false);

  return (
    <>
      <Drawer
        drawerContent={(props) => <AppDrawerContent {...props} />}
        screenOptions={{
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity onPress={() => setIsCartVisible(true)}>
              <Ionicons name="cart-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      >
        <Drawer.Screen name="dashboard" options={{ title: 'Dashboard' }} />
        <Drawer.Screen name="profile" options={{ title: 'Profile' }} />
        <Drawer.Screen
          name="bank"
          options={{
            drawerLabel: 'Bank',
            title: 'Bank',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="newspaper" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen name="address" options={{ title: 'Address' }} />
      </Drawer>
      <CartSummary
        visible={isCartVisible}
        onClose={() => setIsCartVisible(false)}
      />
    </>
  );
}
