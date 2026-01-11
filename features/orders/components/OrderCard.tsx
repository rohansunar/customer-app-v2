import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Order, OrderStatus } from '../types';

interface Props {
  order: Order;
  onPress: () => void;
}

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case 'PENDING':
      return '#FFF3CD';
    case 'CONFIRMED':
      return '#E6F4EA';
    case 'OUT_FOR_DELIVERY':
      return '#D1ECF1';
    case 'DELIVERED':
      return '#D4EDDA';
    case 'CANCELLED':
      return '#F8D7DA';
    default:
      return '#F0F0F0';
  }
};

export default function OrderCard({ order, onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
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

        <Text style={styles.price}>Amount: ₹ {order.total_amount}</Text>

        {/* Status Badge */}
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(order.status) },
          ]}
        >
          <Text style={styles.statusText}>{order.status}</Text>
        </View>

        {/* Assign Rider */}
        <View>
          <Text style={styles.name}>
            Rider Assign: {order.assigned_rider_phone}
          </Text>
        </View>

        {/* Additional Details */}
        {/* <Text style={styles.detail}>Items: {order.cart.cartItems.length}</Text> */}
        <Text style={styles.detail}>
          {order.address.address} • {order.address.pincode}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  price: {
    marginTop: 4,
    fontSize: 14,
    color: '#555',
  },
  statusBadge: {
    marginTop: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  detail: {
    marginTop: 2,
    fontSize: 12,
    color: '#666',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  dateTimeContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});
