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
        <View style={styles.productInfo}>
          <Text variant="l" weight="bold">
            {productName}
          </Text>
          <Text variant="s" color={colors.textSecondary}>
            {quantity} {quantity > 1 ? 'Units' : 'Unit'} •{' '}
            {getFrequencyLabel(frequency, customDays)}
          </Text>
        </View>
        <View style={styles.priceTag}>
          <Text variant="l" weight="bold" color={colors.primary}>
            ₹{details.totalAmount.toFixed(0)}
          </Text>
          <Text variant="xs" color={colors.textSecondary}>
            Estimate
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <Text variant="xs" color={colors.textTertiary}>
            Billing Period
          </Text>
          <Text variant="s" weight="semibold">
            {details.periodLabel}
          </Text>
          <Text variant="xs" color={colors.textSecondary}>
            {formatDate(details.effectiveStartDate)} -{' '}
            {formatDate(details.effectiveEndDate)}
          </Text>
        </View>

        <View style={styles.gridItem}>
          <Text variant="xs" color={colors.textTertiary}>
            Total Deliveries
          </Text>
          <Text variant="s" weight="semibold">
            {details.totalDeliveries} Days
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
    alignItems: 'flex-start',
    marginBottom: spacing.s,
  },
  productInfo: {
    flex: 1,
    marginRight: spacing.m,
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
});
