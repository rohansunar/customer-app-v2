import { useAlert } from '@/core/context/AlertContext';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Button } from '@/core/ui/Button';
import { Input } from '@/core/ui/Input';
import { Text } from '@/core/ui/Text';
import { useRequestOtp } from '@/features/auth/hooks/useRequestOtp';
import { usePhoneValidation } from '@/shared/hooks/usePhoneValidation';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

export default function LoginScreen() {
  const { phone, error, isValidPhone, onChange } = usePhoneValidation();
  const { mutate, isPending } = useRequestOtp();
  const { showError } = useAlert();

  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(20)).current;
  const errorOpacity = useRef(new Animated.Value(0)).current;
  const errorTranslateY = useRef(new Animated.Value(-5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(cardTranslateY, {
        toValue: 0,
        duration: 450,
        useNativeDriver: true,
      }),
    ]).start();
  }, [cardOpacity, cardTranslateY]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(errorOpacity, {
        toValue: error ? 1 : 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(errorTranslateY, {
        toValue: error ? 0 : -5,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [error, errorOpacity, errorTranslateY]);

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
      onError: (mutationError) => {
        console.log(mutationError.message);
        showError(
          'Error',
          'Failed to send OTP. Please check your connection and try again.',
          () => {
            handleRequestOtp();
          },
        );
      },
    });
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <LinearGradient
        colors={['#EFF6FF', colors.splashWhite]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.background}
      />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: cardOpacity,
            transform: [{ translateY: cardTranslateY }],
          },
        ]}
      >
        <View style={styles.logoSection}>
          <LinearGradient
            colors={[colors.splashBlue500, colors.splashBlue700]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoCircle}
          >
            <Ionicons name="water" size={40} color={colors.splashWhite} />
          </LinearGradient>

          <Text style={styles.title}>Welcome to AquaFlow</Text>
          <Text style={styles.subtitle}>Enter your mobile number to continue</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.fieldLabel}>Mobile Number</Text>
          <View style={styles.inputWrap}>
            <Text style={styles.countryCode}>+91</Text>
            <Input
              placeholder="Enter 10-digit number"
              value={phone}
              onChangeText={onChange}
              keyboardType="phone-pad"
              maxLength={10}
              autoFocus
              error={!!error}
              style={styles.phoneInput}
            />
          </View>

          <Animated.View
            style={[
              styles.errorWrap,
              { opacity: errorOpacity, transform: [{ translateY: errorTranslateY }] },
            ]}
          >
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </Animated.View>

          <Button
            title={isPending ? 'Sending OTP...' : 'Send OTP'}
            onPress={handleRequestOtp}
            loading={isPending}
            disabled={!isValidPhone || isPending}
            style={styles.button}
          />
        </View>

        <Text style={styles.footer}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.splashWhite,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.xxl,
    flex: 1,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    width: '100%',
    maxWidth: 420,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.m,
  },
  title: {
    fontSize: 30,
    color: colors.splashGray900,
    marginBottom: spacing.s,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.splashGray500,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 420,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#374151',
    marginBottom: spacing.s,
  },
  inputWrap: {
    position: 'relative',
    width: '100%',
  },
  countryCode: {
    position: 'absolute',
    left: spacing.m,
    top: 18,
    zIndex: 2,
    color: colors.splashGray500,
    fontSize: 16,
  },
  phoneInput: {
    paddingLeft: 52,
    minHeight: 56,
    fontSize: 18,
    borderRadius: spacing.radius.l,
  },
  errorWrap: {
    minHeight: 22,
    justifyContent: 'center',
  },
  errorText: {
    color: colors.error,
    marginTop: 4,
    fontSize: 13,
  },
  button: {
    marginTop: spacing.s,
    minHeight: 56,
    borderRadius: spacing.radius.l,
    backgroundColor: '#2563EB',
  },
  footer: {
    marginTop: spacing.s,
    textAlign: 'center',
    color: colors.splashGray500,
    fontSize: 12,
    maxWidth: 420,
  },
});
