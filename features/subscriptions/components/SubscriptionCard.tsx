import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { statusColors } from '@/core/theme/statusColors';
import { Badge } from '@/core/ui/Badge';
import { Button } from '@/core/ui/Button';
import { Card } from '@/core/ui/Card';
import { Text } from '@/core/ui/Text';
import CustomAlert from '@/core/ui/customAlert';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useDeleteSubscription } from '../hooks/useDeleteSubscription';
import { useUpdateSubscriptionStatus } from '../hooks/useUpdateSubscriptionStatus';
import { Subscription } from '../types';
import { getFrequencyLabel } from '../utils/subscriptionUtils';
import {
  calculateDaysUntil,
  calculateDeliveryProgress,
  formatCountdown,
  formatShortDate,
  formatSubscriptionDate,
  getGradientColors,
  getOverlayGradient,
  getUrgencyColor,
} from '../utils/subscriptionHelpers';

interface Props {
  subscription: Subscription;
  productName: string;
  index: number;
}

/**
 * Modern SubscriptionCard with gradients, animations, and enhanced UI
 * Refactored following SOLID principles
 */
export function SubscriptionCard({ subscription, productName, index }: Props) {
  const updateStatus = useUpdateSubscriptionStatus();
  const deleteSubscription = useDeleteSubscription();
  const isActive = subscription.status === 'ACTIVE';
  const isProcessing = subscription.status === 'PROCESSING';

  // State for Menu and Alert
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [alertVisible, setAlertVisible] = useState(false);
  const menuButtonRef = useRef<View>(null);

  // Animation values
  const pulseScale = useSharedValue(1);
  const pressScale = useSharedValue(1);

  // Use centralized utility functions
  const daysUntilDelivery = useMemo(
    () => calculateDaysUntil(subscription.next_delivery_date),
    [subscription.next_delivery_date],
  );

  const urgencyColor = useMemo(
    () => getUrgencyColor(daysUntilDelivery),
    [daysUntilDelivery],
  );

  const deliveryProgress = useMemo(
    () => calculateDeliveryProgress(daysUntilDelivery),
    [daysUntilDelivery],
  );

  const gradientColors = useMemo(() => getGradientColors(isActive), [isActive]);
  const overlayGradient = useMemo(
    () => getOverlayGradient(isActive),
    [isActive],
  );

  // Pulse animation for active status badge
  useEffect(() => {
    if (isActive) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 1000 }),
          withTiming(1, { duration: 1000 }),
        ),
        -1,
        false,
      );
    } else {
      pulseScale.value = withTiming(1);
    }
  }, [isActive, pulseScale]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  const handlePressIn = () => {
    pressScale.value = withSpring(0.98);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1);
  };

  const handleToggleStatus = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateStatus.mutate({ id: subscription.id });
  };

  const openMenu = () => {
    menuButtonRef.current?.measureInWindow((x, y, width, height) => {
      setMenuPosition({
        top: y + height + 2,
        left: x + width - 200,
      });
      setMenuVisible(true);
      Haptics.selectionAsync();
    });
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  const handleConfirmDelete = () => {
    setAlertVisible(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    deleteSubscription.mutate({ id: subscription.id });
  };

  const handleDeleteRequest = () => {
    closeMenu();
    setAlertVisible(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  return (
    <>
      <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
        <Animated.View style={pressStyle}>
          <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={styles.pressable}
            disabled={isProcessing}
          >
            <Card
              style={[
                styles.card,
                !isActive && !isProcessing && styles.pausedCard,
              ]}
            >
              {/* Gradient Background for Active */}
              {isActive && (
                <LinearGradient
                  colors={overlayGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientOverlay}
                />
              )}

              {/* Header Section */}
              <View style={styles.header}>
                <View style={styles.headerContent}>
                  {/* Product Icon with Gradient */}
                  <LinearGradient
                    colors={gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.iconContainer}
                  >
                    <Ionicons name="water" size={28} color={colors.white} />
                  </LinearGradient>

                  {/* Product Info */}
                  <View style={styles.productInfo}>
                    <Text
                      variant="l"
                      weight="bold"
                      color={
                        isActive ? colors.textPrimary : colors.textSecondary
                      }
                    >
                      {productName}
                    </Text>
                    <View style={styles.quantityRow}>
                      <View style={styles.quantityBadge}>
                        <Ionicons
                          name="cube-outline"
                          size={14}
                          color={colors.primary}
                        />
                        <Text
                          variant="xs"
                          color={colors.primary}
                          weight="medium"
                        >
                          {subscription.quantity} Unit
                          {subscription.quantity > 1 ? 's' : ''}
                        </Text>
                      </View>
                      <View style={styles.frequencyBadge}>
                        <Ionicons
                          name="repeat-outline"
                          size={14}
                          color={colors.textSecondary}
                        />
                        <Text variant="xs" color={colors.textSecondary}>
                          {getFrequencyLabel(
                            subscription.frequency,
                            subscription.custom_days,
                          )}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Menu Trigger Icon */}
                <View style={styles.menuContainer}>
                  <TouchableOpacity
                    ref={menuButtonRef}
                    onPress={openMenu}
                    style={styles.menuButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons
                      name="ellipsis-vertical"
                      size={20}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>

                  {/* Animated Status Badge */}
                  <Animated.View
                    style={[
                      pulseStyle,
                      { marginTop: spacing.s, alignSelf: 'flex-end' },
                    ]}
                  >
                    <Badge
                      label={subscription.status}
                      backgroundColor={
                        isProcessing
                          ? statusColors.PROCESSING.background
                          : isActive
                            ? statusColors.ACTIVE.background
                            : statusColors.PAUSED.background
                      }
                      textColor={
                        isProcessing
                          ? statusColors.PROCESSING.text
                          : isActive
                            ? statusColors.ACTIVE.text
                            : statusColors.PAUSED.text
                      }
                      borderColor={
                        isProcessing
                          ? statusColors.PROCESSING.border
                          : isActive
                            ? statusColors.ACTIVE.border
                            : statusColors.PAUSED.border
                      }
                    />
                  </Animated.View>
                </View>
              </View>

              {/* Details Section */}
              <View style={styles.detailsContainer}>
                {/* Start Date */}
                <View style={styles.detailRow}>
                  <View
                    style={[styles.iconBox, { backgroundColor: '#DBEAFE' }]}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={16}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.detailContent}>
                    <Text variant="xs" color={colors.textTertiary}>
                      Started
                    </Text>
                    <Text
                      variant="s"
                      weight="medium"
                      color={colors.textPrimary}
                    >
                      {formatSubscriptionDate(subscription.start_date)}
                    </Text>
                  </View>
                </View>

                {/* Next Delivery with Countdown */}
                <View style={styles.detailRow}>
                  <View
                    style={[
                      styles.iconBox,
                      { backgroundColor: urgencyColor + '20' },
                    ]}
                  >
                    <Ionicons
                      name="time-outline"
                      size={16}
                      color={urgencyColor}
                    />
                  </View>
                  <View style={styles.detailContent}>
                    <Text variant="xs" color={colors.textTertiary}>
                      Next Delivery
                    </Text>
                    <View style={styles.deliveryInfo}>
                      <Text
                        variant="s"
                        weight="medium"
                        color={colors.textPrimary}
                      >
                        {formatShortDate(subscription.next_delivery_date)}
                      </Text>
                      <View
                        style={[
                          styles.countdownBadge,
                          { backgroundColor: urgencyColor + '15' },
                        ]}
                      >
                        <Text variant="xs" weight="bold" color={urgencyColor}>
                          {formatCountdown(daysUntilDelivery)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* Progress Bar */}
              {isActive && daysUntilDelivery <= 7 && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${deliveryProgress}%`,
                          backgroundColor: urgencyColor,
                        },
                      ]}
                    />
                  </View>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.footer}>
                {isProcessing ? (
                  <View style={styles.progressFooter}>
                    <ActivityIndicator size="small" color={colors.primary} />
                    <Text
                      variant="s"
                      color={colors.primary}
                      weight="medium"
                      style={{ marginLeft: spacing.s }}
                    >
                      Processing Subscription...
                    </Text>
                  </View>
                ) : (
                  <Button
                    title={
                      isActive ? 'Pause Subscription' : 'Resume Subscription'
                    }
                    onPress={handleToggleStatus}
                    variant={isActive ? 'outline' : 'primary'}
                    style={styles.actionButton}
                    loading={updateStatus.isPending}
                    icon={
                      <Ionicons
                        name={isActive ? 'pause' : 'play'}
                        size={18}
                        color={isActive ? colors.primary : colors.white}
                      />
                    }
                  />
                )}
              </View>
            </Card>
          </Pressable>
        </Animated.View>
      </Animated.View>

      {/* Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.menuPopover,
                {
                  top: menuPosition.top,
                  left: menuPosition.left,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleDeleteRequest}
                accessibilityRole="menuitem"
                accessibilityLabel="Cancel Subscription"
              >
                <Ionicons name="trash-outline" size={20} color={colors.error} />
                <Text variant="s" color={colors.error} style={styles.menuText}>
                  Cancel Subscription
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Custom Confirmation Alert */}
      <CustomAlert
        visible={alertVisible}
        title="Cancel Subscription"
        message={`Are you sure you want to cancel your subscription for ${productName}? This action cannot be undone.`}
        type="error"
        icon="warning"
        primaryButtonText="Yes, Cancel"
        secondaryButtonText="Keep Subscription"
        onPrimaryPress={handleConfirmDelete}
        onSecondaryPress={() => setAlertVisible(false)}
        onClose={() => setAlertVisible(false)}
        showCloseButton={true}
      />
    </>
  );
}

const styles = StyleSheet.create({
  pressable: {
    marginBottom: spacing.m,
  },
  card: {
    padding: spacing.l,
    borderRadius: spacing.radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  pausedCard: {
    opacity: 0.8,
    backgroundColor: colors.background,
    shadowOpacity: 0.05,
    borderColor: colors.border + '80',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.m,
    zIndex: 1,
  },
  headerContent: {
    flexDirection: 'row',
    flex: 1,
  },
  menuContainer: {
    alignItems: 'flex-end',
    marginLeft: spacing.s,
  },
  menuButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xs,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  quantityRow: {
    flexDirection: 'row',
    gap: spacing.s,
    marginTop: spacing.xs,
  },
  quantityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: spacing.s,
    paddingVertical: 4,
    borderRadius: 12,
  },
  frequencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.s,
    paddingVertical: 4,
    borderRadius: 12,
  },
  detailsContainer: {
    gap: spacing.s,
    marginBottom: spacing.m,
    zIndex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.s,
  },
  detailContent: {
    flex: 1,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
    marginTop: 2,
  },
  countdownBadge: {
    paddingHorizontal: spacing.s,
    paddingVertical: 2,
    borderRadius: 8,
  },
  progressContainer: {
    marginBottom: spacing.m,
    zIndex: 1,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  footer: {
    flexDirection: 'row',
    zIndex: 1,
  },
  actionButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: spacing.radius.l,
  },
  progressFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: spacing.s,
    backgroundColor: colors.primary + '10',
    borderRadius: spacing.radius.m,
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },

  // Menu Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  menuPopover: {
    position: 'absolute',
    width: 200,
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.m,
    paddingVertical: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.m,
    gap: spacing.m,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
