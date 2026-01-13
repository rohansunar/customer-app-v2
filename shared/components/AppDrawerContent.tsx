import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Text } from '@/core/ui/Text';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { StyleSheet, View } from 'react-native';

export function AppDrawerContent(props: any) {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      <View style={styles.header}>
        <Text variant="xl" weight="bold" color={colors.primary}>
          Water App
        </Text>
        <Text variant="s" color={colors.textSecondary}>
          Premium Water Delivery
        </Text>
      </View>

      <View style={styles.itemsContainer}>
        {props.state.routeNames.map((routeName: string, index: number) => {
          const route = props.state.routes[index];
          const isFocused = props.state.index === index;

          // Skip hidden items if needed, or map names
          if (routeName === 'profile') return null;

          let label = routeName;
          if (routeName === 'dashboard') label = 'Home';

          return (
            <DrawerItem
              key={route.key}
              label={({ color }) => (
                <Text
                  weight={isFocused ? 'bold' : 'medium'}
                  color={isFocused ? colors.primary : colors.textPrimary}
                >
                  {label.charAt(0).toUpperCase() + label.slice(1)}
                </Text>
              )}
              focused={isFocused}
              activeBackgroundColor={colors.surfaceHighlight}
              onPress={() => {
                if (routeName === 'dashboard') {
                  props.navigation.navigate('dashboard', { screen: 'index' });
                } else {
                  props.navigation.navigate(routeName);
                }
              }}
              style={styles.item}
            />
          );
        })}
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.l,
  },
  header: {
    paddingHorizontal: spacing.l,
    marginBottom: spacing.l,
  },
  itemsContainer: {
    flex: 1,
  },
  item: {
    borderRadius: spacing.radius.m,
    marginHorizontal: spacing.m,
  },
  footer: {
    marginTop: spacing.xl,
    marginBottom: spacing.l,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.l,
    marginBottom: spacing.s,
  },
});
