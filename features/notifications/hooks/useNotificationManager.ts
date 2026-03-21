import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/Notification.service';
import { NotificationType, NotificationDataPayload, NotificationPermissionStatus } from '../types';
import { NOTIFICATION_NAVIGATION_MAP } from '../constants';

/**
 * Module-level state to track processed notifications across hook remounts.
 * This prevents duplicate processing of the same notification interaction.
 */
let globalLastProcessedId: string | null = null;
let isInitialCheckDone = false;

export interface UseNotificationManagerProps {
  isAuthenticated: boolean;
}

/**
 * useNotificationManager hook
 * 
 * A unified hook that manages the entire notification lifecycle:
 * 1. Permission management (check and request)
 * 2. Push token registration with the backend
 * 3. Interaction handling (links and navigation)
 * 4. Foreground event listening
 * 
 * @param props - includes authentication state
 */
export function useNotificationManager({ isAuthenticated }: UseNotificationManagerProps) {
  const queryClient = useQueryClient();
  
  // Permission State
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermissionStatus>({
    granted: false,
    provisional: false,
    expires: 'temporal',
  });

  // Token State
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const registeredTokenRef = useRef<string | null>(null);

  /**
   * Extracts a string token from various expo-notifications formats.
   */
  const extractToken = (data: any): string => {
    if (typeof data === 'string') return data;
    return data?.token || String(data || '');
  };

  /**
   * Updates permission status from the OS.
   * @param request - if true, will prompt the user for permission
   */
  const updatePermissionStatus = useCallback(async (request = false) => {
    if (Platform.OS === 'web') {
      return {
        granted: false,
        provisional: false,
        canAskAgain: true,
        expires: 'temporal',
      };
    }

    const { status, canAskAgain } = request 
      ? await Notifications.requestPermissionsAsync()
      : await Notifications.getPermissionsAsync();

    const isGranted = status === 'granted';
    const statusObj: NotificationPermissionStatus = {
      granted: isGranted,
      provisional: status === 'undetermined',
      canAskAgain,
      expires: isGranted ? 'never' : 'temporal',
    };

    setPermissionStatus(statusObj);
    return statusObj;
  }, []);

  /**
   * Registers a token with the backend service.
   */
  const registerToken = useCallback(
    async (token: string, force = false) => {
      if (!isAuthenticated || (!force && registeredTokenRef.current === token)) return;

      try {
        setIsLoading(true);
        await notificationService.registerPushToken({
          deviceToken: token,
          deviceType: Platform.OS.toUpperCase() as 'ANDROID' | 'IOS',
          deviceId: Device.osBuildId || 'unknown',
          deviceName: Device.deviceName || 'unknown',
        });
        registeredTokenRef.current = token;
        setPushToken(token);
        setError(null);
      } catch (err) {
        console.error('[useNotificationManager] Token registration failed:', err);
        setError(err instanceof Error ? err : new Error('Registration failed'));
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated],
  );

  /**
   * Fetches the device push token and registers it.
   */
  const getToken = useCallback(
    async (force = false) => {
      if (!Device.isDevice) {
        setError(new Error('Push notifications require a physical device'));
        return null;
      }

      try {
        setIsLoading(true);
        const { data } = await Notifications.getDevicePushTokenAsync();
        const token = extractToken(data);
        
        if (!token) throw new Error('Failed to extract push token');
        
        await registerToken(token, force);
        return token;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to get token'));
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [registerToken],
  );

  /**
   * Handles notification interactions (taps).
   */
  const handleNotificationInteraction = useCallback(
    async (response: Notifications.NotificationResponse) => {
      const { notification } = response;
      const identifier = notification.request.identifier;

      if (globalLastProcessedId === identifier) return;
      globalLastProcessedId = identifier;

      const data = notification.request.content.data as NotificationDataPayload;
      const notificationType = (data?.type as NotificationType) || 'generic';

      console.log(`[NotificationManager] Handled: ${notificationType} (${identifier})`);

      // Refresh relevant data
      if (notificationType === 'ORDER') {
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      } else if (notificationType === 'LOW_BALANCE') {
        queryClient.invalidateQueries({ queryKey: ['wallet', 'transactions'] });
      }

      // Navigate
      const getTarget = NOTIFICATION_NAVIGATION_MAP[notificationType] || NOTIFICATION_NAVIGATION_MAP.generic;
      const { route, params } = getTarget(data);

      if (params) {
        router.push({ pathname: route as any, params });
      } else {
        router.push(route as any);
      }
    },
    [queryClient],
  );

  // Sync token on auth change
  useEffect(() => {
    if (!isAuthenticated) {
      registeredTokenRef.current = null;
      setPushToken(null);
    } else {
      updatePermissionStatus();
    }
  }, [isAuthenticated, updatePermissionStatus]);

  // Event Listeners
  useEffect(() => {
    // 1. Listen for new tokens
    const tokenSub = Notifications.addPushTokenListener((event) => {
      const token = extractToken(event.data);
      if (token) registerToken(token);
    });

    // 2. Foreground notification listener
    const foregroundSub = Notifications.addNotificationReceivedListener(() => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    });

    // 3. Response (tap) listener
    const responseSub = Notifications.addNotificationResponseReceivedListener(handleNotificationInteraction);

    // 4. Check for cold start notification
    if (!isInitialCheckDone) {
      Notifications.getLastNotificationResponseAsync().then((response) => {
        if (response) handleNotificationInteraction(response);
      });
      isInitialCheckDone = true;
    }

    return () => {
      tokenSub.remove();
      foregroundSub.remove();
      responseSub.remove();
    };
  }, [registerToken, handleNotificationInteraction, queryClient]);

  const requestPermission = useCallback(() => updatePermissionStatus(true), [updatePermissionStatus]);
  const checkPermission = useCallback(() => updatePermissionStatus(false), [updatePermissionStatus]);

  return useMemo(() => ({
    permissionStatus,
    pushToken,
    isLoading,
    error,
    requestPermission,
    checkPermission,
    getToken,
  }), [permissionStatus, pushToken, isLoading, error, requestPermission, checkPermission, getToken]);
}
