import { useEffect, useCallback } from 'react';
import { router, useFocusEffect } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { useQueryClient } from '@tanstack/react-query';
import { notificationMapper } from '../utils/notificationMapper';
import { NotificationType } from '../types';

export function useNotificationHandler() {
  const queryClient = useQueryClient();

  const handleNotification = useCallback(
    async (response: Notifications.NotificationResponse) => {
      const { notification } = response;
      const data = notification.request.content.data as Record<string, unknown>;
      const notificationType = data?.type as NotificationType;

      const mappedNotification = notificationMapper.mapToRoute(
        notificationType,
        data,
      );

      // Invalidate relevant queries to refresh data
      if (
        notificationType &&
        typeof notificationType === 'string' &&
        notificationType.startsWith('order')
      ) {
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      }

      // Navigate to the appropriate screen
      if (mappedNotification) {
        // Use router for more reliable navigation in expo-router
        router.push({
          pathname: mappedNotification.screen as any,
          params: mappedNotification.params,
        } as any);
      }
    },
    [queryClient],
  );

  useEffect(() => {
    // Handle notification when app is in foreground
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        // Show in-app banner/alert
        console.log('Notification received:', notification);
      },
    );

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    // Handle notification tap
    const subscription =
      Notifications.addNotificationResponseReceivedListener(handleNotification);

    return () => subscription.remove();
  }, [handleNotification]);

  // Handle initial notification when app was cold-started
  useFocusEffect(
    useCallback(() => {
      (async () => {
        const response = await Notifications.getLastNotificationResponseAsync();
        if (response) {
          handleNotification(response);
        }
      })();
    }, [handleNotification]),
  );
}
