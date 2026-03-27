import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { statusColors } from '@/core/theme/statusColors';
import { Badge } from '@/core/ui/Badge';
import { Card } from '@/core/ui/Card';
import { Text } from '@/core/ui/Text';
import CustomAlert from '@/core/ui/customAlert';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
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
}

/**
 * Modern SubscriptionCard with gradients, animations, and enhanced UI
 * Refactored following SOLID principles
 */
const MENU_WIDTH = 220;

export function SubscriptionCard({ subscription }: Props) {
  const updateStatus = useUpdateSubscriptionStatus();
  const deleteSubscription = useDeleteSubscription();
  const isActive = subscription.status === 'ACTIVE';
  const isProcessing = subscription.status === 'PROCESSING';

  // State for Menu and Alert
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [alertVisible, setAlertVisible] = useState(false);
  const menuButtonRef = useRef<View>(null);

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
  const addressLocation = [
    subscription.customerAddress?.location?.name,
    subscription.customerAddress?.location?.state,
    subscription.customerAddress?.pincode,
  ].filter(Boolean);
  const statusActionLabel = isActive
    ? 'Pause Subscription'
    : 'Resume Subscription';
  const statusActionIcon = isActive ? 'pause-outline' : 'play-outline';

  const handleToggleStatus = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateStatus.mutate({ id: subscription.id });
  };

  const handleStatusMenuPress = () => {
    closeMenu();
    handleToggleStatus();
  };

  const openMenu = () => {
    menuButtonRef.current?.measureInWindow((x, y, width, height) => {
      const screen = Dimensions.get('window');
      const menuHeight =
        (isProcessing ? 0 : 56) + 56 + spacing.xs * 2 + (isProcessing ? 0 : 1);
      const proposedTop = y + height + spacing.xs;
      const maxLeft = screen.width - MENU_WIDTH - spacing.m;
      const maxTop = screen.height - menuHeight - spacing.l;

      setMenuPosition({
        top:
          proposedTop > maxTop
            ? Math.max(spacing.l, y - menuHeight - spacing.xs)
            : proposedTop,
        left: Math.min(
          Math.max(spacing.m, x + width - MENU_WIDTH),
          Math.max(spacing.m, maxLeft),
        ),
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
      <View style={styles.pressable}>
        <Card
          style={[styles.card, !isActive && !isProcessing && styles.pausedCard]}
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
                {subscription.product?.images?.[0] ? (
                  <Image
                    source={{ uri: subscription.product.images[0] }}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons name="water" size={28} color={colors.white} />
                )}
              </LinearGradient>

              {/* Product Info */}
              <View style={styles.productInfo}>
                <Text
                  variant="l"
                  weight="bold"
                  color={isActive ? colors.textPrimary : colors.textSecondary}
                >
                  {subscription.product.name}
                </Text>
                <View style={styles.quantityRow}>
                  <View style={styles.quantityBadge}>
                    <Ionicons
                      name="cube-outline"
                      size={14}
                      color={colors.primary}
                    />
                    <Text variant="xs" color={colors.primary} weight="medium">
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

              <View style={styles.statusBadge}>
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
              </View>
            </View>
          </View>

          {/* Details Section */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <View style={[styles.iconBox, { backgroundColor: '#DBEAFE' }]}>
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
                <Text variant="s" weight="medium" color={colors.textPrimary}>
                  {formatSubscriptionDate(subscription.start_date)}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View
                style={[styles.iconBox, { backgroundColor: urgencyColor + '20' }]}
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
                  <Text variant="s" weight="medium" color={colors.textPrimary}>
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

            {subscription.customerAddress && (
              <View style={[styles.detailRow, styles.detailRowTopAligned]}>
                <View
                  style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}
                >
                  <Ionicons
                    name="location-outline"
                    size={16}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.detailContent}>
                  <Text variant="xs" color={colors.textTertiary}>
                    Delivery Address
                  </Text>
                  <Text variant="s" weight="medium" color={colors.textPrimary}>
                    {subscription.customerAddress.label}
                  </Text>
                  <Text
                    variant="s"
                    color={colors.textSecondary}
                    style={styles.addressLine}
                  >
                    {subscription.customerAddress.address}
                  </Text>
                  {addressLocation.length > 0 && (
                    <Text
                      variant="xs"
                      color={colors.textTertiary}
                      style={styles.addressMeta}
                    >
                      {addressLocation.join(', ')}
                    </Text>
                  )}
                </View>
              </View>
            )}
          </View>

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

          {isProcessing && (
            <View style={styles.footer}>
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
            </View>
          )}
        </Card>
      </View>

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
              {!isProcessing && (
                <>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={handleStatusMenuPress}
                    accessibilityRole="menuitem"
                    accessibilityLabel={statusActionLabel}
                  >
                    <Ionicons
                      name={statusActionIcon as any}
                      size={20}
                      color={colors.textPrimary}
                    />
                    <Text
                      variant="s"
                      color={colors.textPrimary}
                      style={styles.menuText}
                    >
                      {statusActionLabel}
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.menuDivider} />
                </>
              )}
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
        message={
          <View style={styles.alertContent}>
            <Text style={styles.alertMainMessage}>
              Are you sure you want to cancel your subscription for{' '}
              <Text weight="bold">{subscription.product.name}</Text>?
            </Text>

            <View style={styles.alertInfoBox}>
              <View style={styles.alertInfoRow}>
                <Ionicons
                  name="time-outline"
                  size={18}
                  color={colors.primary}
                />
                <Text variant="s" style={styles.alertInfoText}>
                  Cancellation will be processed and it will take{' '}
                  <Text weight="bold">7 working days</Text> to credit the amount
                  back to your account.
                </Text>
              </View>

              <View style={[styles.alertInfoRow, { marginTop: spacing.s }]}>
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color={colors.error}
                />
                <Text variant="s" style={styles.alertInfoText}>
                  As per payment partner policies, a processing fee of{' '}
                  <Text weight="bold">2.5% + 18% GST</Text> is non-refundable.
                </Text>
              </View>
            </View>

            <Text variant="xs" color={colors.textTertiary} centered>
              This action cannot be undone.
            </Text>
          </View>
        }
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
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
  },
  quantityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  detailRowTopAligned: {
    alignItems: 'flex-start',
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
    flexWrap: 'wrap',
    gap: spacing.s,
    marginTop: 2,
  },
  countdownBadge: {
    paddingHorizontal: spacing.s,
    paddingVertical: 2,
    borderRadius: 8,
  },
  addressLine: {
    lineHeight: 20,
    marginTop: 2,
  },
  addressMeta: {
    lineHeight: 18,
    marginTop: 2,
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
    width: MENU_WIDTH,
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
  menuDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.m,
  },
  statusBadge: {
    marginTop: spacing.s,
    alignSelf: 'flex-end',
  },

  // Alert Content Styles
  alertContent: {
    width: '100%',
    alignItems: 'center',
  },
  alertMainMessage: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.l,
  },
  alertInfoBox: {
    width: '100%',
    backgroundColor: colors.background,
    padding: spacing.m,
    borderRadius: spacing.radius.m,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.m,
  },
  alertInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.s,
  },
  alertInfoText: {
    flex: 1,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
