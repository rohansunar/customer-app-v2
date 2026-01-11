import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function DashboardTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="index"
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt-outline" size={size} color={color} />
          ),
        }}
      />

      {/* HIDDEN ROUTES */}
      <Tabs.Screen name="products/[id]" options={{ href: null }} />
      <Tabs.Screen name="products/create" options={{ href: null }} />
      <Tabs.Screen name="bank/create" options={{ href: null }} />
      <Tabs.Screen name="bank/[id]" options={{ href: null }} />
      <Tabs.Screen name="orders/[id]" options={{ href: null }} />
    </Tabs>
  );
}
