import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
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

import { getErrorMessage } from '@/core/utils/getErrorMessage';
import { useToastHelpers } from '@/core/utils/toastHelpers';
import CartButton from '@/features/cart/components/CartButton';
import { ReferralBanner } from '@/features/promotion/components/ReferralBanner';
import { ReferralModal } from '@/features/promotion/components/ReferralModal';
import { useNotifications } from '@/features/notifications/context/NotificationContext';
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

  const { requestPermission } = useNotifications();

  const totalItems = cartData?.totalItems || 0;

  const products = data?.pages.flatMap((page) => page.data) || [];
  const showToast = useToastHelpers();

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

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : error ? (
        <Text color={colors.error} centered style={styles.errorText}>
          Error loading products
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
});
