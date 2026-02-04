import { useLocalSearchParams } from 'expo-router';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Text } from '@/core/ui/Text';
import OrderCard from '@/features/orders/components/OrderCard';
import { useOrders } from '@/features/orders/hooks/useOrders';
import { useNotifications } from '@/features/notifications/context/NotificationContext';
import React, { useState, useEffect } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

/**
 * OrdersTab component displays a list of orders with pull-to-refresh functionality.
 * Divided into "Active" and "History" sections.
 */
export default function OrdersTab() {
  const { tab } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'HISTORY'>(
    tab === 'HISTORY' ? 'HISTORY' : 'ACTIVE'
  );
  const historyStatuses = ['DELIVERED', 'CANCELLED'];

  const { isEnabled, requestPermission } = useNotifications();

  useEffect(() => {
    if (!isEnabled) {
      requestPermission();
    }
  }, [isEnabled, requestPermission]);

  // Fetch both to show counts
  const {
    data: activeData,
    isLoading: activeLoading,
    refetch: refetchActive,
    isFetching: activeFetching,
    error: activeError,
  } = useOrders();

  const {
    data: historyData,
    isLoading: historyLoading,
    refetch: refetchHistory,
    isFetching: historyFetching,
    error: historyError,
  } = useOrders(historyStatuses);

  const currentData = activeTab === 'ACTIVE' ? activeData : historyData;
  const currentLoading =
    activeTab === 'ACTIVE' ? activeLoading : historyLoading;
  const currentError = activeTab === 'ACTIVE' ? activeError : historyError;
  const currentRefetch =
    activeTab === 'ACTIVE' ? refetchActive : refetchHistory;
  const currentFetching =
    activeTab === 'ACTIVE' ? activeFetching : historyFetching;

  // Memoized callbacks for FlatList optimization
  const keyExtractor = React.useCallback((item: any) => item.id, []);
  const renderItem = React.useCallback(
    ({ item }: any) => <OrderCard order={item} />,
    [],
  );

  // FlatList performance optimization - fixed item height
  const getItemLayout = React.useCallback(
    (_data: any, index: number) => ({
      length: 400, // Approximate height of OrderCard
      offset: 400 * index,
      index,
    }),
    [],
  );

  const renderContent = () => {
    if (currentLoading) {
      return (
        <View style={styles.centered}>
          <Text>Loading orders...</Text>
        </View>
      );
    }

    if (currentError) {
      return (
        <View style={styles.centered}>
          <Text color={colors.error}>Error loading orders</Text>
        </View>
      );
    }

    if (!currentData?.orders || currentData.orders.length === 0) {
      return (
        <View style={styles.centered}>
          <Text color={colors.textSecondary}>
            No {activeTab === 'ACTIVE' ? 'active' : 'history'} orders found
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={currentData.orders}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        windowSize={5} // Reduce memory usage by rendering fewer items
        maxToRenderPerBatch={5} // Optimize initial render
        removeClippedSubviews={true} // Android optimization
        refreshControl={
          <RefreshControl
            refreshing={currentFetching}
            onRefresh={currentRefetch}
            tintColor={colors.primary}
          />
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'ACTIVE' && styles.activeTab,
            activeTab !== 'ACTIVE' && styles.inactiveTab,
          ]}
          onPress={() => setActiveTab('ACTIVE')}
        >
          <Text
            weight="bold"
            color={activeTab === 'ACTIVE' ? colors.white : colors.textSecondary}
          >
            Active ({activeData?.total || 0})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'HISTORY' && styles.activeTab,
            activeTab !== 'HISTORY' && styles.inactiveTab,
          ]}
          onPress={() => setActiveTab('HISTORY')}
        >
          <Text
            weight="bold"
            color={
              activeTab === 'HISTORY' ? colors.white : colors.textSecondary
            }
          >
            History ({historyData?.total || 0})
          </Text>
        </TouchableOpacity>
      </View>

      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: spacing.m,
    backgroundColor: colors.surface,
    // Removed borderBottomWidth to match cleaner look, or keep if preferred.
    // Making it look like the image: Tabs are buttons.
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.s,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: spacing.radius.circle, // Pill shape
    marginHorizontal: spacing.xs,
  },
  activeTab: {
    backgroundColor: colors.primary, // Blue background
  },
  inactiveTab: {
    backgroundColor: '#F1F5F9', // light grey
  },
  list: {
    padding: spacing.m,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
});
