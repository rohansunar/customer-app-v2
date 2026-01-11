import { useOrder } from '@/features/orders/hooks/useOrder';
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!id) {
    return <Text style={{ padding: 16 }}>Invalid Order ID</Text>;
  }
  const { data, isLoading } = useOrder(id);

  if (isLoading || !data) return <Text>Loading...(Order)</Text>;

  if (!data) {
    return <Text>Order not found</Text>;
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>
        Order #{data.orderNo}
      </Text>

      <Text>Status: {data.status}</Text>
      <Text>Payment: {data.payment_status}</Text>

      <Text style={{ marginTop: 12, fontWeight: '500' }}>Delivery Address</Text>
      <Text>{data.address.address}</Text>

      <Text style={{ marginTop: 12, fontWeight: '500' }}>Items</Text>

      {data.cart.cartItems.map((item) => (
        <Text key={item.id}>
          {item.product.name} × {item.quantity}
        </Text>
      ))}
    </View>
  );
}
