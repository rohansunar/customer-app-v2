import { useState, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { NotificationPermissionStatus } from '../types';

interface UseNotificationPermissionProps {
  isAuthenticated: boolean;
}

export function useNotificationPermission({
  isAuthenticated,
}: UseNotificationPermissionProps) {
  const [permissionStatus, setPermissionStatus] =
    useState<NotificationPermissionStatus>({
      granted: false,
      provisional: false,
      expires: 'never',
    });

  const requestPermission = useCallback(async () => {
    console.log('[useNotificationPermission] requestPermission called');
    if (Platform.OS === 'web') return permissionStatus;

    const { status: existingStatus, canAskAgain } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      // console.log('[useNotificationPermission] Requesting permissions...');
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
      // console.log('[useNotificationPermission] New status:', finalStatus);
    }

    const isGranted = finalStatus === 'granted';

    const status: NotificationPermissionStatus = {
      granted: isGranted,
      provisional: finalStatus === 'undetermined',
      canAskAgain: canAskAgain,
      expires: isGranted ? 'never' : 'temporal',
    };

    setPermissionStatus(status);
    return status;
  }, []); // Removed permissionStatus dependency for stability

  const checkPermission = useCallback(async () => {
    // console.log('[useNotificationPermission] checkPermission called');
    if (Platform.OS === 'web') {
      return permissionStatus;
    }

    const { status, canAskAgain } = await Notifications.getPermissionsAsync();
    // console.log(
    //   '[useNotificationPermission] current status:',
    //   status,
    //   'canAskAgain:',
    //   canAskAgain,
    // );

    const statusObj: NotificationPermissionStatus = {
      granted: status === 'granted',
      provisional: status === 'undetermined',
      canAskAgain: canAskAgain,
      expires: status === 'granted' ? 'never' : 'temporal',
    };

    setPermissionStatus(statusObj);
    return statusObj;
  }, []); // Removed permissionStatus dependency for stability

  useEffect(() => {
    const checkPermissionOnMount = async () => {
      if (!isAuthenticated) return;

      try {
        if (Platform.OS === 'web') {
          return;
        }

        await checkPermission();
      } catch (err) {
        console.error('Failed to check notification permission on mount:', err);
      }
    };

    if (isAuthenticated) {
      checkPermissionOnMount();
    }
  }, [isAuthenticated, checkPermission]);

  return {
    permissionStatus,
    requestPermission,
    checkPermission,
  };
}
