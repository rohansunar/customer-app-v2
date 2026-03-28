import { colors } from '@/core/theme/colors';
import { showError, showSuccess } from '@/core/ui/toast';
import { spacing } from '@/core/theme/spacing';
import { Card } from '@/core/ui/Card';
import { Text } from '@/core/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  LayoutAnimation,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCancelOrder } from '../hooks/useCancelOrder';
import { useConfirmDelivery } from '../hooks/useConfirmDelivery';
import { Order } from '../types';
import { useAlert } from '@/core/context/AlertContext';
import {
  calculateTotalQuantity,
  canCancelOrder,
  formatOrderDate,
  getPaymentModeColor,
  getPaymentModeLabel,
  getPaymentStatusColor,
  getPaymentStatusLabel,
  getPrimaryProductName,
  getStatusColor,
  getStatusLabel,
} from '../utils/orderHelpers';
import OrderCardSkeleton from './OrderCardSkeleton';
import OrderCancelModal from './sub-components/OrderCancelModal';
import OrderTracker from './OrderTracker';
import SupportModal from './sub-components/SupportModal';
import { orderCardStyles, iconBoxColors } from './styles';

interface Props {
  order?: Order;
  loading?: boolean;
}

function OrderCardComponent({ order, loading }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isSupportModalVisible, setIsSupportModalVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const menuAnchorRef = useRef<View>(null);
  const cancelOrderMutation = useCancelOrder();
  const confirmDeliveryMutation = useConfirmDelivery();
  const router = useRouter();
  const { showConfirm } = useAlert();

  const toggleExpanded = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded((prev) => !prev);
  }, []);

  const handleCancelPress = useCallback(() => {
    setIsMenuVisible(false);
    setTimeout(() => {
      setIsModalVisible(true);
    }, 100);
  }, []);

  const handleContactPress = useCallback(() => {
    setIsMenuVisible(false);
    setTimeout(() => {
      setIsSupportModalVisible(true);
    }, 100);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const toggleMenu = useCallback(() => {
    if (isMenuVisible) {
      setIsMenuVisible(false);
    } else {
      menuAnchorRef.current?.measureInWindow((_x, y, _width, height) => {
        setMenuPosition({
          top: y + height + spacing.xs,
          right: spacing.m,
        });
        setIsMenuVisible(true);
      });
    }
  }, [isMenuVisible]);

  const handleConfirmCancel = useCallback(
    (cancelReason: string) => {
      if (order) {
        cancelOrderMutation.mutate(
          { orderId: order.id, cancelReason },
          {
            onSuccess: () => {
              setIsModalVisible(false);
              router.replace({
                pathname: '/(drawer)/home/orders',
                params: { tab: 'HISTORY' },
              });
            },
            onError: (error: unknown) => {
              setIsModalVisible(false);
              const errorMessage =
                error instanceof Error
                  ? error.message
                  : 'Failed to cancel order';
              showError(errorMessage);
            },
          },
        );
      }
    },
    [cancelOrderMutation, order, router],
  );

  const handleConfirmDelivery = useCallback(() => {
    if (order) {
      showConfirm(
        'Confirm Delivery',
        'Have you received all the products in your order? Please confirm only if you have received the complete order.',
        () => {
          confirmDeliveryMutation.mutate(order.id, {
            onSuccess: () => {
              showSuccess('Delivery confirmed successfully');
            },
            onError: (error: unknown) => {
              const errorMessage =
                error instanceof Error
                  ? error.message
                  : 'Failed to confirm delivery';
              showError(errorMessage);
            },
          });
        },
        undefined,
        'Yes, Received',
        'Not Yet',
      );
    }
  }, [confirmDeliveryMutation, order, showConfirm]);

  if (loading || !order) {
    return <OrderCardSkeleton />;
  }

  const computedValues = useMemo(() => {
    const isCancelled = order.delivery_status === 'CANCELLED';
    const canCancel = canCancelOrder(order.delivery_status);
    const canShowActionsMenu = canCancel && order.payment_status !== 'FAILED';
    const shouldHideActionsAndTracker =
      order.payment_mode === 'ONLINE' &&
      order.payment_status === 'PENDING' &&
      order.delivery_status === 'PENDING';
    const canConfirmDelivery =
      order.delivery_status === 'OUT_FOR_DELIVERY' &&
      order.payment_mode?.toUpperCase() === 'ONLINE' &&
      order.payment_status?.toUpperCase() === 'PAID';
    const isOutForDelivery = order.delivery_status === 'OUT_FOR_DELIVERY';

    return {
      productName: getPrimaryProductName(order.orderItems),
      totalQuantity: calculateTotalQuantity(order.orderItems),
      canCancel,
      statusColor: getStatusColor(order.delivery_status),
      statusLabel: getStatusLabel(order.delivery_status),
      formattedDate: formatOrderDate(order.created_at),
      canShowActionsMenu,
      shouldHideActionsAndTracker,
      paymentStatusColor: getPaymentStatusColor(order.payment_status),
      paymentStatusLabel: getPaymentStatusLabel(order.payment_status),
      paymentModeColor: getPaymentModeColor(order.payment_mode || ''),
      paymentModeLabel: getPaymentModeLabel(order.payment_mode || ''),
      isCancelled,
      canConfirmDelivery,
      isOutForDelivery,
    };
  }, [order]);

  const {
    productName,
    totalQuantity,
    statusColor,
    statusLabel,
    formattedDate,
    canShowActionsMenu,
    shouldHideActionsAndTracker,
    paymentStatusColor,
    paymentStatusLabel,
    paymentModeColor,
    paymentModeLabel,
    isCancelled,
    canConfirmDelivery,
    isOutForDelivery,
  } = computedValues;

  const renderOrderItems = useCallback(
    () =>
      order.orderItems.map((item, index) => (
        <View key={item.id || index} style={orderCardStyles.itemRow}>
          <Text
            variant="xs"
            color={colors.textPrimary}
            style={orderCardStyles.itemName}
          >
            {item.product.name}
          </Text>
          <Text variant="xs" color={colors.textSecondary}>
            {item.quantity} x ₹{item.price} ={' '}
            <Text weight="medium">₹{item.quantity * Number(item.price)}</Text>
          </Text>
        </View>
      )),
    [order.orderItems],
  );

  const renderCancellationInfo = useCallback(() => {
    if (!isCancelled || (!order.cancelReason && !order.cancellation_origin)) {
      return null;
    }

    return (
      <View style={orderCardStyles.cancellationContainer}>
        {order.cancelReason && (
          <View style={orderCardStyles.cancellationRow}>
            <View
              style={[
                orderCardStyles.iconBox,
                { backgroundColor: iconBoxColors.cancellation },
              ]}
            >
              <Ionicons
                name="close-circle-outline"
                size={18}
                color={colors.error}
              />
            </View>
            <View style={orderCardStyles.cancellationContent}>
              <Text
                variant="xs"
                color={colors.textTertiary}
                style={orderCardStyles.cancellationLabel}
              >
                Cancellation Reason
              </Text>
              <Text
                variant="s"
                color={colors.textPrimary}
                style={orderCardStyles.cancellationValue}
              >
                {order.cancelReason}
              </Text>
            </View>
          </View>
        )}
        {order.cancellation_origin && (
          <View style={orderCardStyles.cancellationRow}>
            <View
              style={[
                orderCardStyles.iconBox,
                { backgroundColor: iconBoxColors.cancelledBy },
              ]}
            >
              <Ionicons name="person-outline" size={18} color="#D97706" />
            </View>
            <View style={orderCardStyles.cancellationContent}>
              <Text
                variant="xs"
                color={colors.textTertiary}
                style={orderCardStyles.cancellationLabel}
              >
                Cancelled By
              </Text>
              <Text
                variant="s"
                color={colors.textPrimary}
                style={orderCardStyles.cancellationValue}
              >
                {order.cancellation_origin === 'VENDOR'
                  ? 'SELLER'
                  : order.cancellation_origin}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  }, [isCancelled, order.cancelReason, order.cancellation_origin]);

  const renderMenuModal = useCallback(() => {
    if (!isMenuVisible) return null;

    return (
      <Modal
        visible={isMenuVisible}
        transparent
        animationType="none"
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsMenuVisible(false)}>
          <View style={orderCardStyles.modalBackdrop}>
            <View
              style={[
                orderCardStyles.menuOverlay,
                {
                  top: menuPosition.top,
                  right: menuPosition.right,
                },
              ]}
            >
              <TouchableOpacity
                style={orderCardStyles.menuItem}
                onPress={handleCancelPress}
              >
                <Ionicons
                  name="close-circle-outline"
                  size={18}
                  color={colors.error}
                />
                <Text
                  variant="s"
                  color={colors.error}
                  style={orderCardStyles.menuItemText}
                >
                  Cancel Order
                </Text>
              </TouchableOpacity>

              <View style={orderCardStyles.menuDivider} />

              <TouchableOpacity
                style={orderCardStyles.menuItem}
                onPress={handleContactPress}
              >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={18}
                  color={colors.primary}
                />
                <Text
                  variant="s"
                  color={colors.primary}
                  style={orderCardStyles.menuItemText}
                >
                  Contact Support
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }, [isMenuVisible, menuPosition, handleCancelPress, handleContactPress]);

  return (
    <Card
      style={orderCardStyles.card}
      accessible={true}
      accessibilityLabel={`Order ${order.orderNo}, status ${order.delivery_status}, total ${order.total_amount}`}
    >
      <View style={orderCardStyles.header}>
        <View style={orderCardStyles.headerTitleContainer}>
          <Text
            variant="l"
            weight="bold"
            color={colors.textPrimary}
            style={orderCardStyles.productName}
          >
            {productName}
            {order.orderItems.length > 1 &&
              ` + ${order.orderItems.length - 1} more`}
          </Text>
          <Text
            variant="s"
            color={colors.textTertiary}
            style={orderCardStyles.orderNo}
          >
            Order #{order.orderNo}
          </Text>
        </View>

        <View style={orderCardStyles.headerRightContainer}>
          <View
            style={[
              orderCardStyles.statusBadge,
              { borderColor: statusColor, backgroundColor: colors.surface },
            ]}
          >
            <Ionicons
              name="time-outline"
              size={14}
              color={statusColor}
              style={{ marginRight: spacing.xs }}
            />
            <Text variant="xs" weight="bold" color={statusColor}>
              {statusLabel}
            </Text>
          </View>
          <Text
            variant="xs"
            color={colors.textTertiary}
            style={orderCardStyles.dateText}
          >
            {formattedDate}
          </Text>
        </View>

        {canShowActionsMenu && !shouldHideActionsAndTracker && (
          <TouchableOpacity
            ref={menuAnchorRef}
            onPress={toggleMenu}
            style={orderCardStyles.menuTrigger}
          >
            <Ionicons
              name="ellipsis-vertical"
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={orderCardStyles.detailsContainer}>
        <View style={orderCardStyles.detailRow}>
          <View
            style={[
              orderCardStyles.iconBox,
              { backgroundColor: iconBoxColors.location },
            ]}
          >
            <Ionicons
              name="location-outline"
              size={18}
              color={colors.primary}
            />
          </View>
          <Text
            variant="s"
            color={colors.textSecondary}
            style={orderCardStyles.detailText}
            numberOfLines={1}
          >
            {order.address.address}, {order.address.pincode}
          </Text>
        </View>

        <TouchableOpacity
          style={orderCardStyles.detailRow}
          onPress={toggleExpanded}
          activeOpacity={0.7}
        >
          <View
            style={[
              orderCardStyles.iconBox,
              { backgroundColor: iconBoxColors.quantity },
            ]}
          >
            <Ionicons name="cube-outline" size={18} color="#9333EA" />
          </View>
          <View style={orderCardStyles.quantityRow}>
            <Text
              variant="s"
              color={colors.textSecondary}
              style={orderCardStyles.detailText}
            >
              Quantity: {totalQuantity} Items
            </Text>
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={colors.textTertiary}
            />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={orderCardStyles.itemsList}>{renderOrderItems()}</View>
        )}
      </View>

      <View style={orderCardStyles.footerContainer}>
        <View style={orderCardStyles.amountRow}>
          <Text variant="m" color={colors.textSecondary}>
            Total Amount
          </Text>
          <Text variant="l" weight="bold" color={colors.primary}>
            ₹{order.total_amount}
          </Text>
        </View>
        <View style={orderCardStyles.paymentStatusContainer}>
          <Text
            variant="xs"
            color={colors.textTertiary}
            style={orderCardStyles.paymentLabel}
          >
            Payment:
          </Text>
          <View
            style={[
              orderCardStyles.paymentStatusBadge,
              {
                borderColor: paymentStatusColor,
                backgroundColor: colors.surface,
              },
            ]}
          >
            <Ionicons
              name={
                order.payment_status === 'PAID'
                  ? 'checkmark-circle-outline'
                  : 'time-outline'
              }
              size={12}
              color={paymentStatusColor}
              style={{ marginRight: spacing.xs }}
            />
            <Text variant="xs" weight="medium" color={paymentStatusColor}>
              {paymentStatusLabel}
            </Text>
          </View>
          <View
            style={[
              orderCardStyles.paymentModeBadge,
              {
                borderColor: paymentModeColor,
                backgroundColor: `${paymentModeColor}15`,
              },
            ]}
          >
            <Ionicons
              name={
                order.payment_mode?.toUpperCase() === 'ONLINE'
                  ? 'card-outline'
                  : 'cash-outline'
              }
              size={12}
              color={paymentModeColor}
              style={{ marginRight: spacing.xs }}
            />
            <Text variant="xs" weight="medium" color={paymentModeColor}>
              {paymentModeLabel}
            </Text>
          </View>
        </View>
      </View>

      {!shouldHideActionsAndTracker && order.payment_status !== 'FAILED' && (
        <View style={orderCardStyles.trackerContainer}>
          <OrderTracker status={order.delivery_status} />
        </View>
      )}

      {isOutForDelivery && (
        <View style={orderCardStyles.otpContainer}>
          <Text variant="s" color={colors.textSecondary}>
            OTP for Delivery:
          </Text>
          <Text
            variant="l"
            weight="bold"
            color={colors.primary}
            style={orderCardStyles.otpText}
          >
            {order.delivery_otp}
          </Text>
        </View>
      )}

      {canConfirmDelivery && (
        <TouchableOpacity
          style={orderCardStyles.confirmDeliveryButton}
          onPress={handleConfirmDelivery}
          disabled={confirmDeliveryMutation.isPending}
        >
          <Ionicons name="checkmark-circle" size={18} color={colors.surface} />
          <Text variant="s" weight="semibold" color={colors.surface}>
            {confirmDeliveryMutation.isPending
              ? 'Confirming...'
              : 'Confirm Delivery'}
          </Text>
        </TouchableOpacity>
      )}

      {renderCancellationInfo()}

      {renderMenuModal()}

      <OrderCancelModal
        visible={isModalVisible}
        onClose={handleModalClose}
        onConfirm={handleConfirmCancel}
        loading={cancelOrderMutation.isPending}
        isCancelling={cancelOrderMutation.isPending}
      />

      <SupportModal
        visible={isSupportModalVisible}
        onClose={() => setIsSupportModalVisible(false)}
        orderNo={order.orderNo}
      />
    </Card>
  );
}

export default React.memo(OrderCardComponent);
