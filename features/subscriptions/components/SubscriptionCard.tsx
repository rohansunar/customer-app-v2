import { useAlert } from '@/core/context/AlertContext';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { statusColors } from '@/core/theme/statusColors';
import { Badge } from '@/core/ui/Badge';
import { Button } from '@/core/ui/Button';
import { Card } from '@/core/ui/Card';
import { Text } from '@/core/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDeleteSubscription } from '../hooks/useDeleteSubscription';
import { useUpdateSubscriptionStatus } from '../hooks/useUpdateSubscriptionStatus';
import { Subscription } from '../types';
import { getFrequencyLabel } from '../utils/subscriptionUtils';
import { SubscriptionModal } from './SubscriptionModal';

interface Props {
  subscription: Subscription;
  productName: string; // Ideally part of subscription object or fetched
}

export function SubscriptionCard({ subscription, productName }: Props) {
  const updateStatus = useUpdateSubscriptionStatus();
  const deleteSubscription = useDeleteSubscription();
  const [isEditVisible, setIsEditVisible] = useState(false);
  const isActive = subscription.status === 'ACTIVE';
  const { showConfirm } = useAlert();

  const handleToggleStatus = () => {
    updateStatus.mutate({
      id: subscription.id,
    });
  };

  return (
    <>
      <Card style={[styles.card, !isActive && styles.pausedCard]}>
        <View style={styles.header}>
          <View style={styles.productInfo}>
            <Text
              variant="l"
              weight="bold"
              color={isActive ? colors.textPrimary : colors.textSecondary}
            >
              {productName}
            </Text>
            <Text variant="s" color={colors.textSecondary}>
              {subscription.quantity} Unit{subscription.quantity > 1 ? 's' : ''}{' '}
              •{' '}
              {getFrequencyLabel(
                subscription.frequency,
                subscription.custom_days,
              )}
            </Text>
          </View>
          <Badge
            label={isActive ? 'ACTIVE' : 'PAUSED'}
            backgroundColor={
              isActive
                ? statusColors.ACTIVE.background
                : statusColors.PAUSED.background
            }
            textColor={
              isActive ? statusColors.ACTIVE.text : statusColors.PAUSED.text
            }
            borderColor={
              isActive ? statusColors.ACTIVE.border : statusColors.PAUSED.border
            }
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color={colors.textSecondary}
            />
            <Text
              variant="xs"
              color={colors.textSecondary}
              style={styles.detailText}
            >
              Starts: {new Date(subscription.start_date).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons
              name="time-outline"
              size={16}
              color={colors.textSecondary}
            />
            <Text
              variant="xs"
              color={colors.textSecondary}
              style={styles.detailText}
            >
              Next Delivery Date :{' '}
              {new Date(subscription.next_delivery_date).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            title="Edit"
            onPress={() => setIsEditVisible(true)}
            variant="ghost"
            style={styles.editButton}
            icon={
              <Ionicons
                name="create-outline"
                size={18}
                color={colors.primary}
              />
            }
          />
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

      <SubscriptionModal
        visible={isEditVisible}
        onClose={() => setIsEditVisible(false)}
        productName={productName}
        productId={subscription.productId}
        existingSubscription={subscription}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.m,
    padding: spacing.m,
    borderRadius: spacing.radius.l,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pausedCard: {
    opacity: 0.8,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.s,
  },
  productInfo: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.s,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: spacing.m,
    marginBottom: spacing.m,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.s,
  },
  editButton: {
    minHeight: 40,
    paddingVertical: spacing.s,
    borderRadius: spacing.radius.m,
    flex: 1,
  },
  actionButton: {
    minHeight: 40,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radius.m,
    flex: 1,
  },

  deleteButton: {
    minHeight: 40,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radius.m,
    width: 40,
    paddingHorizontal: 0,
  },
});
