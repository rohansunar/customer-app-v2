import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Button } from '@/core/ui/Button';
import { Card } from '@/core/ui/Card';
import { Text } from '@/core/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCart } from '../hooks/useCart';
import { useRemoveFromCart } from '../hooks/useRemoveFromCart';
import { CartItem } from '../types';

export function CartSummary() {
  const { data, isLoading, error } = useCart();
  const removeFromCart = useRemoveFromCart();

  const cartItems = data?.cartItems || [];

  const renderItem = useCallback(
    ({ item }: { item: CartItem }) => {
      const imageUri =
        item.images && item.images.length > 0
          ? { uri: item.images[0] }
          : require('@/assets/images/product-placeholder.png');

      return (
        <Card
          style={styles.itemContainer}
          accessible={true}
          accessibilityLabel={`Cart item: ${item.name}, qty ${item.quantity}, price ${item.price}`}
        >
          <Image source={imageUri} style={styles.itemImage} />
          <View style={styles.itemDetails}>
            <Text weight="semibold" numberOfLines={1}>
              {item.name}
            </Text>
            <Text
              variant="s"
              color={colors.textSecondary}
              numberOfLines={2}
              style={styles.itemDescription}
            >
              {item.description}
            </Text>
            <View style={styles.row}>
              <Text variant="s">Qty: {item.quantity}</Text>
              <Text variant="s" color={colors.primary} weight="semibold">
                ₹ {item.totalPrice}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => removeFromCart.mutate(item.id)}
            style={styles.deleteButton}
            hitSlop={8}
          >
            <Ionicons name="trash-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        </Card>
      );
    },
    [removeFromCart.mutate],
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading cart...</Text>
      </View>
    );
  }

  if (error && cartItems.length > 0) {
    return (
      <View style={styles.center}>
        <Text color={colors.error}>Error loading cart</Text>
        <Button
          title="Go to Products"
          onPress={() => router.push('/dashboard')}
          variant="outline"
          style={styles.retryButton}
        />
      </View>
    );
  }

  if (cartItems.length === 0) {
    return (
      <View style={styles.center}>
        <Text variant="l" weight="medium" color={colors.textSecondary}>
          Your cart is empty
        </Text>
        <Button
          title="Start Shopping"
          onPress={() => router.push('/dashboard')}
          style={styles.retryButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text variant="l" weight="bold">
          Cart Summary
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.summaryContainer}>
          <Text variant="s" color={colors.textSecondary}>
            Delivery Address
          </Text>
          <Text weight="medium">{data!.deliveryAddress.label}</Text>
          <Text variant="s" color={colors.textSecondary}>
            {data!.deliveryAddress.address}, {data!.deliveryAddress.city} -{' '}
            {data!.deliveryAddress.pincode}
          </Text>
        </View>

        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />

        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text color={colors.textSecondary}>Subtotal</Text>
            <Text>₹ {data!.subtotal}</Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text weight="bold" variant="l">
              Grand Total
            </Text>
            <Text weight="bold" variant="l" color={colors.primary}>
              ₹ {data!.grandTotal}
            </Text>
          </View>

          <Button
            title="Proceed to Payment"
            onPress={() => router.push('/dashboard/payment')}
            style={styles.checkoutButton}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.m,
    backgroundColor: colors.surface,
  },
  backButton: {
    padding: spacing.xs,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.l,
  },
  loadingText: {
    marginTop: spacing.s,
  },
  retryButton: {
    marginTop: spacing.m,
  },
  content: {
    flex: 1,
  },
  summaryContainer: {
    padding: spacing.m,
    backgroundColor: colors.surface,
    marginBottom: spacing.s,
  },
  listContainer: {
    padding: spacing.m,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
    padding: spacing.s,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: spacing.radius.m,
    marginRight: spacing.m,
    backgroundColor: colors.background,
  },
  itemDetails: {
    flex: 1,
  },
  itemDescription: {
    marginVertical: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    paddingRight: spacing.s,
  },
  deleteButton: {
    padding: spacing.s,
  },
  footer: {
    padding: spacing.m,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.s,
  },
  grandTotal: {
    marginBottom: spacing.m,
  },
  checkoutButton: {
    width: '100%',
  },
});
