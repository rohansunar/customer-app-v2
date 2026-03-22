import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import { PushToken } from '../types';

/**
 * Payload required to register a push token with our backend.
 */
export interface RegisterTokenPayload {
  /** The unique device push token (native or Expo) */
  deviceToken: string;
  /** OS Platform */
  deviceType: 'ANDROID' | 'IOS';
  /** Unique hardware or build ID */
  deviceId: string;
  /** Human readable device name */
  deviceName: string;
}

/**
 * NotificationApiService
 *
 * Handles all backend communication related to push notifications.
 * Implemented as a singleton to centralize logic and state.
 */
class NotificationApiService {
  /**
   * Registers a device push token with the backend.
   * This allow the server to target this specific device for push notifications.
   *
   * @param payload - Comprehensive device and token information.
   * @returns The registered token details from the server.
   */
  async registerPushToken(payload: RegisterTokenPayload): Promise<PushToken> {
    try {
      const response = await apiClient.post<PushToken>(
        API_ENDPOINTS.NOTIFICATION_REGISTER,
        payload,
      );
      return response.data;
    } catch (error) {
      console.error('[NotificationApiService] Registration error:', error);
      throw error;
    }
  }
}

// Export a singleton instance for global use
export const notificationService = new NotificationApiService();
