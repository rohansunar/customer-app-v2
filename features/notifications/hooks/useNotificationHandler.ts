import { useEffect, useCallback } from 'react';
import { router, useFocusEffect } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { useQueryClient } from '@tanstack/react-query';

export function useNotificationHandler() {
  const queryClient = useQueryClient();

  const handleNotification = useCallback(
    async (response: Notifications.NotificationResponse) => {
      const { notification } = response;
      const data = notification.request.content.data as Record<string, unknown>;
      const notificationType = data?.type as string;

      console.log(
        '[useNotificationHandler] Handling notification:',
        notificationType,
      );

      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['orders'] });

      // Navigate to the order list (always to order list as per requirement)
      router.push('/(drawer)/home/orders');
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
