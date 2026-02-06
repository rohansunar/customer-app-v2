import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Text } from '@/core/ui/Text';
import { useProducts } from '@/features/product/hooks/useProducts';
import { SubscriptionCard } from '@/features/subscriptions/components/SubscriptionCard';
import { useInfiniteSubscriptions } from '@/features/subscriptions/hooks/useInfiniteSubscriptions';
import { useNotifications } from '@/features/notifications/context/NotificationContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Button } from '@/core/ui/Button';

type FilterType = 'ALL' | 'ACTIVE' | 'INACTIVE';

export default function SubscriptionsScreen() {
  const [filter, setFilter] = useState<FilterType>('ALL');
  const { isEnabled, requestPermission } = useNotifications();

  useEffect(() => {
    if (!isEnabled) {
      requestPermission();
    }
  }, [isEnabled, requestPermission]);

  const { subscriptions, loading, loadingMore, loadMore, error, refetch } =
    useInfiniteSubscriptions();
  const { data: productsData } = useProducts();

  const isLoading = loading;

  // Filter subscriptions based on selected filter
  const filteredSubscriptions = React.useMemo(() => {
    if (filter === 'ALL') return subscriptions;
    return subscriptions.filter((sub) => sub.status === filter);
  }, [subscriptions, filter]);

  // Auto-refresh when there are progressing subscriptions
  React.useEffect(() => {
    const hasProgressing = subscriptions.some((s) => s.status === 'PROCESSING');
    if (hasProgressing) {
      const interval = setInterval(() => {
        refetch();
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [subscriptions, refetch]);

  // Count subscriptions by status
  const counts = React.useMemo(() => {
    const active = subscriptions.filter((s) => s.status === 'ACTIVE').length;
    const paused = subscriptions.filter((s) => s.status === 'INACTIVE').length;
    return { all: subscriptions.length, active, paused };
  }, [subscriptions]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const router = useRouter();

  const renderEmpty = () => (
    <Animated.View
      entering={FadeInDown.springify()}
      style={styles.emptyContainer}
    >
      <View style={styles.emptyIconContainer}>
        <Ionicons name="repeat-outline" size={64} color={colors.primary} />
      </View>
      <Text variant="xl" weight="bold" style={styles.emptyTitle}>
        No Subscriptions Yet
      </Text>
      <Text variant="m" color={colors.textSecondary} style={styles.emptyText}>
        Subscribe to your favorite products for hassle-free recurring deliveries
      </Text>
      <Button
        title="Start Subscribing"
        onPress={() => router.push('/(drawer)/home')}
        style={styles.emptyButton}
        textStyle={styles.emptyButtonText}
        variant="primary"
      />
    </Animated.View>
  );

  const getProductName = (productId: string) => {
    const product = productsData?.pages
      .flatMap((page) => page.data)
      .find((p) => p.id === productId);
    return product?.name || 'Product';
  };

  const renderFilterChip = (
    type: FilterType,
    label: string,
    count: number,
    icon: string,
  ) => {
    const isSelected = filter === type;
    return (
      <TouchableOpacity
        onPress={() => setFilter(type)}
        style={[styles.filterChip, isSelected && styles.filterChipActive]}
      >
        <Ionicons
          name={icon as any}
          size={16}
          color={isSelected ? colors.white : colors.textSecondary}
        />
        <Text
          variant="s"
          weight="medium"
          color={isSelected ? colors.white : colors.textSecondary}
        >
          {label}
        </Text>
        <View
          style={[styles.countBadge, isSelected && styles.countBadgeActive]}
        >
          <Text
            variant="xs"
            weight="bold"
            color={isSelected ? colors.primary : colors.textTertiary}
          >
            {count}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Enhanced Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text variant="xl" weight="bold">
              My Subscriptions
            </Text>
            <Text variant="s" color={colors.textSecondary}>
              {counts.all} {counts.all === 1 ? 'subscription' : 'subscriptions'}
            </Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="repeat" size={28} color={colors.primary} />
          </View>
        </View>

        {/* Filter Chips */}
        {subscriptions.length > 0 && (
          <View style={styles.filterContainer}>
            {renderFilterChip('ALL', 'All', counts.all, 'apps-outline')}
            {renderFilterChip(
              'ACTIVE',
              'Active',
              counts.active,
              'checkmark-circle-outline',
            )}
            {renderFilterChip(
              'INACTIVE',
              'Paused',
              counts.paused,
              'pause-circle-outline',
            )}
          </View>
        )}
      </View>

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={24}
            color={colors.error}
          />
          <Text variant="s" color={colors.error} style={styles.errorText}>
            {error}
          </Text>
        </View>
      )}

      {/* Subscription List */}
      <FlatList
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <SubscriptionCard
            subscription={item}
            productName={getProductName(item.productId)}
            index={index}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.loadingMore}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : null
        }
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
    backgroundColor: colors.surface,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.m,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: spacing.s,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: spacing.radius.circle,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  countBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  countBadgeActive: {
    backgroundColor: colors.white,
  },
  listContent: {
    padding: spacing.l,
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
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  emptyTitle: {
    marginBottom: spacing.s,
  },
  emptyText: {
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
    marginBottom: spacing.l,
  },
  emptyButton: {
    minWidth: 200,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingMore: {
    padding: spacing.m,
    alignItems: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.m,
    backgroundColor: colors.error + '10',
    marginHorizontal: spacing.l,
    marginTop: spacing.m,
    borderRadius: spacing.radius.m,
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  errorText: {
    marginLeft: spacing.s,
    flex: 1,
  },
});
