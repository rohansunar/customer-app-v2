import { useAlert } from '@/core/context/AlertContext';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { statusColors } from '@/core/theme/statusColors';
import { Badge } from '@/core/ui/Badge';
import { Button } from '@/core/ui/Button';
import { Card } from '@/core/ui/Card';
import { Text } from '@/core/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
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
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
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
  const { showConfirm } = useAlert();

  const handleToggleStatus = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateStatus.mutate({ id: subscription.id });
  };

  const handleDelete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      'Delete Subscription',
      `Are you sure you want to delete your ${productName} subscription?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            deleteSubscription.mutate({ id: subscription.id });
          },
        },
      ]
    );
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
      <Animated.View style={pressStyle}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.pressable}
          disabled={isProcessing}
        >
          <Card style={[styles.card, !isActive && !isProcessing && styles.pausedCard]}>
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
                  color={isActive ? colors.textPrimary : colors.textSecondary}
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
                    <Text variant="xs" color={colors.primary} weight="medium">
                      {subscription.quantity} Unit{subscription.quantity > 1 ? 's' : ''}
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
                        subscription.custom_days
                      )}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Animated Status Badge */}
              <Animated.View style={pulseStyle}>
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
                      : isActive ? statusColors.ACTIVE.text : statusColors.PAUSED.text
                  }
                  borderColor={
                    isProcessing
                      ? statusColors.PROCESSING.border
                      : isActive ? statusColors.ACTIVE.border : statusColors.PAUSED.border
                  }
                />
              </Animated.View>
            </View>

            {/* Details Section */}
            <View style={styles.detailsContainer}>
              {/* Start Date */}
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

        <View style={styles.footer}>
          <Button
            title={isActive ? 'Pause' : 'Resume'}
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
          <Button
            title=""
            onPress={() =>
              showConfirm(
                'Delete Subscription', // title
                'Are you sure you want to delete this Subscription?', // message
                () => {
                  deleteSubscription.mutate({ id: subscription.id });
                },
                () => {
                  console.log('Deletion cancelled');
                },
                'Delete', // confirmText
                'Cancel', // cancelText
              )
            }
            variant="ghost"
            style={styles.deleteButton}
            loading={deleteSubscription.isPending}
            icon={
              <Ionicons name="trash-outline" size={18} color={colors.error} />
            }
          />
        </View>
      </Card>
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
    opacity: 0.7,
    backgroundColor: colors.background,
    shadowOpacity: 0.05,
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
    alignItems: 'flex-start',
    marginBottom: spacing.m,
    zIndex: 1,
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
    gap: spacing.s,
    zIndex: 1,
  },
  actionButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: spacing.radius.l,
  },
  deleteButton: {
    minHeight: 48,
    width: 48,
    paddingHorizontal: 0,
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
});
