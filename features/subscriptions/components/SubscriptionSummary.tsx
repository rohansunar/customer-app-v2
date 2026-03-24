import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Text } from '@/core/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { SubscriptionType } from '../types';
import {
  getFrequencyLabel,
  getSubscriptionDetails,
} from '../utils/subscriptionUtils';

interface Props {
  productName: string;
  productPrice: number;
  productImage?: string;
  productDescription?: string;
  startDate: Date;
  quantity: number;
  frequency: SubscriptionType;
  customDays?: number[];
}

export function SubscriptionSummary({
  productName,
  productPrice,
  productImage,
  productDescription,
  startDate,
  quantity,
  frequency,
  customDays = [],
}: Props) {
  const details = getSubscriptionDetails(
    startDate,
    frequency,
    quantity,
    productPrice,
    customDays,
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {productImage ? (
          <Image
            source={{ uri: productImage }}
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
            {productName}
          </Text>
          <Text variant="s" color={colors.textSecondary}>
            {quantity} {quantity > 1 ? 'Units' : 'Unit'} •{' '}
            {getFrequencyLabel(frequency, customDays)}
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
                {quantity}
              </Text>
            </View>
            <Text variant="s" weight="semibold" color={colors.textSecondary}>
              UNIT{quantity > 1 ? 'S' : ''} × ₹{productPrice.toFixed(0)} ×{' '}
              {details.totalDeliveries} DAYS
            </Text>
          </View>
          <View style={styles.calcRight}>
            <Text variant="xl" weight="bold" color={colors.primary}>
              ₹{details.totalAmount.toFixed(0)}
            </Text>
          </View>
        </View>
        <Text variant="xs" color={colors.textTertiary} style={styles.calcSub}>
          ESTIMATED BILLING: {details.periodLabel}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <Text variant="xs" color={colors.textTertiary}>
            Deliveries
          </Text>
          <Text variant="s" weight="bold">
            {details.totalDeliveries}
          </Text>
        </View>

        <View style={styles.gridItem}>
          <Text variant="xs" color={colors.textTertiary}>
            From
          </Text>
          <Text variant="s" weight="bold">
            {formatDate(details.effectiveStartDate)}
          </Text>
        </View>

        <View style={styles.gridItem}>
          <Text variant="xs" color={colors.textTertiary}>
            To
          </Text>
          <Text variant="s" weight="bold">
            {formatDate(details.effectiveEndDate)}
          </Text>
        </View>
      </View>

      {details.isNextMonth && (
        <View style={styles.alertBox}>
          <Ionicons name="calendar-outline" size={16} color={colors.primary} />
          <Text variant="xs" color={colors.textPrimary} style={{ flex: 1 }}>
            Starting next month because today is the last day.
          </Text>
        </View>
      )}
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
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
    marginTop: spacing.s,
    backgroundColor: colors.primary + '10',
    padding: spacing.s,
    borderRadius: spacing.radius.m,
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
