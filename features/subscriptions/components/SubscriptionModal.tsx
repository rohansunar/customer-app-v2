import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Button } from '@/core/ui/Button';
import { Text } from '@/core/ui/Text';
import { useCart } from '@/features/cart/hooks/useCart';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCreateSubscription } from '../hooks/useCreateSubscription';
import { useUpdateSubscription } from '../hooks/useUpdateSubscription';
import {
  DayOfWeek,
  Subscription,
  SubscriptionRequest,
  SubscriptionType,
} from '../types';
import { CalendarPicker } from './CalendarPicker';

interface Props {
  visible: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  existingSubscription?: Subscription;
}

const DAYS: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export function SubscriptionModal({
  visible,
  onClose,
  productId,
  productName,
  existingSubscription,
}: Props) {
  const { data: cartData } = useCart();
  const isEditing = !!existingSubscription;

  const [type, setType] = useState<SubscriptionType>(
    existingSubscription?.type || 'DAILY',
  );
  const [customDays, setCustomDays] = useState<DayOfWeek[]>(
    existingSubscription?.customDays || [],
  );
  const [quantity, setQuantity] = useState(existingSubscription?.quantity || 1);
  const [selectedDate, setSelectedDate] = useState(() => {
    if (existingSubscription?.startDate) {
      return new Date(existingSubscription.startDate);
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });

  const router = useRouter();
  const createSubscription = useCreateSubscription();
  const updateSubscription = useUpdateSubscription();

  const toggleDay = (day: DayOfWeek) => {
    setCustomDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const incrementQty = () => setQuantity((q) => q + 1);
  const decrementQty = () => setQuantity((q) => Math.max(1, q - 1));

  const getUpcomingDates = useMemo(() => {
    if (type === 'CUSTOM') return [];
    const dates = [];
    const baseDate = new Date(selectedDate);
    const interval = type === 'DAILY' ? 1 : 2;
    for (let i = 0; i < 4; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i * interval);
      dates.push(
        d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
      );
    }
    return dates;
  }, [type, selectedDate]);

  const handleSave = () => {
    const payload: SubscriptionRequest = {
      productId,
      type,
      startDate: selectedDate.toISOString().split('T')[0],
      customDays: type === 'CUSTOM' ? customDays : undefined,
      quantity,
    };

    if (isEditing && existingSubscription) {
      updateSubscription.mutate(
        {
          id: existingSubscription.id,
          request: payload,
        },
        {
          onSuccess: () => onClose(),
        },
      );
    } else {
      createSubscription.mutate(payload, {
        onSuccess: () => {
          onClose();
          router.push('/(drawer)/dashboard/subscriptions');
        },
      });
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View>
              <Text variant="l" weight="bold">
                {isEditing ? 'Edit' : 'Subscribe'}
              </Text>
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
            {cartData?.deliveryAddress && (
              <View style={styles.addressSection}>
                <View style={styles.addressHeader}>
                  <Ionicons
                    name="location-sharp"
                    size={16}
                    color={colors.primary}
                  />
                  <Text
                    variant="xs"
                    weight="bold"
                    color={colors.textSecondary}
                    style={{ marginLeft: 4 }}
                  >
                    DELIVERING TO
                  </Text>
                </View>
                <Text weight="semibold">{cartData.deliveryAddress.label}</Text>
                <Text
                  variant="s"
                  color={colors.textSecondary}
                  numberOfLines={1}
                >
                  {cartData.deliveryAddress.address},{' '}
                  {cartData.deliveryAddress.city}
                </Text>
              </View>
            )}

            <View style={styles.qtySection}>
              <Text variant="m" weight="semibold">
                Quantity per Delivery
              </Text>
              <View style={styles.qtyControls}>
                <TouchableOpacity
                  style={styles.qtyButton}
                  onPress={decrementQty}
                >
                  <Ionicons
                    name="remove"
                    size={20}
                    color={colors.textPrimary}
                  />
                </TouchableOpacity>
                <Text variant="l" weight="bold" style={styles.qtyText}>
                  {quantity}
                </Text>
                <TouchableOpacity
                  style={styles.qtyButton}
                  onPress={incrementQty}
                >
                  <Ionicons name="add" size={20} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>
            </View>

            <Text variant="m" weight="semibold" style={styles.sectionTitle}>
              Delivery Frequency
            </Text>

            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeOption,
                  type === 'DAILY' && styles.selectedTypeOption,
                ]}
                onPress={() => setType('DAILY')}
              >
                <View
                  style={[
                    styles.radio,
                    type === 'DAILY' && styles.selectedRadio,
                  ]}
                >
                  {type === 'DAILY' && <View style={styles.radioInner} />}
                </View>
                <View style={styles.typeInfo}>
                  <Text weight="medium">Daily</Text>
                  <Text variant="xs" color={colors.textSecondary}>
                    Delivery every day
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeOption,
                  type === 'ALTERNATE' && styles.selectedTypeOption,
                ]}
                onPress={() => setType('ALTERNATE')}
              >
                <View
                  style={[
                    styles.radio,
                    type === 'ALTERNATE' && styles.selectedRadio,
                  ]}
                >
                  {type === 'ALTERNATE' && <View style={styles.radioInner} />}
                </View>
                <View style={styles.typeInfo}>
                  <Text weight="medium">Alternate Days</Text>
                  <Text variant="xs" color={colors.textSecondary}>
                    Delivery every 2nd day
                  </Text>
                </View>
              </TouchableOpacity>

              {type !== 'CUSTOM' && getUpcomingDates.length > 0 && (
                <View style={styles.upcomingDatesContainer}>
                  <Text
                    variant="xs"
                    color={colors.textSecondary}
                    style={{ marginBottom: 4 }}
                  >
                    Next deliveries:
                  </Text>
                  <View style={styles.upcomingDatesRow}>
                    {getUpcomingDates.map((d, i) => (
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

              <TouchableOpacity
                style={[
                  styles.typeOption,
                  type === 'CUSTOM' && styles.selectedTypeOption,
                ]}
                onPress={() => setType('CUSTOM')}
              >
                <View
                  style={[
                    styles.radio,
                    type === 'CUSTOM' && styles.selectedRadio,
                  ]}
                >
                  {type === 'CUSTOM' && <View style={styles.radioInner} />}
                </View>
                <View style={styles.typeInfo}>
                  <Text weight="medium">Custom Days</Text>
                  <Text variant="xs" color={colors.textSecondary}>
                    Select specific days of the week
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {type === 'CUSTOM' && (
              <View style={styles.daysContainer}>
                {DAYS.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayChip,
                      customDays.includes(day) && styles.selectedDayChip,
                    ]}
                    onPress={() => toggleDay(day)}
                  >
                    <Text
                      variant="xs"
                      weight="medium"
                      color={
                        customDays.includes(day)
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
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
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
                (type === 'CUSTOM' && customDays.length === 0)
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
  addressSection: {
    backgroundColor: colors.background,
    padding: spacing.m,
    borderRadius: spacing.radius.m,
    marginBottom: spacing.l,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
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
