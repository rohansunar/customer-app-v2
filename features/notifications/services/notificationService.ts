import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import { PushToken } from '../types';

/**
 * Payload required to register a push token with our backend.
 */
export interface RegisterTokenPayload {
  deviceToken: string;
  deviceType: 'ANDROID' | 'IOS';
  deviceId: string;
  deviceName: string;
}

/**
 * NotificationApiService handles communication with the backend for push notification registration.
 * It follows the Singleton pattern to ensure a single entry point for API calls.
 */
class NotificationApiService {
  /**
   * Registers a device push token with the backend.
   * This is necessary for the server to know where to send push notifications.
   *
   * @param payload - The device information including the token.
   * @returns A promise that resolves to the registration result.
   */
  async registerPushToken(payload: RegisterTokenPayload): Promise<PushToken> {
    try {
      const response = await apiClient.post<PushToken>(
        API_ENDPOINTS.NOTIFICATION_REGISTER,
        payload,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

// Export a singleton instance
export const notificationService = new NotificationApiService();
