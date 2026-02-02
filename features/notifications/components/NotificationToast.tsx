import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';

export function NotificationToast() {
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const router = useRouter();

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (receivedNotification) => {
        setNotification(receivedNotification);
      },
    );

    return () => subscription.remove();
  }, []);

  if (!notification) return null;

  const handlePress = () => {
    setNotification(null);
    // Navigate based on notification data
    const { data } = notification.request.content;
    if (data?.orderId) {
      router.push({
        pathname: '/home/orders',
      });
    }
  };

  const handleDismiss = () => {
    setNotification(null);
  };

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <View style={styles.content}>
        <Text style={styles.title}>{notification.request.content.title}</Text>
        <Text style={styles.body}>{notification.request.content.body}</Text>
      </View>
      <Pressable onPress={handleDismiss} style={styles.closeButton}>
        <Text style={styles.closeText}>✕</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  content: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 4,
  },
  body: {
    color: '#ccc',
    fontSize: 12,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
  closeText: {
    color: '#888',
    fontSize: 16,
  },
});
