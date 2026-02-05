import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Button } from '@/core/ui/Button';
import { Text } from '@/core/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { subscriptionTypeConfigs } from '../config/subscriptionTypes';
import { useCreateSubscription } from '../hooks/useCreateSubscription';
import { useSubscriptionForm } from '../hooks/useSubscriptionForm';
import { DayOfWeek, Subscription, SubscriptionRequest } from '../types';
import { CalendarPicker } from './CalendarPicker';

interface Props {
  visible: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  isEditing?: boolean;
  existingSubscription?: Subscription;
}

const DAYS: DayOfWeek[] = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
];

export function SubscriptionModal({
  visible,
  onClose,
  productId,
  productName,
}: Props) {
  // Dependency Inversion Principle: Depend on abstraction (hook interface) rather than concrete state
  const form = useSubscriptionForm();

  const router = useRouter();
  const createSubscription = useCreateSubscription();

  const handleSave = () => {
    const payload: SubscriptionRequest = {
      productId,
      frequency: form.state.frequency,
      start_date: form.state.selectedDate.toISOString().split('T')[0],
      custom_days:
        form.state.frequency === 'CUSTOM_DAYS'
          ? form.state.customDays
          : undefined,
      quantity: form.state.quantity,
    };
    
    createSubscription.mutate(payload, {
      onSuccess: () => {
        onClose();
        router.push('/(drawer)/home/subscriptions' as any);
      },
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View>
              <Text variant="s" color={colors.textSecondary}>
                {productName}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.qtySection}>
              <Text variant="m" weight="semibold">
                Quantity per Delivery
              </Text>
              <View style={styles.qtyControls}>
                <TouchableOpacity
                  style={styles.qtyButton}
                  onPress={form.actions.decrementQty}
                >
                  <Ionicons
                    name="remove"
                    size={20}
                    color={colors.textPrimary}
                  />
                </TouchableOpacity>
                <Text variant="l" weight="bold" style={styles.qtyText}>
                  {form.state.quantity}
                </Text>
                <TouchableOpacity
                  style={styles.qtyButton}
                  onPress={form.actions.incrementQty}
                >
                  <Ionicons name="add" size={20} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>
            </View>

            <Text variant="m" weight="semibold" style={styles.sectionTitle}>
              Delivery Frequency
            </Text>

            <View style={styles.typeContainer}>
              {/* Open-Closed Principle: Component is open for extension by adding new subscription types to config without modifying code */}
              {subscriptionTypeConfigs.map((config) => (
                <TouchableOpacity
                  key={config.type}
                  style={[
                    styles.typeOption,
                    form.state.frequency === config.type &&
                      styles.selectedTypeOption,
                  ]}
                  onPress={() => form.actions.setFrequency(config.type)}
                >
                  <View
                    style={[
                      styles.radio,
                      form.state.frequency === config.type &&
                        styles.selectedRadio,
                    ]}
                  >
                    {form.state.frequency === config.type && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                  <View style={styles.typeInfo}>
                    <Text weight="medium">{config.label}</Text>
                    <Text variant="xs" color={colors.textSecondary}>
                      {config.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}

              {form.state.frequency !== 'CUSTOM_DAYS' &&
                form.getUpcomingDates.length > 0 && (
                  <View style={styles.upcomingDatesContainer}>
                    <Text
                      variant="xs"
                      color={colors.textSecondary}
                      style={{ marginBottom: 4 }}
                    >
                      Next deliveries:
                    </Text>
                    <View style={styles.upcomingDatesRow}>
                      {form.getUpcomingDates.map((d, i) => (
                        <View key={i} style={styles.upcomingDateBadge}>
                          <Text
                            variant="xs"
                            weight="medium"
                            color={colors.primary}
                          >
                            {d}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
            </View>

            {form.state.frequency === 'CUSTOM_DAYS' && (
              <View style={styles.daysContainer}>
                {DAYS.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayChip,
                      form.state.customDays.includes(day) &&
                        styles.selectedDayChip,
                    ]}
                    onPress={() => form.actions.toggleDay(day)}
                  >
                    <Text
                      variant="xs"
                      weight="medium"
                      color={
                        form.state.customDays.includes(day)
                          ? colors.white
                          : colors.textPrimary
                      }
                    >
                      {day.substring(0, 3)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.dateSection}>
              <Text variant="m" weight="semibold" style={styles.sectionTitle}>
                Start Date
              </Text>
              <CalendarPicker
                selectedDate={form.state.selectedDate}
                onSelectDate={form.actions.setSelectedDate}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button
              title={
                createSubscription.isPending
                  ? 'Saving...'
                  : 'Confirm Subscription'
              }
              onPress={handleSave}
              disabled={
                createSubscription.isPending ||
                (form.state.frequency === 'CUSTOM_DAYS' &&
                  form.state.customDays.length === 0)
              }
              loading={createSubscription.isPending}
              style={styles.saveButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: spacing.radius.xl,
    borderTopRightRadius: spacing.radius.xl,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: spacing.xs,
  },
  content: {
    padding: spacing.l,
  },
  qtySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.l,
    backgroundColor: colors.background,
    padding: spacing.m,
    borderRadius: spacing.radius.m,
    borderWidth: 1,
    borderColor: colors.border,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  qtyText: {
    minWidth: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    marginBottom: spacing.m,
  },
  typeContainer: {
    gap: spacing.s,
    marginBottom: spacing.l,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.m,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.radius.m,
  },
  selectedTypeOption: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceHighlight,
  },
  upcomingDatesContainer: {
    marginLeft: spacing.l + spacing.m,
    marginBottom: spacing.s,
    marginTop: -spacing.xs,
  },
  upcomingDatesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  upcomingDateBadge: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.s,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.primary + '33',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  selectedRadio: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  typeInfo: {
    flex: 1,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s,
    marginBottom: spacing.l,
  },
  dayChip: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.radius.s,
    minWidth: 60,
    alignItems: 'center',
  },
  selectedDayChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dateSection: {
    marginBottom: spacing.xl,
  },
  footer: {
    padding: spacing.l,
    paddingBottom: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveButton: {
    height: 54,
  },
});
