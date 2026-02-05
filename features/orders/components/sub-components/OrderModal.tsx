import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Text } from '@/core/ui/Text';
import { Input } from '@/core/ui/Input';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface OrderModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

interface CancelOption {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const CANCEL_REASONS: CancelOption[] = [
  { label: 'Changed my mind', value: 'Changed my mind', icon: 'heart-dislike-outline' },
  { label: 'Wrong item ordered', value: 'Wrong item', icon: 'cart-outline' },
  { label: 'Delivery delay', value: 'Delivery delay', icon: 'time-outline' },
  { label: 'Found a better deal', value: 'Found a better deal', icon: 'pricetag-outline' },
  { label: 'Price too high', value: 'Price too high', icon: 'cash-outline' },
  { label: 'Ordered by mistake', value: 'Ordered by mistake', icon: 'alert-circle-outline' },
  { label: 'Want to change items', value: 'Want to change items', icon: 'swap-horizontal-outline' },
  { label: 'Delivery address issue', value: 'Delivery address issue', icon: 'location-outline' },
  { label: 'Changed my schedule', value: 'Changed my schedule', icon: 'calendar-outline' },
  { label: 'Other reasons', value: 'Other', icon: 'ellipsis-horizontal-circle-outline' },
];

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

function ReasonCard({
  option,
  isSelected,
  onSelect,
}: {
  option: CancelOption;
  isSelected: boolean;
  onSelect: (value: string) => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.reasonCard, isSelected && styles.reasonCardSelected]}
      onPress={() => onSelect(option.value)}
      activeOpacity={0.7}
    >
      <View style={[styles.reasonIconContainer, isSelected && styles.reasonIconContainerSelected]}>
        <Ionicons
          name={option.icon}
          size={20}
          color={isSelected ? colors.white : colors.textSecondary}
        />
      </View>
      <Text
        variant="m"
        weight={isSelected ? "bold" : "medium"}
        color={isSelected ? colors.primary : colors.textPrimary}
        style={styles.reasonText}
      >
        {option.label}
      </Text>
      <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
        {isSelected && <View style={styles.radioInner} />}
      </View>
    </TouchableOpacity>
  );
}

export default function OrderModal({ visible, onClose, onConfirm }: OrderModalProps) {
  const [cancelReason, setCancelReason] = useState(CANCEL_REASONS[0].value);
  const [otherReason, setOtherReason] = useState('');

  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(fadeAnimation, {
        toValue: visible ? 1 : 0,
        duration: visible ? 250 : 200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnimation, {
        toValue: visible ? 1 : 0.9,
        speed: 12,
        bounciness: 8,
        useNativeDriver: true,
      }),
    ]);

    animation.start();
    return () => animation.stop();
  }, [visible, fadeAnimation, scaleAnimation]);

  const handleConfirm = () => {
    const finalReason = cancelReason === 'Other' ? otherReason.trim() : cancelReason;
    if (cancelReason === 'Other' && !finalReason) {
      // Basic validation for "Other"
      return;
    }
    onConfirm(finalReason);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <Animated.View style={[styles.overlay, { opacity: fadeAnimation }]}>
          <Pressable style={styles.backdrop} onPress={onClose} />

          <Animated.View
            style={[
              styles.modalContent,
              { opacity: fadeAnimation, transform: [{ scale: scaleAnimation }] },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.titleContainer}>
                <Text variant="xl" weight="bold" color={colors.textPrimary}>
                  Cancel Order
                </Text>
                <Text variant="s" color={colors.textSecondary} style={styles.subtitle}>
                  {"We're sorry to see you go. Please let us know why."}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>

            <View style={styles.listContainer}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                style={{ maxHeight: SCREEN_HEIGHT * 0.4 }}
              >
                {CANCEL_REASONS.map((option) => (
                  <ReasonCard
                    key={option.value}
                    option={option}
                    isSelected={cancelReason === option.value}
                    onSelect={setCancelReason}
                  />
                ))}
              </ScrollView>
            </View>

            {cancelReason === 'Other' && (
              <View style={styles.otherInputContainer}>
                <Input
                  placeholder="Tell us more..."
                  value={otherReason}
                  onChangeText={setOtherReason}
                  autoFocus
                  multiline
                  style={styles.otherInput}
                />
              </View>
            )}

            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.keepButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text variant="m" weight="semibold" color={colors.textSecondary}>
                  Keep Order
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleConfirm}
                activeOpacity={0.8}
                disabled={cancelReason === 'Other' && !otherReason.trim()}
              >
                <Text variant="m" weight="bold" color={colors.white}>
                  Confirm Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: colors.surface,
    width: '90%',
    maxWidth: 400,
    borderRadius: spacing.radius.xl,
    padding: spacing.l,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.l,
  },
  titleContainer: {
    flex: 1,
    paddingRight: spacing.m,
  },
  subtitle: {
    marginTop: spacing.xs,
    lineHeight: 18,
  },
  closeButton: {
    padding: spacing.xs,
  },
  listContainer: {
    marginHorizontal: -spacing.l,
    paddingHorizontal: spacing.l,
  },
  scrollContent: {
    paddingBottom: spacing.s,
  },
  reasonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.m,
    borderRadius: spacing.radius.l,
    marginBottom: spacing.s,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  reasonCardSelected: {
    backgroundColor: `${colors.primary}08`,
    borderColor: colors.primary,
  },
  reasonIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${colors.textTertiary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  reasonIconContainerSelected: {
    backgroundColor: colors.primary,
  },
  reasonText: {
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
  radioCircleSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  otherInputContainer: {
    marginTop: spacing.m,
  },
  otherInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.l,
    gap: spacing.m,
  },
  keepButton: {
    flex: 1,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: spacing.radius.l,
    backgroundColor: colors.background,
  },
  cancelButton: {
    flex: 2,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: spacing.radius.l,
    backgroundColor: colors.error,
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
});
