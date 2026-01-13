import { Text, View } from 'react-native';

interface OrderHeaderProps {
  orderNo: string;
  createdAt: string;
}

export default function OrderHeader({ orderNo, createdAt }: OrderHeaderProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString();
  const formattedTime = new Date(createdAt).toLocaleTimeString();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 6,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: '600',
          color: '#111',
          fontFamily: 'Inter',
        }}
        numberOfLines={1}
      >
        OrderID: #{orderNo}
      </Text>
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'flex-end',
        }}
      >
        <Text
          style={{
            fontSize: 12,
            color: '#666',
            fontFamily: 'Inter',
          }}
        >
          {formattedDate}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: '#666',
            marginTop: 2,
            fontFamily: 'Inter',
          }}
        >
          {formattedTime}
        </Text>
      </View>
    </View>
  );
}
