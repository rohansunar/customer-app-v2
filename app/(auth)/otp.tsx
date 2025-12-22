import { useVerifyOtp } from '@/features/auth/hooks/useVerifyOtp';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';

export default function OtpScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [otp, setOtp] = useState('');
  const { mutate, isPending } = useVerifyOtp();

  if (!phone) {
    Alert.alert('Error', 'Phone number not provided.');
    router.back();
    return null;
  }

  function handleVerifyOtp() {
    if (!otp || otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a valid 6-digit OTP.');
      return;
    }

    mutate(
      { phone, otp },
      {
        onSuccess: () => {
          router.replace('/home');
        },
        onError: () => {
          Alert.alert('Error', 'Invalid OTP. Please try again.');
        },
      }
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Enter OTP sent to {phone}</Text>

      <TextInput
        placeholder="123456"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        maxLength={6}
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />

      <Button
        title={isPending ? 'Verifying...' : 'Verify OTP'}
        onPress={handleVerifyOtp}
        disabled={isPending}
      />
    </View>
  );
}