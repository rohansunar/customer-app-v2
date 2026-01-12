import { useCart } from '@/features/cart/hooks/useCart';
import { ProductCard } from '@/features/product/components/ProductCard';
import { useProducts } from '@/features/product/hooks/useProducts';
import { router } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View
} from 'react-native';

import CartButton from '@/features/cart/components/CartButton';

/**
 * DashboardScreen component displays the list of products and cart summary.
 */
export default function DashboardScreen() {
  const { data, isLoading, refetch, isFetching, error } = useProducts();
  const { data: cartData } = useCart();

  const totalItems = cartData?.totalItems || 0;

  return (
    <View style={styles.container}>
      {/* Products Section */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#4F46E5" />
      ) : error ? (
        <Text style={styles.errorText}>Error loading products</Text>
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
            <RefreshControl refreshing={isFetching} onRefresh={refetch} />
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
    backgroundColor: '#F5F7FA',
    padding: 10,
  },

  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },

  list: {
    paddingTop: 12,
  },
});
