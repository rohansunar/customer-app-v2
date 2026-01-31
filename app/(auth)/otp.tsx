import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { Button } from '@/core/ui/Button';
import { Text } from '@/core/ui/Text';
import { useToastHelpers } from '@/core/utils/toastHelpers';

import { AddressPickerModal } from '@/features/address/components/AddressPickerModal';
import { useAddresses } from '@/features/address/hooks/useAddresses';

import { useOtpTimer } from '@/features/auth/components/resendTimer';
import { useOtpShake } from '@/features/auth/components/useAnimations';
import { OTP_LENGTH, useOtpInput } from '@/features/auth/hooks/handleOtpInputs';
import { useRequestOtp } from '@/features/auth/hooks/useRequestOtp';
import { useVerifyOtp } from '@/features/auth/hooks/useVerifyOtp';

import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
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
  const showToast = useToastHelpers();

  /* -------------------- Local state -------------------- */
  const [hasError, setHasError] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  /* -------------------- OTP logic -------------------- */
  const { otpDigits, inputRefs, handleChange, handleBackspace, clearOtp } =
    useOtpInput(() => setHasError(false));

  const { shake, animatedStyle } = useOtpShake();
  const { timer, resetTimer } = useOtpTimer(true);

  /* -------------------- API hooks -------------------- */
  const { mutate: verifyOtp, isPending } = useVerifyOtp();
  const { mutate: requestOtp, isPending: isResending } = useRequestOtp();
  const { data: addresses, isLoading: addressesLoading } = useAddresses();

  /* Safe guard effect */
  useEffect(() => {
    if (!phone) {
      showToast.error('Phone number not provided.');
      router.back();
    }
  }, [phone, showToast]);

  /* Post-OTP navigation effect */
  useEffect(() => {
    if (!otpVerified || addressesLoading) return;

    if (!addresses || addresses.length === 0) {
      setShowAddressModal(true);
    } else {
      router.replace('/(drawer)/home');
    }
  }, [otpVerified, addresses, addressesLoading]);

  /* Handle OTP verification */
  const handleVerifyOtp = () => {
    const otp = otpDigits.join('');

    if (otp.length !== OTP_LENGTH) {
      setHasError(true);
      showToast.error('Please Enter 6 digits OTP');
      shake();
      return;
    }

    verifyOtp(
      { phone, otp },
      {
        onSuccess: () => {
          setOtpVerified(true);
        },
        onError: () => {
          setHasError(true);
          shake();
          showToast.error('Please Enter Correct OTP');
          clearOtp();
        },
      },
    );
  };

  /* Handle OTP resend */
  const handleResend = () => {
    if (timer > 0 || isResending) return;

    requestOtp(phone, {
      onSuccess: () => {
        resetTimer();
        clearOtp();
        showToast.success('A new OTP has been sent.');
      },
      onError: () => {
        showToast.error('Failed to resend OTP.');
      },
    });
  };

  /* Render UI */
  return (
    <>
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

        {/* OTP inputs */}
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
              accessibilityLabel={`OTP digit ${index + 1}`}
            />
          ))}
        </Animated.View>

        {/* Resend */}
        <View style={styles.resendContainer}>
          {timer > 0 ? (
            <Text style={styles.timer}>Resend OTP in {timer}s</Text>
          ) : (
            <TouchableOpacity onPress={handleResend} disabled={isResending}>
              <Text
                style={[styles.resendText, isResending && { opacity: 0.6 }]}
              >
                {isResending ? 'Resending...' : 'Resend OTP'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Verify button */}
        <Button
          title={isPending ? 'Verifying...' : 'Verify'}
          onPress={handleVerifyOtp}
          loading={isPending}
          disabled={isPending || isResending}
          style={styles.button}
        />
      </KeyboardAvoidingView>

      {/* Full-screen Address flow */}
      <AddressPickerModal
        isVisible={showAddressModal}
        onClose={() => {
          setShowAddressModal(false);
          router.replace('/(drawer)/home');
        }}
      />
    </>
  );
}

/* Styles */
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
  otpInputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: spacing.m,
    paddingVertical: spacing.s,
  },
  timer: {
    color: colors.textSecondary,
    fontSize: typography.size.s,
  },
  resendText: {
    color: colors.primary,
    fontSize: typography.size.s,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  button: {
    marginTop: spacing.s,
  },
});
