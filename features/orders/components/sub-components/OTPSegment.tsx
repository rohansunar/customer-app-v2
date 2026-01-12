import { Text, View } from 'react-native';

interface OTPSegmentProps {
  otp: number;
}

export default function OTPSegment({ otp }: OTPSegmentProps) {
  return (
    <View style={{
      marginTop: 8,
      flexDirection: 'row',
      alignItems: 'center',
    }}>
      <Text style={{
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        fontFamily: 'Inter',
      }}>
        Delivery OTP:
      </Text>
      <Text style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007bff',
        marginLeft: 8,
        fontFamily: 'Inter',
      }}>
        {otp}
      </Text>
    </View>
  );
}