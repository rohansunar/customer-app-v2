import { useVerifyOtp } from '@/features/auth/hooks/useVerifyOtp';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';

export default function OtpScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<TextInput[]>([]);
  const { mutate, isPending } = useVerifyOtp();

  if (!phone) {
    Alert.alert('Error', 'Phone number not provided.');
    router.back();
    return null;
  }

  function handleVerifyOtp() {
    const otp = otpDigits.join('');
    if (!otp || otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a valid 6-digit OTP.');
      return;
    }

    mutate(
      { phone, otp },
      {
        onSuccess: () => {
          router.replace('/(drawer)/dashboard');
        },
        onError: () => {
          Alert.alert('Error', 'Invalid OTP. Please try again.');
        },
      },
    );
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 18, marginBottom: 20, textAlign: 'center' }}>
        Enter OTP sent to {phone}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: 30,
        }}
      >
        {otpDigits.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              if (ref) inputRefs.current[index] = ref;
            }}
            value={digit}
            onChangeText={(text) => {
              if (/^\d?$/.test(text)) {
                const newDigits = [...otpDigits];
                newDigits[index] = text;
                setOtpDigits(newDigits);
                if (text && index < 5) {
                  inputRefs.current[index + 1]?.focus();
                }
              }
            }}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace' && !digit && index > 0) {
                inputRefs.current[index - 1]?.focus();
              }
            }}
            keyboardType="numeric"
            maxLength={1}
            style={{
              width: 50,
              height: 50,
              borderWidth: 2,
              borderColor: '#ccc',
              borderRadius: 8,
              textAlign: 'center',
              fontSize: 24,
              marginHorizontal: 5,
              backgroundColor: '#f9f9f9',
            }}
            autoFocus={index === 0}
          />
        ))}
      </View>

      <Button
        title={isPending ? 'Verifying...' : 'Verify OTP'}
        onPress={handleVerifyOtp}
        disabled={isPending}
      />
    </View>
  );
}
