import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Text } from '@/core/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { SubscriptionPreviewResponse, SubscriptionType } from '../types';
import { getFrequencyLabel, parseApiDate } from '../utils/subscriptionUtils';

interface Props {
  productName: string;
  productPrice: number;
  productImage?: string;
  productDescription?: string;
  startDate: Date;
  quantity: number;
  frequency: SubscriptionType;
  customDays?: number[];
  preview?: SubscriptionPreviewResponse | null;
  isRefreshing?: boolean;
  hasPreviewError?: boolean;
}

export function SubscriptionSummary({
  productName,
  productPrice,
  productImage,
  startDate,
  quantity,
  frequency,
  customDays = [],
  preview,
  isRefreshing = false,
  hasPreviewError = false,
}: Props) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const displayProductName = preview?.productName ?? productName;
  const displayProductImage = preview?.productImage || productImage;
  const displayUnits = preview?.totalUnits ?? quantity;
  const displayFrequency = preview?.frequency ?? frequency;
  const displayUnitPrice = preview?.subscriptionPrice ?? productPrice;
  const displayAmount =
    preview?.totalAmount !== undefined
      ? `₹${preview.totalAmount.toFixed(0)}`
      : '--';
  const displayDeliveries =
    preview?.totalDeliveries !== undefined ? String(preview.totalDeliveries) : '--';
  const displayStartDate = preview?.startDate
    ? formatDate(parseApiDate(preview.startDate))
    : formatDate(startDate);
  const displayNextDelivery = preview?.nextDeliveryDate
    ? formatDate(parseApiDate(preview.nextDeliveryDate))
    : '--';

  const billingLabel = (() => {
    if (isRefreshing && !preview) {
      return 'FETCHING LATEST PREVIEW...';
    }
    if (frequency === 'CUSTOM_DAYS' && customDays.length === 0) {
      return 'SELECT CUSTOM DAYS TO PREVIEW BILLING';
    }
    if (preview?.forMonth) {
      return `ESTIMATED BILLING: ${preview.forMonth}`;
    }
    if (isRefreshing) {
      return 'UPDATING LATEST PREVIEW...';
    }
    if (hasPreviewError) {
      return 'LATEST PREVIEW UNAVAILABLE';
    }
    return 'FETCHING LATEST PREVIEW...';
  })();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {displayProductImage ? (
          <Image
            source={{ uri: displayProductImage }}
            style={styles.productImage}
            resizeMode="cover"
          />
        ) : (
          <LinearGradient
            colors={[colors.primaryLight, colors.primary]}
            style={styles.imagePlaceholder}
          >
            <Ionicons name="water" size={24} color={colors.white} />
          </LinearGradient>
        )}
        <View style={styles.productInfo}>
          <Text variant="l" weight="bold">
            {displayProductName}
          </Text>
          <Text variant="s" color={colors.textSecondary}>
            {displayUnits} {displayUnits > 1 ? 'Units' : 'Unit'} •{' '}
            {getFrequencyLabel(displayFrequency, customDays)}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Main Calculation Row - Modern & Detailed */}
      <View style={styles.calculationRow}>
        <View style={styles.calcMain}>
          <View style={styles.calcLeft}>
            <View style={styles.qtyBubble}>
              <Text variant="xs" weight="bold" color={colors.primary}>
                {displayUnits}
              </Text>
            </View>
            <Text variant="s" weight="semibold" color={colors.textSecondary}>
              UNIT{displayUnits > 1 ? 'S' : ''} × ₹{displayUnitPrice.toFixed(0)} ×{' '}
              {displayDeliveries} DAYS
            </Text>
          </View>
          <View style={styles.calcRight}>
            <Text variant="xl" weight="bold" color={colors.primary}>
              {displayAmount}
            </Text>
          </View>
        </View>
        <Text variant="xs" color={colors.textTertiary} style={styles.calcSub}>
          {billingLabel}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <Text variant="xs" color={colors.textTertiary}>
            Deliveries
          </Text>
          <Text variant="s" weight="bold">
            {displayDeliveries}
          </Text>
        </View>

        <View style={styles.gridItem}>
          <Text variant="xs" color={colors.textTertiary}>
            Start Date
          </Text>
          <Text variant="s" weight="bold">
            {displayStartDate}
          </Text>
        </View>

        <View style={styles.gridItem}>
          <Text variant="xs" color={colors.textTertiary}>
            Next Delivery
          </Text>
          <Text variant="s" weight="bold">
            {displayNextDelivery}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.l,
    padding: spacing.m,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: spacing.s,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: spacing.radius.m,
    marginRight: spacing.m,
    backgroundColor: colors.background,
  },
  imagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: spacing.radius.m,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  productInfo: {
    flex: 1,
  },
  priceTag: {
    alignItems: 'flex-end',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    opacity: 0.5,
    marginVertical: spacing.s,
  },
  grid: {
    flexDirection: 'row',
    gap: spacing.l,
  },
  gridItem: {
    flex: 1,
  },
  calculationRow: {
    paddingVertical: spacing.s,
  },
  calcMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  calcLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
    flex: 1,
  },
  calcRight: {
    alignItems: 'flex-end',
  },
  qtyBubble: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: spacing.radius.circle,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  calcSub: {
    marginTop: spacing.xxs,
    opacity: 0.7,
    letterSpacing: 0.5,
  },
});
