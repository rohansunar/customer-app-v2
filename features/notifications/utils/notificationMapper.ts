/**
 * Notification Mapper Module
 *
 * Handles validation and parsing of notification payloads.
 *
 * Following SOLID/KISS principles:
 * - Single Responsibility: Handles parsing and validation.
 * - KISS: Simple implementation with minimal complexity.
 */

import { NotificationType } from '../types';

/**
 * Base structure for notification data from backend
 */
export interface NotificationPayload {
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

/**
 * Valid notification types for validation
 */
const VALID_TYPES: Set<NotificationType> = new Set([
  'order_confirmed',
  'order_processing',
  'order_out_for_delivery',
  'order_delivered',
  'order_cancelled',
]);

export class NotificationMapper {
  /**
   * Validates if a string is a valid notification type
   */
  isValidNotificationType(type: string): type is NotificationType {
    return VALID_TYPES.has(type as NotificationType);
  }

  /**
   * Parses a raw notification payload
   */
  parsePayload(payload: any): NotificationPayload | null {
    if (!payload || typeof payload.type !== 'string') return null;

    if (this.isValidNotificationType(payload.type)) {
      return {
        type: payload.type,
        title: payload.title || '',
        body: payload.body || '',
        data: payload.data || {},
      };
    }

    return null;
  }
}

/**
 * Singleton instance of NotificationMapper
 */
export const notificationMapper = new NotificationMapper();

/**
 * Safely extracts notification type from raw notification data
 */
export function extractNotificationType(
  data: Record<string, unknown>,
): NotificationType | null {
  const type = data?.type;
  if (typeof type !== 'string') return null;
  return notificationMapper.isValidNotificationType(type) ? type : null;
}
