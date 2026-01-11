import { useProduct } from '@/features/product/hooks/useProduct';
import { useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useProduct(id);

  if (!id) {
    return <Text style={{ padding: 16 }}>Invalid product ID</Text>;
  }

  if (isLoading || !data)
    return <Text style={{ padding: 16 }}>Loading...</Text>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{data.name}</Text>

      {/* Images */}
      {data.images && data.images.length > 0 && (
        <View style={styles.imagesContainer}>
          {data.images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.image} />
          ))}
        </View>
      )}

      {/* Details */}
      <View style={styles.details}>
        <Text style={styles.label}>Price: ₹ {data.price}</Text>
        <Text style={styles.label}>Category: {data.categoryId}</Text>
        {data.description && (
          <Text style={styles.label}>Description: {data.description}</Text>
        )}
        <Text
          style={[
            styles.label,
            { color: data.is_active ? '#34C759' : '#FF3B30' },
          ]}
        >
          Status: {data.is_active ? 'Active' : 'Inactive'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  details: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
});
