import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
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
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OtpScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const showToast = useToastHelpers();

  /* -------------------- Local state -------------------- */
  const [hasError, setHasError] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(0);

  /* -------------------- OTP logic -------------------- */
  const { otpDigits, inputRefs, handleChange, handleBackspace, clearOtp } =
    useOtpInput(() => setHasError(false));
  const isOtpComplete = otpDigits.every((digit) => digit.length === 1);

  const { shake, animatedStyle } = useOtpShake();
  const { timer, resetTimer } = useOtpTimer(true);
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(20)).current;

  /* -------------------- API hooks -------------------- */
  const { mutate: verifyOtp, isPending } = useVerifyOtp();
  const { mutate: requestOtp, isPending: isResending } = useRequestOtp();
  const { data: addresses, isLoading: addressesLoading } = useAddresses();
  const isVerifyDisabled = !isOtpComplete || isPending || isResending;

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

  useEffect(() => {
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateY, {
        toValue: 0,
        duration: 450,
        useNativeDriver: true,
      }),
    ]).start();
  }, [contentOpacity, contentTranslateY]);

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
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={20} color={colors.splashGray500} />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          </View>

          <Animated.View
            style={[
              styles.content,
              {
                opacity: contentOpacity,
                transform: [{ translateY: contentTranslateY }],
              },
            ]}
          >
            <Text style={styles.title}>Verify OTP</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to{'\n'}
              <Text style={styles.phoneText}>+91 {phone}</Text>
            </Text>

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
                onFocus={() => setFocusedIndex(index)}
                onBlur={() =>
                  setFocusedIndex((prev) => (prev === index ? null : prev))
                }
                cursorColor="#2563EB"
                selectionColor="#2563EB"
                style={[
                  styles.otpInput,
                  !hasError && !!digit && styles.otpInputFilled,
                  !hasError && focusedIndex === index && styles.otpInputFocused,
                  hasError && styles.otpInputError,
                ]}
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
                <Text style={[styles.resendText, isResending && { opacity: 0.6 }]}>
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
              disabled={isVerifyDisabled}
              style={[styles.button, isVerifyDisabled && styles.buttonDisabled]}
            />
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>

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
  safeArea: {
    flex: 1,
    backgroundColor: colors.splashWhite,
  },
  container: {
    flex: 1,
  },
  topBar: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  backText: {
    marginLeft: spacing.s,
    color: colors.splashGray500,
    fontSize: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.l,
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
  title: {
    fontSize: 30,
    color: colors.splashGray900,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  subtitle: {
    color: colors.splashGray500,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  phoneText: {
    color: colors.splashGray900,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.l,
    gap: spacing.s,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: spacing.radius.l,
    textAlign: 'center',
    fontSize: 20,
    color: colors.splashGray900,
    backgroundColor: colors.splashWhite,
  },
  otpInputFocused: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  otpInputFilled: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  otpInputError: {
    borderColor: colors.error,
    backgroundColor: '#FEF2F2',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  timer: {
    color: colors.splashGray500,
    fontSize: 15,
  },
  resendText: {
    color: '#2563EB',
    fontSize: 15,
  },
  button: {
    minHeight: 56,
    borderRadius: spacing.radius.l,
    backgroundColor: '#2563EB',
  },
  buttonDisabled: {
    backgroundColor: '#D1D5DB',
  },
});
