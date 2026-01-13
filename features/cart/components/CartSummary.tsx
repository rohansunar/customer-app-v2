import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Button } from '@/core/ui/Button';
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
    ({ item, index }: { item: CartItem; index: number }) => {
      const imageUri =
        item.images && item.images.length > 0
          ? { uri: item.images[0] }
          : require('@/assets/images/product-placeholder.png');

      return (
        <View style={[
          styles.itemContainer,
          index === cartItems.length - 1 && styles.lastItem
        ]}>
          <Image source={imageUri} style={styles.itemImage} />
          <View style={styles.itemDetails}>
            <View style={styles.nameRow}>
              <Text weight="semibold" numberOfLines={1} style={styles.itemName}>
                {item.name}
              </Text>
              <TouchableOpacity
                onPress={() => removeFromCart.mutate(item.id)}
                style={styles.deleteButton}
                hitSlop={8}
              >
                <Ionicons name="trash-outline" size={18} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>

            <Text
              variant="s"
              color={colors.textSecondary}
              numberOfLines={1}
              style={styles.itemDescription}
            >
              {item.description}
            </Text>

            <View style={styles.priceRow}>
              <View style={styles.qtyBadge}>
                <Text variant="xs" weight="medium" color={colors.textSecondary}>
                  {item.quantity} x ₹{item.price}
                </Text>
              </View>
              <Text variant="s" color={colors.primary} weight="bold">
                ₹{item.totalPrice}
              </Text>
            </View>
          </View>
        </View>
      );
    },
    [removeFromCart.mutate, cartItems.length],
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
        <Ionicons name="cart-outline" size={64} color={colors.textTertiary} />
        <Text variant="l" weight="medium" color={colors.textSecondary} style={{ marginTop: spacing.m }}>
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
          style={styles.headerIconButton}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text variant="l" weight="bold">
          My Cart
        </Text>
        <View style={styles.headerIconButton}>
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.textPrimary} />
        </View>
      </View>

      <View style={styles.content}>
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={
            <View style={styles.addressSection}>
              <View style={styles.addressHeader}>
                <Ionicons name="location-sharp" size={16} color={colors.primary} />
                <Text variant="s" weight="bold" color={colors.textSecondary} style={{ marginLeft: 4 }}>
                  DELIVERING TO
                </Text>
              </View>
              <View style={styles.addressContent}>
                <View style={{ flex: 1 }}>
                  <Text weight="semibold">{data!.deliveryAddress.label}</Text>
                  <Text variant="s" color={colors.textSecondary} numberOfLines={1}>
                    {data!.deliveryAddress.address}, {data!.deliveryAddress.city}
                  </Text>
                </View>
              </View>
            </View>
          }
        />

        <View style={styles.footer}>
          <View style={styles.priceSummary}>
            <View style={styles.summaryRow}>
              <Text variant="s" color={colors.textSecondary}>Subtotal</Text>
              <Text variant="s" weight="medium">₹{data!.subtotal}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text variant="s" color={colors.textSecondary}>Delivery Fee</Text>
              <Text variant="s" color={colors.success} weight="medium">FREE</Text>
            </View>
            <View style={[styles.summaryRow, styles.grandTotalRow]}>
              <Text weight="bold" variant="l">Total Amount</Text>
              <Text weight="bold" variant="l" color={colors.primary}>
                ₹{data!.grandTotal}
              </Text>
            </View>
          </View>

          <Button
            title="Checkout"
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
    paddingHorizontal: spacing.m,
    paddingTop: spacing.xl,
    paddingBottom: spacing.m,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.l,
  },
  loadingText: {
    marginTop: spacing.s,
    color: colors.textSecondary,
  },
  retryButton: {
    marginTop: spacing.m,
    minWidth: 150,
  },
  content: {
    flex: 1,
  },
  addressSection: {
    padding: spacing.m,
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.l,
    marginHorizontal: spacing.m,
    marginTop: spacing.m,
    marginBottom: spacing.s,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  addressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listContainer: {
    paddingBottom: spacing.xl,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: spacing.m,
    backgroundColor: colors.surface,
    marginHorizontal: spacing.m,
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lastItem: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: spacing.radius.l,
    borderBottomRightRadius: spacing.radius.l,
    marginBottom: spacing.m,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: spacing.radius.m,
    backgroundColor: colors.background,
  },
  itemDetails: {
    flex: 1,
    marginLeft: spacing.m,
    justifyContent: 'space-between',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemName: {
    flex: 1,
    fontSize: 15,
  },
  itemDescription: {
    fontSize: 12,
    marginVertical: 2,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qtyBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.s,
    paddingVertical: 2,
    borderRadius: 4,
  },
  deleteButton: {
    marginLeft: spacing.s,
  },
  footer: {
    padding: spacing.m,
    backgroundColor: colors.surface,
    borderTopLeftRadius: spacing.radius.xl,
    borderTopRightRadius: spacing.radius.xl,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  priceSummary: {
    marginBottom: spacing.m,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  grandTotalRow: {
    marginTop: spacing.s,
    paddingTop: spacing.s,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  checkoutButton: {
    width: '100%',
    height: 54,
  },
});
