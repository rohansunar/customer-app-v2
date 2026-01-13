import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Card } from '@/core/ui/Card';
import { Text } from '@/core/ui/Text';
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
  onPress: () => void;
}

function OrderCardComponent({ order, loading, onPress }: Props) {
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
        cancelOrderMutation.mutate({ orderId: order.id, cancelReason });
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
      onTouchEnd={onPress}
      accessible={true}
      accessibilityLabel={`Order ${order.orderNo}, status ${order.status}, total ${order.total_amount}`}
      accessibilityRole="button"
    >
      {/* Order Info */}
      <View style={styles.info}>
        <OrderHeader orderNo={order.orderNo} createdAt={order.created_at} />

        <Text variant="s" color={colors.textSecondary} style={styles.price}>
          Total Amount: ₹ {order.total_amount}
        </Text>

        <StatusBadge status={order.status} />

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
  },
  info: {
    flex: 1,
  },
  price: {
    marginTop: spacing.s,
    marginBottom: spacing.s,
  },
});

export default React.memo(OrderCardComponent);
