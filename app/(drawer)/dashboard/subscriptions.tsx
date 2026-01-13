import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Text } from '@/core/ui/Text';
import { useProducts } from '@/features/product/hooks/useProducts';
import { SubscriptionCard } from '@/features/subscriptions/components/SubscriptionCard';
import { useSubscriptions } from '@/features/subscriptions/hooks/useSubscriptions';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

export default function SubscriptionsScreen() {
  const { data: subscriptions, isLoading: isLoadingSubs } = useSubscriptions();
  const { data: productsData } = useProducts();

  const isLoading = isLoadingSubs;

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="repeat-outline" size={64} color={colors.textTertiary} />
      <Text variant="l" weight="bold" style={styles.emptyTitle}>
        No Subscriptions
      </Text>
      <Text variant="s" color={colors.textSecondary} style={styles.emptyText}>
        You haven't subscribed to any products yet. Subscribe to your favorite
        daily essentials for hassle-free delivery.
      </Text>
    </View>
  );

  const getProductName = (productId: string) => {
    const product = productsData?.pages
      .flatMap((page) => page.data)
      .find((p) => p.id === productId);
    return product?.name || 'Product';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="xl" weight="bold">
          My Subscriptions
        </Text>
      </View>

      <FlatList
        data={subscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            subscription={item}
            productName={getProductName(item.productId)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.l,
    paddingTop: spacing.xl,
  },
  listContent: {
    padding: spacing.l,
    paddingTop: 0,
    paddingBottom: spacing.xxl,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
    marginTop: spacing.xxl,
  },
  emptyTitle: {
    marginTop: spacing.m,
    marginBottom: spacing.s,
  },
  emptyText: {
    textAlign: 'center',
    lineHeight: 20,
  },
});
