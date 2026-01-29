import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Button } from '@/core/ui/Button';
import { Text } from '@/core/ui/Text';
import { useCart } from '@/features/cart/hooks/useCart';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useHandlePayment } from '../hooks/useHandlePayment';
import { PaymentMode } from '../types';

/**
 * PaymentPage component allows users to select a payment mode and complete the payment.
 * It displays payment options with visual selection indicators and handles payment processing.
 */
export function PaymentPage() {
  const { data, isLoading, error } = useCart();
  const { handlePayment, isPending } = useHandlePayment(data?.cartId || '');
  const [selectedPaymentMode, setSelectedPaymentMode] =
    useState<PaymentMode | null>(null);

  const paymentModes: {
    mode: PaymentMode;
    icon: keyof typeof Ionicons.glyphMap;
    description: string;
  }[] = [
    {
      mode: 'ONLINE',
      icon: 'card-outline',
      description: 'Pay via Card, UPI or Netbanking',
    },
    {
      mode: 'COD',
      icon: 'cash-outline',
      description: 'Pay when your product arrives',
    },
  ];

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
        <Text style={styles.errorText}>Error loading payment details</Text>
        <Button
          title="Go to Home"
          onPress={() => router.push('/home' as any)}
          variant="outline"
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
          Payment
        </Text>
        <View style={styles.headerIconButton}>
          <Ionicons
            name="help-circle-outline"
            size={20}
            color={colors.textPrimary}
          />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.summaryCard}>
          <Text variant="s" color={colors.textSecondary} weight="bold">
            AMOUNT TO PAY
          </Text>
          <Text variant="xl" weight="bold" color={colors.primary}>
            ₹{data?.grandTotal}
          </Text>
        </View>

        <Text variant="m" weight="semibold" style={styles.sectionTitle}>
          Select Payment Method
        </Text>

        <View style={styles.optionsContainer}>
          {paymentModes.map(({ mode, icon, description }) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.optionButton,
                selectedPaymentMode === mode && styles.selectedOption,
              ]}
              onPress={() => setSelectedPaymentMode(mode)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconContainer,
                  selectedPaymentMode === mode && styles.selectedIconContainer,
                ]}
              >
                <Ionicons
                  name={icon}
                  size={24}
                  color={
                    selectedPaymentMode === mode
                      ? colors.primary
                      : colors.textSecondary
                  }
                />
              </View>
              <View style={styles.optionInfo}>
                <Text
                  weight="semibold"
                  color={
                    selectedPaymentMode === mode
                      ? colors.primary
                      : colors.textPrimary
                  }
                >
                  {mode}
                </Text>
                <Text variant="xs" color={colors.textSecondary}>
                  {description}
                </Text>
              </View>
              <View
                style={[
                  styles.radioCircle,
                  selectedPaymentMode === mode && styles.selectedRadioCircle,
                ]}
              >
                {selectedPaymentMode === mode && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title={isPending ? 'Processing...' : 'Complete Payment'}
          onPress={() => handlePayment(selectedPaymentMode!)}
          disabled={!selectedPaymentMode || isPending}
          loading={isPending}
          style={styles.completeButton}
        />
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
  errorText: {
    marginTop: spacing.s,
    marginBottom: spacing.m,
    color: colors.error,
    textAlign: 'center',
  },
  retryButton: {
    minWidth: 180,
  },
  content: {
    flex: 1,
    padding: spacing.m,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    padding: spacing.l,
    borderRadius: spacing.radius.l,
    alignItems: 'center',
    marginBottom: spacing.l,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    marginBottom: spacing.m,
    color: colors.textPrimary,
  },
  optionsContainer: {
    gap: spacing.s,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.m,
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.m,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceHighlight,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  selectedIconContainer: {
    backgroundColor: colors.white,
  },
  optionInfo: {
    flex: 1,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadioCircle: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  footer: {
    padding: spacing.m,
    paddingBottom: spacing.xl,
    backgroundColor: colors.surface,
    borderTopLeftRadius: spacing.radius.xl,
    borderTopRightRadius: spacing.radius.xl,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  completeButton: {
    height: 54,
  },
});
