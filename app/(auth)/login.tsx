import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Button } from '@/core/ui/Button';
import { Input } from '@/core/ui/Input';
import { Text } from '@/core/ui/Text';
import { useRequestOtp } from '@/features/auth/hooks/useRequestOtp';
import { isValidPhone } from '@/shared/utils/phoneValidator';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const { mutate, isPending } = useRequestOtp();

  function handleRequestOtp() {
    // Basic cleanup
    const cleanPhone = phone.trim();

    if (!isValidPhone(cleanPhone)) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number.');
      return;
    }

    mutate(cleanPhone, {
      onSuccess: () => {
        router.push({
          pathname: '/otp',
          params: { phone: cleanPhone },
        });
      },
      onError: (error) => {
        console.log(error);
        Alert.alert(
          'Error',
          'Failed to send OTP. Please check your connection and try again.',
        );
      },
    });
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="xl" weight="bold" color={colors.primary} centered>
            Welcome Back
          </Text>
          <Text variant="m" color={colors.textSecondary} centered style={styles.subtitle}>
            Enter your phone number to continue
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Phone Number"
            placeholder="9876543210"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            maxLength={10}
            autoFocus
          />

          <Button
            title={isPending ? 'Sending...' : 'Send OTP'}
            onPress={handleRequestOtp}
            loading={isPending}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.l,
  },
  header: {
    marginBottom: spacing.xl,
  },
  subtitle: {
    marginTop: spacing.s,
  },
  form: {
    backgroundColor: colors.surface,
    padding: spacing.l,
    borderRadius: spacing.radius.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  button: {
    marginTop: spacing.m,
  },
});
