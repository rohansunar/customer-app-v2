import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { Alert, Linking } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useAuth } from '../../../core/providers/AuthProvider';
import { useNotificationPermission } from '../hooks/useNotificationPermission';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { useNotificationHandler } from '../hooks/useNotificationHandler';

// Global configuration for how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldShowAlert: true,
    shouldVibrate: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface NotificationContextType {
  isEnabled: boolean;
  isLoading: boolean;
  token: string | null;
  requestPermission: () => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const { permissionStatus, requestPermission } = useNotificationPermission({
    isAuthenticated,
  });
  const { pushToken, getToken, isLoading, error } = usePushNotifications({
    isAuthenticated,
  });
  useNotificationHandler();

  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    setIsEnabled(permissionStatus.granted);
  }, [permissionStatus.granted]);

  /**
   * ROBUST TRIGGER: Automatic token fetching.
   * This ensures that as soon as notifications are enabled (e.g., after "First Allow")
   * and the user is authenticated, we fetch and register the push token.
   * We skip triggering if there's already an error to avoid infinite loops.
   */
  useEffect(() => {
    const triggerTokenFetch = async () => {
      if (isAuthenticated && isEnabled && !pushToken && !isLoading && !error) {
        await getToken();
      } else if (error) {
        console.warn(
          '[NotificationContext] Token fetch skipped due to error:',
          error,
        );
      }
    };

    triggerTokenFetch();
  }, [isAuthenticated, isEnabled, pushToken, isLoading, error, getToken]);

  /**
   * RE-REGISTRATION TRIGGER: Force registration on login.
   * This ensures that when a new user logs in on the same device,
   * we associate the device token with the new user ID on the backend.
   */
  useEffect(() => {
    if (isAuthenticated && isEnabled) {
      getToken(true);
    }
    // We only want to trigger this when isAuthenticated or isEnabled specifically changes to true
  }, [isAuthenticated, isEnabled, getToken]);

  /*
   * Stable request permission handler.
   */

  const handleRequestPermission = useCallback(async () => {
    const status = await requestPermission();

    if (status.granted) {
      await getToken();
      return true;
    }

    console.log('[NotificationContext] Permission not granted:', status);

    if (!status.granted && status.canAskAgain === false) {
      Alert.alert(
        'Notifications Disabled',
        'Enable notifications in your phone settings to receive order and delivery updates.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open Settings',
            onPress: () => Linking.openSettings(),
          },
        ],
      );
    }

    return false;
  }, [requestPermission, getToken]);

  return (
    <NotificationContext.Provider
      value={{
        isEnabled,
        isLoading,
        token: pushToken,
        requestPermission: handleRequestPermission,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotifications must be used inside NotificationProvider',
    );
  }
  return context;
}
