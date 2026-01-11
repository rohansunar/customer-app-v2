import { ProductCard } from '@/features/product/components/ProductCard';
import { useProducts } from '@/features/product/hooks/useProducts';
import { router } from 'expo-router';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View
} from 'react-native';

export default function ProductsTab() {
  const { data, isLoading, refetch, isFetching } = useProducts();

  if (isLoading) return null;

  return (
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F7F7F7',
    flex: 1,
  },
  list: {
    paddingTop: 12,
  },
});
