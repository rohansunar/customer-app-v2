import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { ProductListSkeleton } from '@/core/ui/Skeleton';
import { Text } from '@/core/ui/Text';
import { useCart } from '@/features/cart/hooks/useCart';
import { ProductCard } from '@/features/product/components/ProductCard';
import { useProducts } from '@/features/product/hooks/useProducts';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { getErrorMessage } from '@/core/utils/getErrorMessage';
import { useToastHelpers } from '@/core/utils/toastHelpers';
import CartButton from '@/features/cart/components/CartButton';
import { ReferralBanner } from '@/features/promotion/components/ReferralBanner';
import { ReferralModal } from '@/features/promotion/components/ReferralModal';
import { useNotifications } from '@/features/notifications/context/NotificationContext';
import React, { useEffect, useState } from 'react';

export default function HomeScreen() {
  const {
    data,
    isLoading,
    refetch,
    isFetching,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProducts();
  const { data: cartData, error: cartError, isError } = useCart();
  const [isReferralModalVisible, setIsReferralModalVisible] = useState(false);

  const { requestPermission } = useNotifications();

  const totalItems = cartData?.totalItems || 0;

  const products = data?.pages.flatMap((page) => page.data) || [];
  const showToast = useToastHelpers();

  const errorMessage = getErrorMessage(error);
  const isServiceUnavailable = errorMessage?.includes('SERVICE_UNAVAILABLE');

  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    if (isError) {
      showToast.error(getErrorMessage(cartError));
    }
  }, [cartError, isError, showToast]);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  const renderServiceUnavailable = () => (
    <Animated.View
      entering={FadeInDown.duration(600).springify()}
      style={styles.centerContainer}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="location-outline" size={40} color={colors.primary} />
      </View>
      <Text
        variant="xl"
        weight="bold"
        color={colors.textPrimary}
        style={styles.title}
      >
        Service Not Available
      </Text>
      <Text variant="m" color={colors.textSecondary} style={styles.message}>
        We're working hard to bring our services to you. We'll notify you once
        we're available in your area.
      </Text>
    </Animated.View>
  );

  const renderEmptyProducts = () => (
    <Animated.View
      entering={FadeInDown.duration(600).springify()}
      style={styles.centerContainer}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="cube-outline" size={40} color={colors.primary} />
      </View>
      <Text
        variant="xl"
        weight="bold"
        color={colors.textPrimary}
        style={styles.title}
      >
        Products Coming Soon
      </Text>
      <Text variant="m" color={colors.textSecondary} style={styles.message}>
        We're working hard to onboard our vendors and will list the products
        soon.
      </Text>
    </Animated.View>
  );

  // Scenario 1: Service Unavailable
  if (isServiceUnavailable) {
    return <View style={styles.container}>{renderServiceUnavailable()}</View>;
  }

  // Scenario 2: Empty Products (not loading, no error)
  if (!isLoading && !error && products.length === 0) {
    return <View style={styles.container}>{renderEmptyProducts()}</View>;
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingSkeleton}>
          <ProductListSkeleton />
        </View>
      ) : error ? (
        <Text color={colors.error} centered style={styles.errorText}>
          {errorMessage}
        </Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ProductCard product={item} />}
          ListHeaderComponent={
            <ReferralBanner
              onPressItem={() => setIsReferralModalVisible(true)}
            />
          }
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isFetchingNextPage}
              onRefresh={refetch}
              tintColor={colors.primary}
            />
          }
        />
      )}
      {totalItems > 0 && !isError && <CartButton totalItems={totalItems} />}
      <ReferralModal
        visible={isReferralModalVisible}
        onClose={() => setIsReferralModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.m,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.l,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.s,
  },
  message: {
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.m,
    opacity: 0.8,
  },
  errorText: {
    marginTop: spacing.xl,
  },
  list: {
    paddingTop: spacing.m,
    paddingBottom: 100, // Space for cart button
  },
  footerLoader: {
    paddingVertical: spacing.m,
    alignItems: 'center',
  },
  loadingSkeleton: {
    marginTop: spacing.m,
  },
});
