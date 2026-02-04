import { colors } from '@/core/theme/colors';
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
import { useCancelOrder } from '../hooks/useCancelOrder';
import { Order } from '../types';
import {
  calculateTotalQuantity,
  canCancelOrder,
  formatOrderDate,
  getPaymentStatusColor,
  getPaymentStatusLabel,
  getPrimaryProductName,
  getStatusColor,
  getStatusLabel,
} from '../utils/orderHelpers';
import OrderCardSkeleton from './OrderCardSkeleton';
import OrderModal from './sub-components/OrderModal';
import OrderTracker from './OrderTracker';
import SupportModal from './sub-components/SupportModal';

interface Props {
  order?: Order;
  loading?: boolean;
}

/**
 * OrderCard component displays a single order with collapsible item details
 * Optimized with React.memo to prevent unnecessary re-renders
 */
function OrderCardComponent({ order, loading }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isSupportModalVisible, setIsSupportModalVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const menuAnchorRef = useRef<View>(null);
  const cancelOrderMutation = useCancelOrder();

  // Memoized callbacks to prevent function recreation on each render
  const toggleExpanded = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded((prev) => !prev);
  }, []);

  const handleCancelPress = useCallback(() => {
    setIsMenuVisible(false);
    setIsModalVisible(true);
  }, []);

  const handleContactPress = useCallback(() => {
    setIsMenuVisible(false);
    setIsSupportModalVisible(true);
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
          top: y + height + 5,
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
            },
          },
        );
      }
    },
    [cancelOrderMutation, order],
  );

  // Early return for loading state
  if (loading || !order) {
    return <OrderCardSkeleton />;
  }

  // Memoized computed values
  const productName = useMemo(
    () => getPrimaryProductName(order.orderItems),
    [order.orderItems],
  );
  const totalQuantity = useMemo(
    () => calculateTotalQuantity(order.orderItems),
    [order.orderItems],
  );
  const canCancel = useMemo(
    () => canCancelOrder(order.delivery_status),
    [order.delivery_status],
  );
  const statusColor = useMemo(
    () => getStatusColor(order.delivery_status),
    [order.delivery_status],
  );
  const statusLabel = useMemo(
    () => getStatusLabel(order.delivery_status),
    [order.delivery_status],
  );
  const formattedDate = useMemo(
    () => formatOrderDate(order.created_at),
    [order.created_at],
  );
   const canShowActionsMenu = useMemo(
    () => canCancel && order.payment_status !== 'FAILED',
    [canCancel, order.payment_status],
  );
  const paymentStatusColor = useMemo(
    () => getPaymentStatusColor(order.payment_status),
    [order.payment_status],
  );
  const paymentStatusLabel = useMemo(
    () => getPaymentStatusLabel(order.payment_status),
    [order.payment_status],
  );

  return (
    <Card
      style={styles.card}
      accessible={true}
      accessibilityLabel={`Order ${order.orderNo}, status ${order.delivery_status}, total ${order.total_amount}`}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text
            variant="l"
            weight="bold"
            color={colors.textPrimary}
            style={styles.productName}
          >
            {productName}
            {order.orderItems.length > 1 &&
              ` + ${order.orderItems.length - 1} more`}
          </Text>
          <Text variant="s" color={colors.textTertiary} style={styles.orderNo}>
            Order #{order.orderNo}
          </Text>
        </View>

        <View style={styles.headerRightContainer}>
          <View
            style={[
              styles.statusBadge,
              { borderColor: statusColor, backgroundColor: colors.surface },
            ]}
          >
            <Ionicons
              name="time-outline"
              size={14}
              color={statusColor}
              style={{ marginRight: 4 }}
            />
            <Text variant="xs" weight="bold" color={statusColor}>
              {statusLabel}
            </Text>
          </View>
          <Text
            variant="xs"
            color={colors.textTertiary}
            style={styles.dateText}
          >
            {formattedDate}
          </Text>
        </View>

        {/* Menu Button */}
        {canShowActionsMenu && (
          <TouchableOpacity
            ref={menuAnchorRef}
            onPress={toggleMenu}
            style={styles.menuTrigger}
          >
            <Ionicons
              name="ellipsis-vertical"
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Details Section */}
      <View style={styles.detailsContainer}>
        {/* Address */}
        <View style={styles.detailRow}>
          <View style={[styles.iconBox, { backgroundColor: '#E0F2FE' }]}>
            <Ionicons
              name="location-outline"
              size={18}
              color={colors.primary}
            />
          </View>
          <Text
            variant="s"
            color={colors.textSecondary}
            style={styles.detailText}
            numberOfLines={1}
          >
            {order.address.address}, {order.address.pincode}
          </Text>
        </View>

        {/* Quantity (Collapsible Toggle) */}
        <TouchableOpacity
          style={styles.detailRow}
          onPress={toggleExpanded}
          activeOpacity={0.7}
        >
          <View style={[styles.iconBox, { backgroundColor: '#F3E8FF' }]}>
            <Ionicons name="cube-outline" size={18} color="#9333EA" />
          </View>
          <View style={styles.quantityRow}>
            <Text
              variant="s"
              color={colors.textSecondary}
              style={styles.detailText}
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

        {/* Collapsible Items List */}
        {isExpanded && (
          <View style={styles.itemsList}>
            {order.orderItems.map((item, index) => (
              <View key={item.id || index} style={styles.itemRow}>
                <Text
                  variant="xs"
                  color={colors.textPrimary}
                  style={styles.itemName}
                >
                  {item.product.name}
                </Text>
                <Text variant="xs" color={colors.textSecondary}>
                  {item.quantity} x ₹{item.price} ={' '}
                  <Text weight="medium">
                    ₹{item.quantity * Number(item.price)}
                  </Text>
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
      
     
      {/* Footer: Amount and Payment Status */}
      <View style={styles.footerContainer}>
        <View style={styles.amountRow}>
          <Text variant="m" color={colors.textSecondary}>
            Total Amount
          </Text>
          <Text variant="l" weight="bold" color={colors.primary}>
            ₹{order.total_amount}
          </Text>
        </View>
        <View style={styles.paymentStatusContainer}>
          <Text variant="xs" color={colors.textTertiary} style={styles.paymentLabel}>
            Payment:
          </Text>
          <View
            style={[
              styles.paymentStatusBadge,
              { borderColor: paymentStatusColor, backgroundColor: colors.surface },
            ]}
          >
            <Ionicons
              name={order.payment_status === 'PAID' ? 'checkmark-circle-outline' : 'time-outline'}
              size={12}
              color={paymentStatusColor}
              style={{ marginRight: 3 }}
            />
            <Text variant="xs" weight="medium" color={paymentStatusColor}>
              {paymentStatusLabel}
            </Text>
          </View>
        </View>
      </View>
     
      {/* Tracker */}
      {order.payment_status !== "FAILED" && (
        <View style={styles.trackerContainer}>
          <OrderTracker status={order.delivery_status} />
        </View>
      )}
      {/* OTP Segment */}
      {order.delivery_status === 'OUT_FOR_DELIVERY' && (
        <View style={styles.otpContainer}>
          <Text variant="s" color={colors.textSecondary}>
            OTP for Delivery:
          </Text>
          <Text
            variant="l"
            weight="bold"
            color={colors.primary}
            style={styles.otpText}
          >
            {order.delivery_otp}
          </Text>
        </View>
      )}

      {/* Modals */}
      <Modal
        visible={isMenuVisible}
        transparent
        animationType="none"
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsMenuVisible(false)}>
          <View style={styles.modalBackdrop}>
            <View
              style={[
                styles.menuOverlay,
                {
                  top: menuPosition.top,
                  right: menuPosition.right,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.menuItem}
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
                  style={styles.menuItemText}
                >
                  Cancel Order
                </Text>
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity
                style={styles.menuItem}
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
                  style={styles.menuItemText}
                >
                  Contact Support
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <OrderModal
        visible={isModalVisible}
        onClose={handleModalClose}
        onConfirm={handleConfirmCancel}
      />

      <SupportModal
        visible={isSupportModalVisible}
        onClose={() => setIsSupportModalVisible(false)}
        orderNo={order.orderNo}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.m,
    padding: spacing.s,
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.l,
    borderWidth: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.s,
  },
  headerTitleContainer: {
    flex: 1,
    marginRight: spacing.s,
  },
  productName: {
    fontSize: 16,
    marginBottom: 4,
  },
  orderNo: {
    fontSize: 12,
  },
  headerRightContainer: {
    alignItems: 'flex-end',
  },
  dateText: {
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.s,
    paddingVertical: 2,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: '#FFFBEB',
  },
  menuTrigger: {
    padding: 4,
    marginLeft: spacing.xs,
    marginTop: -4,
  },
  detailsContainer: {
    backgroundColor: colors.background,
    borderRadius: spacing.radius.m,
    padding: spacing.s,
    paddingVertical: spacing.s,
    marginBottom: spacing.s,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.s,
  },
  detailText: {
    flex: 1,
    fontSize: 13,
  },
  quantityRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemsList: {
    marginTop: spacing.s,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.s,
    paddingLeft: 28 + spacing.s,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemName: {
    flex: 1,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.s,
    paddingHorizontal: spacing.xs,
  },
  footerContainer: {
    marginBottom: spacing.s,
  },
  paymentStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  paymentLabel: {
    marginRight: spacing.xs,
  },
  paymentStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.s,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
  },
  trackerContainer: {
    backgroundColor: '#FAFAFA',
    borderRadius: spacing.radius.m,
    padding: spacing.s,
  },
  otpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.s,
    padding: spacing.s,
    backgroundColor: '#EFF6FF',
    borderRadius: spacing.radius.m,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  otpText: {
    marginLeft: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  menuOverlay: {
    position: 'absolute',
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.m,
    padding: spacing.s,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 160,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.s,
  },
  menuItemText: {
    marginLeft: spacing.s,
    fontWeight: '500',
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.s,
  },
});

// Memoize the component to prevent unnecessary re-renders
// Only re-render when order or loading props change
export default React.memo(OrderCardComponent);
