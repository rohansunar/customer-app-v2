import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Text } from '@/core/ui/Text';
import { useCart } from '@/features/cart/hooks/useCart';
import { ProductCard } from '@/features/product/components/ProductCard';
import { useProducts } from '@/features/product/hooks/useProducts';
import { router } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View
} from 'react-native';

import CartButton from '@/features/cart/components/CartButton';

export default function DashboardScreen() {
  const { data, isLoading, refetch, isFetching, error } = useProducts();
  const { data: cartData } = useCart();

  const totalItems = cartData?.totalItems || 0;

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : error ? (
        <Text color={colors.error} centered style={styles.errorText}>Error loading products</Text>
      ) : (
        <FlatList
          data={data?.data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => router.push(`/dashboard/products/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor={colors.primary} />
          }
        />
      )}
      {totalItems > 0 && <CartButton totalItems={totalItems} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.m,
  },
  errorText: {
    marginTop: spacing.xl,
  },
  list: {
    paddingTop: spacing.m,
    paddingBottom: 100, // Space for cart button
  },
});
