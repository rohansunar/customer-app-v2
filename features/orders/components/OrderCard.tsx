import React, { useCallback, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useCancelOrder } from '../hooks/useCancelOrder';
import { Order } from '../types';
import OrderCardSkeleton from './OrderCardSkeleton';
import { orderCardStyles } from './styles';
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

  const handleConfirmCancel = useCallback((cancelReason: string) => {
    if (order) {
      cancelOrderMutation.mutate({ orderId: order.id, cancelReason });
    }
  }, [cancelOrderMutation, order]);

  if (loading || !order) {
    return <OrderCardSkeleton />;
  }

  const canCancel = order.status !== 'CANCELLED' && order.status !== 'DELIVERED';

  return (
    <TouchableOpacity
      style={orderCardStyles.card}
      onPress={onPress}
      activeOpacity={0.7}
      accessible={true}
      accessibilityLabel={`Order ${order.orderNo}, status ${order.status}, total ${order.total_amount}`}
      accessibilityRole="button"
    >
      {/* Order Info */}
      <View style={orderCardStyles.info}>
        <OrderHeader orderNo={order.orderNo} createdAt={order.created_at} />

        <Text style={orderCardStyles.price}>Total Amount: ₹ {order.total_amount}</Text>

        <StatusBadge status={order.status} />

        {order.status === 'OUT_FOR_DELIVERY' && <OTPSegment otp={otp} />}

        {canCancel && <CancelButton onPress={handleCancelPress} />}
      </View>

      <OrderModal
        visible={isModalVisible}
        onClose={handleModalClose}
        onConfirm={handleConfirmCancel}
      />
    </TouchableOpacity>
  );
}

export default React.memo(OrderCardComponent);
