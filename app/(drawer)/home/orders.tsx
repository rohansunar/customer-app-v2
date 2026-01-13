import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Text } from '@/core/ui/Text';
import OrderCard from '@/features/orders/components/OrderCard';
import { useOrders } from '@/features/orders/hooks/useOrders';
import React, { useState } from 'react';
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
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'HISTORY'>('ACTIVE');

  const historyStatuses = ['DELIVERED', 'CANCELLED'];

  const { data, isLoading, refetch, isFetching, error } = useOrders(
    activeTab === 'ACTIVE' ? undefined : historyStatuses,
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centered}>
          <Text>Loading orders...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centered}>
          <Text color={colors.error}>Error loading orders</Text>
        </View>
      );
    }

    if (!data?.orders || data.orders.length === 0) {
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
        data={data.orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OrderCard order={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
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
          style={[styles.tab, activeTab === 'ACTIVE' && styles.activeTab]}
          onPress={() => setActiveTab('ACTIVE')}
        >
          <Text
            weight={activeTab === 'ACTIVE' ? 'bold' : 'medium'}
            color={
              activeTab === 'ACTIVE' ? colors.primary : colors.textSecondary
            }
          >
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'HISTORY' && styles.activeTab]}
          onPress={() => setActiveTab('HISTORY')}
        >
          <Text
            weight={activeTab === 'HISTORY' ? 'bold' : 'medium'}
            color={
              activeTab === 'HISTORY' ? colors.primary : colors.textSecondary
            }
          >
            History
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.s,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
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
