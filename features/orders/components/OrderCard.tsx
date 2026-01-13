import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Card } from '@/core/ui/Card';
import { Text } from '@/core/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useCancelOrder } from '../hooks/useCancelOrder';
import { Order } from '../types';
import OrderCardSkeleton from './OrderCardSkeleton';
import CancelButton from './sub-components/CancelButton';
import OrderHeader from './sub-components/OrderHeader';
import OrderModal from './sub-components/OrderModal';
import OTPSegment from './sub-components/OTPSegment';
import StatusBadge from './sub-components/StatusBadge';

interface Props {
  order?: Order;
  loading?: boolean;
}

function OrderCardComponent({ order, loading }: Props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const cancelOrderMutation = useCancelOrder();

  const otp = useMemo(() => Math.floor(Math.random() * 9000) + 1000, []);

  const handleCancelPress = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const handleConfirmCancel = useCallback(
    (cancelReason: string) => {
      if (order) {
        cancelOrderMutation.mutate(
          { orderId: order.id, cancelReason },
          {
            onSuccess: () => {
              setIsModalVisible(false);
            },
          },
        );
      }
    },
    [cancelOrderMutation, order],
  );

  if (loading || !order) {
    return <OrderCardSkeleton />;
  }

  const canCancel =
    order.status !== 'CANCELLED' && order.status !== 'DELIVERED';

  return (
    <Card
      style={styles.card}
      accessible={true}
      accessibilityLabel={`Order ${order.orderNo}, status ${order.status}, total ${order.total_amount}`}
      accessibilityRole="button"
    >
      <OrderHeader orderNo={order.orderNo} createdAt={order.created_at} />

      <View style={styles.content}>
        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="location-outline"
              size={16}
              color={colors.textSecondary}
            />
            <Text
              variant="s"
              weight="semibold"
              color={colors.textSecondary}
              style={styles.sectionTitle}
            >
              Delivery Address: {order.address.label}
            </Text>
          </View>
          <Text
            variant="xs"
            color={colors.textTertiary}
            style={styles.addressText}
          >
            {order.address.address}, {order.address.pincode}
          </Text>
        </View>

        {/* Items List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="list-outline"
              size={16}
              color={colors.textSecondary}
            />
            <Text
              variant="s"
              weight="semibold"
              color={colors.textSecondary}
              style={styles.sectionTitle}
            >
              Items
            </Text>
          </View>
          {order.cart.cartItems.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Text variant="xs" color={colors.textPrimary}>
                {item.quantity} x {item.product.name}
              </Text>
              <Text variant="xs" weight="medium" color={colors.textPrimary}>
                ₹ {item.price}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <View>
            <Text variant="s" color={colors.textSecondary}>
              Total Amount
            </Text>
            <Text variant="m" weight="bold" color={colors.primary}>
              ₹ {order.total_amount}
            </Text>
          </View>
          <StatusBadge status={order.status} />
        </View>

        {order.status === 'OUT_FOR_DELIVERY' && <OTPSegment otp={otp} />}

        {canCancel && <CancelButton onPress={handleCancelPress} />}
      </View>

      <OrderModal
        visible={isModalVisible}
        onClose={handleModalClose}
        onConfirm={handleConfirmCancel}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.m,
    padding: spacing.m,
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.l,
    borderWidth: 1,
    borderColor: colors.border,
  },
  content: {
    marginTop: spacing.s,
  },
  section: {
    marginBottom: spacing.m,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    marginLeft: spacing.xs,
  },
  addressText: {
    paddingLeft: spacing.m + spacing.xs,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs / 2,
    paddingLeft: spacing.m + spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.s,
    marginTop: spacing.s,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

export default React.memo(OrderCardComponent);
