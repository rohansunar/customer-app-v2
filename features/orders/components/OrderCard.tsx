import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Card } from '@/core/ui/Card';
import { Text } from '@/core/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useCancelOrder } from '../hooks/useCancelOrder';
import { Order } from '../types';
import OrderCardSkeleton from './OrderCardSkeleton';
import OrderHeader from './sub-components/OrderHeader';
import OrderModal from './sub-components/OrderModal';
import OTPSegment from './sub-components/OTPSegment';
import StatusBadge from './sub-components/StatusBadge';
import SupportModal from './sub-components/SupportModal';

interface Props {
  order?: Order;
  loading?: boolean;
}

interface SectionProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  children: React.ReactNode;
}

const OrderSection = ({ icon, title, children }: SectionProps) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={16} color={colors.textSecondary} />
      <Text
        variant="s"
        weight="semibold"
        color={colors.textSecondary}
        style={styles.sectionTitle}
      >
        {title}
      </Text>
    </View>
    {children}
  </View>
);

function OrderCardComponent({ order, loading }: Props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isSupportModalVisible, setIsSupportModalVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const menuAnchorRef = useRef<View>(null);
  const cancelOrderMutation = useCancelOrder();

  const otp = useMemo(() => Math.floor(Math.random() * 9000) + 1000, []);

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
    >
      <View style={styles.headerRow}>
        <OrderHeader orderNo={order.orderNo} createdAt={order.created_at} />
      </View>

      {canCancel && (
        <View style={styles.menuAnchor}>
          <TouchableOpacity
            ref={menuAnchorRef}
            onPress={toggleMenu}
            style={styles.menuButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name="ellipsis-horizontal"
              size={18}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

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
        </View>
      )}

      <View style={styles.content}>
        <OrderSection icon="location-outline" title={`Delivery Address: ${order.address.label}`}>
          <Text
            variant="xs"
            color={colors.textTertiary}
            style={styles.addressText}
          >
            {order.address.address}, {order.address.pincode}
          </Text>
        </OrderSection>

        <OrderSection icon="list-outline" title="Items">
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
        </OrderSection>

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
      </View>

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
    padding: spacing.m,
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.l,
    borderWidth: 1,
    borderColor: colors.border,
    zIndex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 40, // Space for menu button
    zIndex: 10,
  },
  menuAnchor: {
    position: 'absolute',
    top: spacing.m,
    right: spacing.m,
    zIndex: 20,
  },
  menuButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
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
