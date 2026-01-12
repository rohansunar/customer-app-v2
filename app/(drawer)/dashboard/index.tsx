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
  TouchableOpacity,
  View
} from 'react-native';

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
      {totalItems > 0 && (
        <View style={styles.cartContainer}>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => router.push('/cart')}
          >
            <Text style={styles.cartText}>
              {totalItems} {totalItems === 1 ? 'item' : 'items'} added
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 10,
  },

  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111',
  },

  subHeading: {
    marginTop: 4,
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },

  sectionHeading: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111',
    marginTop: 24,
    marginBottom: 16,
  },

  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },

  list: {
    paddingTop: 12,
  },

  cartContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },

  cartButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },

  cartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
