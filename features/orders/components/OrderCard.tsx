import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Order, OrderStatus } from '../types';

interface Props {
  order: Order;
  onPress: () => void;
}

const getStatusStyle = (status: OrderStatus) => {
  switch (status) {
    case 'PENDING':
      return { backgroundColor: '#FFF3CD', color: '#856404' };
    case 'CONFIRMED':
      return { backgroundColor: '#D4EDDA', color: '#155724' };
    case 'OUT_FOR_DELIVERY':
      return { backgroundColor: '#D1ECF1', color: '#0C5460' };
    case 'DELIVERED':
      return { backgroundColor: '#D4EDDA', color: '#155724' };
    case 'CANCELLED':
      return { backgroundColor: '#F8D7DA', color: '#721C24' };
    default:
      return { backgroundColor: '#F0F0F0', color: '#333' };
  }
};

export default function OrderCard({ order, onPress }: Props) {
  const otp = Math.floor(Math.random() * 9000) + 1000;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      accessible={true}
      accessibilityLabel={`Order ${order.orderNo}, status ${order.status}, total ${order.total_amount}`}
    >
      {/* Order Info */}
      <View style={styles.info}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>
            OrderID: #{order.orderNo}
          </Text>
          <View style={styles.dateTimeContainer}>
            <Text style={styles.dateText}>
              {new Date(order.created_at).toLocaleDateString()}
            </Text>
            <Text style={styles.timeText}>
              {new Date(order.created_at).toLocaleTimeString()}
            </Text>
          </View>
        </View>

        <Text style={styles.price}>Total Amount: ₹ {order.total_amount}</Text>

        {/* Status Badge */}
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusStyle(order.status).backgroundColor },
          ]}
        >
          <Text style={[styles.statusText, { color: getStatusStyle(order.status).color }]}>{order.status}</Text>
        </View>

        {/* Delivery OTP */}
        <View style={styles.otpContainer}>
          <Text style={styles.otpLabel}>Delivery OTP:</Text>
          <Text style={styles.otpValue}>{otp}</Text>
        </View>

        {/* Assign Rider */}
        {/* <View>
          <Text style={styles.name}>
            Rider Assign: {order.assigned_rider_phone}
          </Text>
        </View> */}

        {/* Additional Details */}
        {/* <Text style={styles.detail}>Items: {order.cart.cartItems.length}</Text> */}
        {/* <Text style={styles.detail}>
          {order.address.address} • {order.address.pincode}
        </Text> */}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  info: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    fontFamily: 'Inter',
  },
  price: {
    marginTop: 6,
    fontSize: 14,
    color: '#555',
    fontFamily: 'Inter',
  },
  statusBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  detail: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
    fontFamily: 'Inter',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  dateTimeContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Inter',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    fontFamily: 'Inter',
  },
  otpContainer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  otpLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    fontFamily: 'Inter',
  },
  otpValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
    marginLeft: 8,
    fontFamily: 'Inter',
  },
});
