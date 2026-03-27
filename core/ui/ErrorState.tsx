import React, { ReactNode, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Text } from './Text';
import { Button } from './Button';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useAuth } from '../providers/AuthProvider';

interface ErrorStateProps {
  error: any;
  onRetry?: () => void;
  title?: string;
  children?: ReactNode;
}

export function ErrorState({
  error,
  onRetry,
  title,
  children,
}: ErrorStateProps) {
  const { logout } = useAuth();
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 }),
      ),
      -1,
      true,
    );
  }, [scale]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isNetworkError =
    error?.message?.includes('network') ||
    error?.message?.includes('Network') ||
    error?.code === 'ERR_NETWORK' ||
    error?.message?.includes('timeout');

  const isServerError =
    error?.response?.status >= 500 ||
    error?.message?.includes('SERVICE_UNAVAILABLE') ||
    error?.message?.includes('503');

  const getMessage = () => {
    if (isNetworkError) {
      return {
        icon: 'wifi-outline' as const,
        title: title || 'Connection Issue',
        message: 'Please check your internet connection and try again.',
        showLogout: false,
      };
    }
    if (isServerError) {
      return {
        icon: 'server-outline' as const,
        title: title || 'Server Unavailable',
        message:
          'The service is temporarily unavailable. Please try again later. If the issue persists, kindly logout and login in again.',
        showLogout: true,
      };
    }
    return {
      icon: 'alert-circle-outline' as const,
      title: title || 'Something went wrong',
      message:
        typeof error === 'string'
          ? error
          : error?.message || 'An unexpected error occurred.',
      showLogout: false,
    };
  };

  const { icon, title: displayTitle, message, showLogout } = getMessage();

  return (
    <Animated.View
      entering={FadeInDown.duration(600).springify()}
      style={styles.container}
    >
      <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
        <Ionicons name={icon} size={64} color={colors.primary} />
      </Animated.View>

      <Text variant="xl" weight="bold" style={styles.title}>
        {displayTitle}
      </Text>

      <Text variant="m" color={colors.textSecondary} style={styles.message}>
        {message}
      </Text>

      <View style={styles.buttonContainer}>
        {onRetry && (
          <Button
            title="Try Again"
            onPress={onRetry}
            variant="primary"
            style={styles.button}
          />
        )}

        {showLogout && (
          <Button
            title="Logout"
            onPress={logout}
            variant="outline"
            style={styles.button}
          />
        )}

        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.s,
  },
  message: {
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.m,
    lineHeight: 22,
    opacity: 0.8,
  },
  buttonContainer: {
    width: '100%',
    gap: spacing.m,
  },
  button: {
    width: '100%',
  },
});
