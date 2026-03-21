import React, { createContext, useContext, useEffect, useCallback, useMemo } from 'react';
import { Alert, Linking } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useAuth } from '@/core/providers/AuthProvider';
import { useNotificationManager } from '../hooks/useNotificationManager';

// Configuration for foreground notification behavior (OS level)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldVibrate: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface NotificationContextProps {
  /** Whether notifications are enabled (granted) on the device */
  isEnabled: boolean;
  /** Whether a token registration or permission check is in progress */
  isLoading: boolean;
  /** The current push token (Expo push token or native device token) */
  token: string | null;
  /** Triggers a permission request with UI feedback if denied */
  requestPermission: () => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

/**
 * NotificationProvider
 * 
 * The single entry point for the global notification system.
 * Orchestrates permissions, token registration, and interaction handling
 * via the unified `useNotificationManager` hook.
 */
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  // Unified manager for all notification logic
  const {
    permissionStatus,
    pushToken,
    getToken,
    isLoading,
    requestPermission
  } = useNotificationManager({ isAuthenticated });

  const isEnabled = useMemo(() => permissionStatus.granted, [permissionStatus.granted]);

  /**
   * Automatically fetch/register token when permissions are granted and user is logged in.
   */
  useEffect(() => {
    if (isAuthenticated && isEnabled && !pushToken && !isLoading) {
      getToken();
    }
  }, [isAuthenticated, isEnabled, pushToken, isLoading, getToken]);

  /**
   * Enhanced permission request handler that provides visual feedback (Alerts)
   * if the user has permanently denied permissions.
   */
  const handleRequestPermission = useCallback(async () => {
    const status = await requestPermission();
    if (status.granted) {
      await getToken();
      return true;
    }

    // Logic for handled denied state (permanent rejection)
    if (!status.granted && status.canAskAgain === false) {
      Alert.alert(
        'Notifications Disabled',
        'Enable notifications in your phone settings to receive order and delivery updates.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
    }
    return false;
  }, [requestPermission, getToken]);

  const value = useMemo(() => ({
    isEnabled,
    isLoading,
    token: pushToken,
    requestPermission: handleRequestPermission,
  }), [isEnabled, isLoading, pushToken, handleRequestPermission]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

/**
 * Hook to access notification state and controls anywhere in the app.
 */
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
