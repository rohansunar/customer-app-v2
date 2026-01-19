import { OTP_LENGTH, useOtpInput } from '@/features/auth/hooks/handleOtpInputs';
import { useOtpTimer } from '@/features/auth/components/resendTimer';
import { useOtpShake } from '@/features/auth/components/useAnimations';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { Button } from '@/core/ui/Button';
import { Text } from '@/core/ui/Text';
import { useRequestOtp } from '@/features/auth/hooks/useRequestOtp';
import { useVerifyOtp } from '@/features/auth/hooks/useVerifyOtp';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function OtpScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [hasError, setHasError] = useState(false);
  const { otpDigits, inputRefs, handleChange, handleBackspace, clearOtp } =
    useOtpInput(() => setHasError(false));

  const { timer, resetTimer } = useOtpTimer(true);
  const { shake, animatedStyle } = useOtpShake();
  const { mutate, isPending } = useVerifyOtp();
  const { mutate: requestOtp, isPending: isResending } = useRequestOtp();

  if (!phone) {
    Alert.alert('Error', 'Phone number not provided.');
    router.back();
    return null;
  }
  const handleVerifyOtp = () => {
    const otp = otpDigits.join('');

    if (otp.length !== OTP_LENGTH) {
      setHasError(true);
      shake();
      return;
    }

    setHasError(false);

    mutate(
      { phone, otp },
      {
        onSuccess: () => {
          setHasError(false);
          router.replace('/(drawer)/home' as any);
        },
        onError: () => {
          setHasError(true);
          shake();
          clearOtp();
        },
      },
    );
  };

  const handleResend = () => {
    if (timer > 0 || isResending) return;

    requestOtp(phone, {
      onSuccess: () => {
        resetTimer();
        clearOtp();
        Alert.alert('OTP Sent', 'A new OTP has been sent to your phone.');
      },
      onError: () => {
        Alert.alert('Error', 'Failed to resend OTP. Please try again.');
      },
    });
  };

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

      <Animated.View style={[styles.inputContainer, animatedStyle]}>
        {otpDigits.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              if (ref) inputRefs.current[index] = ref;
            }}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={({ nativeEvent }) =>
              handleBackspace(nativeEvent.key, digit, index)
            }
            keyboardType="number-pad"
            maxLength={1}
            style={[styles.otpInput, hasError && styles.otpInputError]}
            autoFocus={index === 0}
          />
        ))}
      </Animated.View>

      <View style={styles.resendContainer}>
        {timer > 0 ? (
          <Text style={styles.timer}>Resend OTP in {timer}s</Text>
        ) : (
          <TouchableOpacity onPress={handleResend} disabled={isResending}>
            <Text style={[styles.resendText, isResending && { opacity: 0.6 }]}>
              {isResending ? 'Resending...' : 'Resend OTP'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Button
        title={isPending ? 'Verifying...' : 'Verify'}
        onPress={handleVerifyOtp}
        loading={isPending}
        disabled={isPending || isResending}
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
  resendContainer: {
    alignItems: 'center',
    marginTop: spacing.m,
    paddingVertical: spacing.s,
  },

  timer: {
    color: colors.textSecondary,
    fontSize: typography.size.s,
    letterSpacing: 0.3,
  },

  resendText: {
    color: colors.primary,
    fontSize: typography.size.s,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  otpInputError: {
    borderColor: '#EF4444', // red-500
    backgroundColor: '#FEF2F2', // light red tint
  },
});
