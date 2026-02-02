import { useState, useCallback, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { notificationService } from '../services/notificationService';

export interface UsePushTokenOptions {
  onRegister?: (token: string) => void;
  onError?: (error: Error) => void;
}

export interface UsePushNotificationsProps {
  isAuthenticated: boolean;
}

export function usePushNotifications(
  { isAuthenticated }: UsePushNotificationsProps,
  options: UsePushTokenOptions = {},
) {
  const { onRegister, onError } = options;
  const [pushToken, setPushToken] = useState<string | null>(null);
  const registeredTokenRef = useRef<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegistrationError = useCallback(
    (err: unknown) => {
      const errorObj =
        err instanceof Error ? err : new Error('Failed to register token');
      setError(errorObj);
      if (onError) {
        onError(errorObj);
      }
    },
    [onError],
  );

  const handleTokenRegistration = useCallback(
    async (token: string) => {
      // Prevent redundant registration if token hasn't changed
      if (registeredTokenRef.current === token) {
        console.log(
          '[usePushNotifications] Token already registered, skipping API call',
        );
        return;
      }

      try {
        setIsLoading(true);
        console.log(
          '[usePushNotifications] Registering native push token with API...',
        );

        const payload = {
          deviceToken: token,
          deviceType: Platform.OS.toLocaleUpperCase() as 'ANDROID' | 'IOS',
          deviceId: Device.osBuildId || 'unknown',
          deviceName: Device.deviceName || 'unknown',
        };

        await notificationService.registerPushToken(payload);

        registeredTokenRef.current = token;
        setPushToken(token);

        if (onRegister) {
          onRegister(token);
        }
      } catch (err) {
        console.error(
          '[usePushNotifications] handleTokenRegistration error:',
          err,
        );
        handleRegistrationError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [onRegister, handleRegistrationError],
  );

  // Listen for token refresh and save immediately
  useEffect(() => {
    const subscription = Notifications.addPushTokenListener(async (event) => {
      // Ensure we're getting the string token properly
      const tokenData = event.data;
      let newToken: string;

      if (typeof tokenData === 'string') {
        newToken = tokenData;
      } else if (Array.isArray(tokenData)) {
        // Handle array response (legacy SDK behavior)
        newToken = tokenData[0] || '';
      } else if (tokenData && typeof tokenData === 'object') {
        // Handle object response with token property
        newToken = (tokenData as { token?: string }).token || '';
      } else {
        newToken = String(tokenData || '');
      }

      if (newToken) {
        await handleTokenRegistration(newToken);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [handleTokenRegistration]);

  const getToken = useCallback(async () => {
    // console.log('[usePushNotifications] getToken called');
    try {
      setIsLoading(true);
      setError(null);

      if (!Device.isDevice) {
        throw new Error('Push notifications require a physical device');
      }

      const devicePushTokenResponse =
        await Notifications.getDevicePushTokenAsync();

      // Properly extract the token string
      let token: string;
      const responseData = devicePushTokenResponse.data;

      if (typeof responseData === 'string') {
        token = responseData;
      } else if (responseData && typeof responseData === 'object') {
        // Handle object response with token property (standard for getDevicePushTokenAsync)
        token = (responseData as any).token || String(responseData);
      } else {
        token = String(responseData || '');
      }

      // Validate token is present
      if (!token || token === 'undefined' || token === 'null') {
        throw new Error('Invalid push token received: token is empty');
      }

      await handleTokenRegistration(token);
      return token;
    } catch (err) {
      const errorObj =
        err instanceof Error
          ? err
          : new Error('Failed to get device push token');
      setError(errorObj);
      if (onError) {
        onError(errorObj);
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleTokenRegistration, onError]);

  return {
    pushToken,
    error,
    isLoading,
    getToken,
    registerToken: handleTokenRegistration,
  };
}
