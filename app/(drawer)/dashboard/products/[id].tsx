import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Card } from '@/core/ui/Card';
import { Text } from '@/core/ui/Text';
import { useProduct } from '@/features/product/hooks/useProduct';
import { useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet, View } from 'react-native';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useProduct(id);

  if (!id) {
    return <View style={styles.centered}><Text>Invalid product ID</Text></View>;
  }

  if (isLoading || !data)
    return <View style={styles.centered}><Text>Loading...</Text></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="xl" weight="bold" style={styles.title}>{data.name}</Text>

      {/* Images */}
      {data.images && data.images.length > 0 && (
        <View style={styles.imagesContainer}>
          {data.images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.image} />
          ))}
        </View>
      )}

      {/* Details */}
      <Card style={styles.details}>
        <View style={styles.row}>
          <Text variant="l" weight="bold" color={colors.primary}>₹ {data.price}</Text>
          <View style={[styles.badge, { backgroundColor: data.is_active ? colors.success + '20' : colors.error + '20' }]}>
            <Text variant="s" color={data.is_active ? colors.success : colors.error} weight="medium">
              {data.is_active ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>

        <Text variant="s" color={colors.textSecondary} style={styles.sectionTitle}>Category</Text>
        <Text style={styles.value}>{data.categoryId}</Text>

        {data.description && (
          <>
            <Text variant="s" color={colors.textSecondary} style={styles.sectionTitle}>Description</Text>
            <Text style={styles.value}>{data.description}</Text>
          </>
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.l,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: spacing.m,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.l,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: spacing.radius.m,
    marginRight: spacing.s,
    marginBottom: spacing.s,
    backgroundColor: colors.surface,
  },
  details: {
    padding: spacing.l,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  badge: {
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radius.s,
  },
  sectionTitle: {
    marginTop: spacing.m,
    marginBottom: spacing.xs,
  },
  value: {
    lineHeight: 24,
  },
});
