import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { Button } from '@/core/ui/Button';
import { Text } from '@/core/ui/Text';
import { useVerifyOtp } from '@/features/auth/hooks/useVerifyOtp';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text variant="xl" weight="bold" color={colors.primary} centered>
          Enter Verification Code
        </Text>
        <Text
          variant="s"
          color={colors.textSecondary}
          centered
          style={styles.subtitle}
        >
          We sent a code to {phone}
        </Text>
      </View>

      <View style={styles.inputContainer}>
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
            style={styles.otpInput}
            autoFocus={index === 0}
          />
        ))}
      </View>

      <Button
        title={isPending ? 'Verifying...' : 'Verify'}
        onPress={handleVerifyOtp}
        loading={isPending}
        style={styles.button}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.l,
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  header: {
    marginBottom: spacing.xl,
  },
  subtitle: {
    marginTop: spacing.s,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    gap: spacing.s,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.radius.m,
    textAlign: 'center',
    fontSize: typography.size.l,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    elevation: 1,
  },
  button: {
    marginTop: spacing.s,
  },
});
