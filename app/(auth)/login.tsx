import { useRequestOtp } from '@/features/auth/hooks/useRequestOtp';
import { isValidPhone } from '@/shared/utils/phoneValidator';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

/**
 * LoginScreen component for user authentication via phone number.
 * Allows users to enter their phone number and request an OTP.
 */
export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const { mutate, isPending } = useRequestOtp();

  /**
   * Handles the OTP request by validating and trimming the phone number,
   * then triggering the mutation to send OTP.
   */
  function handleRequestOtp() {
    const trimmedPhone = phone.trim();
    if (!isValidPhone(trimmedPhone)) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number.');
      return;
    }

    mutate(trimmedPhone, {
      onSuccess: () => {
        router.push({
          pathname: '/otp',
          params: { phone: trimmedPhone },
        });
      },
      onError: (error) => {
        console.error('OTP request failed:', error);
        Alert.alert('Error', 'Failed to send OTP. Please check your connection and try again.');
      },
    });
  }

  return (
    <View>
      <Text>Enter Phone Number</Text>

      <TextInput
        placeholder="+919876543210"
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        autoFocus={true}
        accessibilityLabel="Phone number input field"
        onSubmitEditing={handleRequestOtp}
      />

      <Button
        title={isPending ? 'Sending OTP...' : 'Send OTP'}
        onPress={handleRequestOtp}
        disabled={isPending}
        accessibilityLabel="Send OTP button"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input:{
    flex:1,
    backgroundColor:'#fff',
    alignItems:"center",
    justifyContent:"center"
  }
})