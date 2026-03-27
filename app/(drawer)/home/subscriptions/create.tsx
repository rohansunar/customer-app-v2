import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Button } from '@/core/ui/Button';
import { Text } from '@/core/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCreateSubscription } from '@/features/subscriptions/hooks/useCreateSubscription';
import { useSubscriptionForm } from '@/features/subscriptions/hooks/useSubscriptionForm';
import {
  DayOfWeek,
  SubscriptionPreviewResponse,
  SubscriptionRequest,
  SubscriptionType,
} from '@/features/subscriptions/types';
import { subscriptionService } from '@/features/subscriptions/services/subscription.service';
import { CalendarPicker } from '@/features/subscriptions/components/CalendarPicker';
import { SubscriptionSummary } from '@/features/subscriptions/components/SubscriptionSummary';
import { QuantitySelector } from '@/features/subscriptions/components/QuantitySelector';
import { FrequencySelector } from '@/features/subscriptions/components/FrequencySelector';
import {
  convertDaysToNumeric,
  formatDateForApi,
} from '@/features/subscriptions/utils/subscriptionUtils';

function getSearchParamValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return value ?? '';
}

export default function CreateSubscriptionScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const productId = getSearchParamValue(params.productId);
  const productName = getSearchParamValue(params.productName);
  const productPrice = parseFloat(
    getSearchParamValue(params.productPrice) || '0',
  );
  const productImage = getSearchParamValue(params.productImage);
  const productDescription = getSearchParamValue(params.productDescription);

  const form = useSubscriptionForm();
  const createSubscription = useCreateSubscription();
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [previewData, setPreviewData] =
    useState<SubscriptionPreviewResponse | null>(null);
  const [hasPreviewError, setHasPreviewError] = useState(false);
  const [isPreviewRefreshing, setIsPreviewRefreshing] = useState(false);
  const previewRequestIdRef = useRef(0);
  const [isAwaitingCustomDaySelection, setIsAwaitingCustomDaySelection] =
    useState(false);

  useFocusEffect(
    React.useCallback(() => {
      form.actions.reset();
      setPolicyAccepted(false);
      setPreviewData(null);
      setHasPreviewError(false);
    }, [form.actions]),
  );

  const defaultStartDate = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    return formatDateForApi(tomorrow);
  }, []);
  const startDate = formatDateForApi(form.state.selectedDate);
  const customDays = useMemo(() => {
    if (form.state.frequency !== 'CUSTOM_DAYS') {
      return undefined;
    }

    return [...convertDaysToNumeric(form.state.customDays)].sort(
      (a, b) => a - b,
    );
  }, [form.state.customDays, form.state.frequency]);
  const hasCustomDays = Boolean(customDays && customDays.length > 0);
  const isInitialPreviewRequest =
    form.state.frequency === 'DAILY' &&
    form.state.quantity === 1 &&
    startDate === defaultStartDate &&
    !hasCustomDays;

  const previewEnabled =
    Boolean(productId) &&
    (form.state.frequency !== 'CUSTOM_DAYS' || hasCustomDays);

  const handleSelectFrequency = (frequency: SubscriptionType) => {
    // Do not refresh the preview when the user only opens the Custom Days tab.
    setIsAwaitingCustomDaySelection(
      frequency === 'CUSTOM_DAYS' && form.state.frequency !== 'CUSTOM_DAYS',
    );
    form.actions.setFrequency(frequency);
  };

  const handleToggleCustomDay = (day: DayOfWeek) => {
    setIsAwaitingCustomDaySelection(false);
    form.actions.toggleDay(day);
  };

  const hasSelectedCustomDays = customDays && customDays.length > 0;

  useEffect(() => {
    const isCustomDaysFrequency = form.state.frequency === 'CUSTOM_DAYS';
    const shouldSkipPreview =
      isCustomDaysFrequency &&
      (!hasSelectedCustomDays || isAwaitingCustomDaySelection);

    if (!previewEnabled || shouldSkipPreview) {
      previewRequestIdRef.current += 1;
      setHasPreviewError(false);
      setIsPreviewRefreshing(false);
      return;
    }

    const requestId = ++previewRequestIdRef.current;
    const request = {
      productId,
      ...(isInitialPreviewRequest
        ? {}
        : {
            frequency: form.state.frequency,
            start_date: startDate,
            unit: form.state.quantity,
            ...(hasCustomDays ? { custom_days: customDays } : {}),
          }),
    };

    setHasPreviewError(false);
    setPreviewData(null);
    setIsPreviewRefreshing(true);

    void subscriptionService
      .getSubscriptionPreview(request)
      .then((response) => {
        if (requestId !== previewRequestIdRef.current) {
          return;
        }

        setPreviewData(response);
        setIsPreviewRefreshing(false);
      })
      .catch(() => {
        if (requestId !== previewRequestIdRef.current) {
          return;
        }

        setHasPreviewError(true);
        setIsPreviewRefreshing(false);
      });
  }, [
    customDays,
    form.state.frequency,
    form.state.quantity,
    hasSelectedCustomDays,
    isAwaitingCustomDaySelection,
    isInitialPreviewRequest,
    previewEnabled,
    productId,
    startDate,
  ]);

  const handleSave = () => {
    const payload: SubscriptionRequest = {
      productId,
      frequency: form.state.frequency,
      start_date: startDate,
      custom_days: customDays,
      quantity: form.state.quantity,
    };

    createSubscription.mutate(payload, {
      onSuccess: () => {
        router.push('/(drawer)/home/subscriptions' as any);
      },
    });
  };

  return (
    <View style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text variant="l" weight="bold">
          Create Subscription
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <SubscriptionSummary
            productName={productName}
            productPrice={productPrice}
            productImage={productImage}
            productDescription={productDescription}
            startDate={form.state.selectedDate}
            quantity={form.state.quantity}
            frequency={form.state.frequency}
            customDays={customDays}
            preview={previewData}
            isRefreshing={isPreviewRefreshing}
            hasPreviewError={hasPreviewError}
          />

          <Text variant="m" weight="bold" style={styles.sectionTitle}>
            Configure Delivery
          </Text>

          <View style={styles.card}>
            <QuantitySelector
              quantity={form.state.quantity}
              onIncrement={form.actions.incrementQty}
              onDecrement={form.actions.decrementQty}
            />

            <View style={{ height: spacing.l }} />

            <FrequencySelector
              selectedFrequency={form.state.frequency}
              onSelectFrequency={handleSelectFrequency}
              selectedCustomDays={form.state.customDays}
              onToggleCustomDay={handleToggleCustomDay}
            />
          </View>

          <View style={styles.dateSection}>
            <Text variant="m" weight="bold" style={styles.sectionTitle}>
              Select Start Date
            </Text>
            <CalendarPicker
              selectedDate={form.state.selectedDate}
              onSelectDate={form.actions.setSelectedDate}
            />
            <View style={styles.dateInfo}>
              <Ionicons
                name="information-circle-outline"
                size={14}
                color={colors.textTertiary}
              />
              <Text variant="xs" color={colors.textTertiary}>
                Subscriptions must start from tomorrow or later.
              </Text>
            </View>
          </View>

          {/* Policy Disclaimer Section */}
          <View style={styles.disclaimerSection}>
            <Text variant="s" weight="bold" style={styles.sectionTitle}>
              Subscription Policies
            </Text>
            <View style={styles.disclaimerCard}>
              <View style={styles.disclaimerRow}>
                <Ionicons
                  name="time-outline"
                  size={18}
                  color={colors.primary}
                />
                <Text
                  variant="xs"
                  color={colors.textSecondary}
                  style={styles.disclaimerText}
                >
                  Refunds take <Text weight="bold">7 working days</Text> to
                  process after cancellation.
                </Text>
              </View>
              <View style={[styles.disclaimerRow, { marginTop: spacing.s }]}>
                <Ionicons
                  name="alert-circle-outline"
                  size={18}
                  color={colors.error}
                />
                <Text
                  variant="xs"
                  color={colors.textSecondary}
                  style={styles.disclaimerText}
                >
                  A non-refundable processing fee of{' '}
                  <Text weight="bold">2.5% + 18% GST</Text> applies as per
                  payment partner policies.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setPolicyAccepted(!policyAccepted)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  policyAccepted && styles.checkboxChecked,
                ]}
              >
                {policyAccepted && (
                  <Ionicons name="checkmark" size={16} color={colors.white} />
                )}
              </View>
              <Text
                variant="s"
                color={colors.textPrimary}
                style={styles.checkboxLabel}
              >
                I agree to the subscription and refund policies.
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={
            createSubscription.isPending
              ? 'Processing...'
              : isPreviewRefreshing
                ? 'Updating Preview...'
                : 'Confirm & Subscribe'
          }
          onPress={handleSave}
          disabled={
            createSubscription.isPending ||
            isPreviewRefreshing ||
            hasPreviewError ||
            !previewData ||
            !policyAccepted ||
            (form.state.frequency === 'CUSTOM_DAYS' &&
              form.state.customDays.length === 0)
          }
          loading={createSubscription.isPending}
          style={styles.confirmButton}
          variant="primary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.l,
  },
  sectionTitle: {
    marginBottom: spacing.m,
    marginTop: spacing.s,
    color: colors.textPrimary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.xl,
    padding: spacing.l,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  dateSection: {
    marginBottom: spacing.xl,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.s,
    paddingHorizontal: spacing.xs,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.l,
    paddingBottom: spacing.xl,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  confirmButton: {
    height: 56,
    borderRadius: spacing.radius.xl,
  },
  disclaimerSection: {
    marginBottom: spacing.xxl,
  },
  disclaimerCard: {
    backgroundColor: colors.background,
    padding: spacing.m,
    borderRadius: spacing.radius.m,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.m,
  },
  disclaimerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.s,
  },
  disclaimerText: {
    flex: 1,
    lineHeight: 18,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.s,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.s,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  checkboxLabel: {
    flex: 1,
    fontWeight: '500',
  },
});
