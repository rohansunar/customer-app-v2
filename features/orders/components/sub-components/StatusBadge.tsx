import { Text, View } from 'react-native';
import { OrderStatus } from '../../types';

interface StatusBadgeProps {
  status: OrderStatus;
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

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusStyle = getStatusStyle(status);

  return (
    <View
      style={{
        marginTop: 8,
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: statusStyle.backgroundColor,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: '500',
          fontFamily: 'Inter',
          color: statusStyle.color,
        }}
      >
        {status}
      </Text>
    </View>
  );
}
