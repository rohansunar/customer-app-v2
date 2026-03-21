import { useEffect, useCallback, useRef } from 'react';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { useQueryClient } from '@tanstack/react-query';

// Module-level variables to track processed notifications across hook remounts
// or multiple hook instances during the same application session.
let globalLastProcessedId: string | null = null;
let isInitialCheckDone = false;

export function useNotificationHandler() {
  const queryClient = useQueryClient();

  const handleNotification = useCallback(
    async (response: Notifications.NotificationResponse) => {
      const { notification } = response;
      const identifier = notification.request.identifier;

      // Prevent processing the same notification response multiple times
      // Use the global variable to survive hook remounts during navigation
      if (globalLastProcessedId === identifier) {
        return;
      }
      globalLastProcessedId = identifier;

      const data = notification.request.content.data as Record<string, unknown>;
      const notificationType = (data?.type as string) || 'generic';

      console.log(
        '[useNotificationHandler] Handling notification:',
        notificationType,
        `(ID: ${identifier})`,
      );

      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['orders'] });

      // Navigate to the order list
      router.push('/(drawer)/home/orders');
    },
    [queryClient],
  );

  useEffect(() => {
    // Handle notification when app is in foreground
    const subscription = Notifications.addNotificationReceivedListener(
      () => {
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      },
    );

    return () => subscription.remove();
  }, [queryClient]);

  useEffect(() => {
    // Handle notification tap (background or foreground)
    const subscription =
      Notifications.addNotificationResponseReceivedListener(handleNotification);

    // Also check for initial notification that opened the app (cold start)
    // ONLY check this once per application life cycle to prevent loops
    if (!isInitialCheckDone) {
      Notifications.getLastNotificationResponseAsync().then((response) => {
        if (response) {
          handleNotification(response);
        }
      });
      isInitialCheckDone = true;
    }

    return () => subscription.remove();
  }, [handleNotification]);
}

