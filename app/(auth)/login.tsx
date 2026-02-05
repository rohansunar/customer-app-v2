import { useAlert } from '@/core/context/AlertContext';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Button } from '@/core/ui/Button';
import { Input } from '@/core/ui/Input';
import { Text } from '@/core/ui/Text';
import { useRequestOtp } from '@/features/auth/hooks/useRequestOtp';
import { usePhoneValidation } from '@/shared/hooks/usePhoneValidation';
import { router } from 'expo-router';

import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

export default function LoginScreen() {
  const { phone, error, isValidPhone, onChange } = usePhoneValidation();
  const { mutate, isPending } = useRequestOtp();
  const { showError } = useAlert();
  function handleRequestOtp() {
    if (!isValidPhone) {
      return;
    }
    const cleanPhone = phone.trim();

    mutate(cleanPhone, {
      onSuccess: () => {
        router.push({
          pathname: '/otp',
          params: { phone: cleanPhone },
        });
      },
      onError: (error) => {
        console.log(error.message);
        showError(
          'Error',
          'Failed to send OTP. Please check your connection and try again.',
          () => {
            // Optional retry function
            handleRequestOtp();
          },
        );
      },
    });
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text variant="xl" weight="bold" color={colors.primary} centered>
          Welcome Back
        </Text>
        <Text
          variant="m"
          color={colors.textSecondary}
          centered
          style={styles.subtitle}
        >
          Enter your phone number to continue
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Phone Number"
          placeholder="9876543210"
          value={phone}
          onChangeText={onChange}
          keyboardType="phone-pad"
          maxLength={10}
          autoFocus
        />
        {error && <Text style={{ color: 'red', marginTop: 6 }}>{error}</Text>}
        <Button
          title={isPending ? 'Sending...' : 'Send OTP'}
          onPress={handleRequestOtp}
          loading={isPending}
          disabled={!isValidPhone || isPending}
          style={styles.button}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  header: {
    width: '100%',
    maxWidth: 400,
    marginBottom: spacing.xl,
    alignItems: 'center',
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
    width: '100%',
    maxWidth: 400,
  },
  button: {
    marginTop: spacing.m,
  },
});
