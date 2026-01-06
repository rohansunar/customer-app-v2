import { useAuth } from '@/core/providers/AuthProvider';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { router } from 'expo-router';
import { View } from 'react-native';

export function AppDrawerContent(props: any) {
  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace('/login');
  }

  return (
    <DrawerContentScrollView {...props}>
      {/* Default navigation items */}
      {props.state.routeNames.map(
        (
          routeName:
            | string
            | ((props: { focused: boolean; color: string }) => React.ReactNode),
          index: string | number,
        ) => {
          const route = props.state.routes[index];
          const isFocused = props.state.index === index;

          if (routeName === 'dashboard') {
            return (
              <DrawerItem
                key={route.key}
                label={routeName.toString().toUpperCase()}
                focused={isFocused}
                onPress={() =>
                  props.navigation.navigate('dashboard', { screen: 'index' })
                }
              />
            );
          }

          return (
            <DrawerItem
              key={route.key}
              label={routeName.toString().toUpperCase()}
              focused={isFocused}
              onPress={() => props.navigation.navigate(routeName)}
            />
          );
        },
      )}

      {/* Divider */}
      <View
        style={{
          height: 1,
          backgroundColor: '#e0e0e0',
          marginVertical: 12,
        }}
      />

      {/* Logout */}
      <DrawerItem
        label="Logout"
        labelStyle={{ color: 'red' }}
        onPress={handleLogout}
      />
    </DrawerContentScrollView>
  );
}
