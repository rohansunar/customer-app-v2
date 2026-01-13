import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Text } from '@/core/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface CartButtonProps {
  totalItems: number;
}

export default function CartButton({ totalItems }: CartButtonProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.cartBar}
        onPress={() => router.push('/dashboard/cart')}
        activeOpacity={0.8}
      >
        <View style={styles.leftContent}>
          <View style={styles.badge}>
            <Text variant="s" color={colors.white} weight="bold">
              {totalItems}
            </Text>
          </View>
          <Text variant="m" color={colors.white} weight="semibold">
            {totalItems === 1 ? 'Item' : 'Items'} added
          </Text>
        </View>

        <View style={styles.rightContent}>
          <Text variant="m" color={colors.white} weight="bold">
            View Cart
          </Text>
          <Ionicons
            name="arrow-forward"
            size={18}
            color={colors.white}
            style={styles.icon}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: spacing.m,
    left: spacing.m,
    right: spacing.m,
    zIndex: 100,
  },
  cartBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    borderRadius: spacing.radius.xl,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: spacing.radius.s,
    paddingHorizontal: spacing.s,
    paddingVertical: 2,
    marginRight: spacing.s,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: spacing.xs,
  },
});
