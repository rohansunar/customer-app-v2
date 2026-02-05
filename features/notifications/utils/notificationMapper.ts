/**
 * Notification Mapper Module
 *
 * Handles mapping notification types to their corresponding payload structures,
 * routing logic, and delivery channels.
 *
 * Following SOLID principles:
 * - Single Responsibility: Handles mapping and validation for notifications.
 * - Open/Closed: Designed to be easily extendable if more order types are added.
 */

import { NotificationType, NotificationRoute } from '../types';

/**
 * Notification category for grouping. Limited to 'order' as per requirements.
 */
export type NotificationCategory = 'order';

/**
 * Priority levels for notifications
 */
export type NotificationPriority = 'high' | 'normal';

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
 * Structure for parsed notification data
 */
export interface ParsedNotification {
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  body: string;
  route: NotificationRoute | null;
  data: Record<string, unknown>;
  priority: NotificationPriority;
}

/**
 * Route configuration for a notification type
 */
interface RouteConfig {
  screen: string;
  paramsExtractor: (
    data: Record<string, unknown>,
  ) => Record<string, string | number | boolean | undefined>;
}

/**
 * Channel configuration for a notification type
 */
interface ChannelConfig {
  priority: NotificationPriority;
}

// ============================================================================
// Configuration Maps
// ============================================================================

const DEFAULT_ORDER_ROUTE: RouteConfig = {
  screen: '(drawer)/home/orders',
  paramsExtractor: (data) => ({
    orderId: data.orderId as string,
  }),
};

/**
 * Maps notification types to their route configurations
 */
const ROUTE_CONFIG_MAP: Record<NotificationType, RouteConfig> = {
  order_confirmed: DEFAULT_ORDER_ROUTE,
  order_processing: DEFAULT_ORDER_ROUTE,
  order_out_for_delivery: DEFAULT_ORDER_ROUTE,
  order_delivered: DEFAULT_ORDER_ROUTE,
  order_cancelled: DEFAULT_ORDER_ROUTE,
};

/**
 * Maps notification types to their delivery channel configurations
 */
const CHANNEL_CONFIG_MAP: Record<NotificationType, ChannelConfig> = {
  order_confirmed: { priority: 'high' },
  order_processing: { priority: 'high' },
  order_out_for_delivery: { priority: 'high' },
  order_delivered: { priority: 'normal' },
  order_cancelled: { priority: 'normal' },
};

// ============================================================================
// Mapper Class
// ============================================================================

export class NotificationMapper {
  /**
   * Maps a notification type and data to a navigation route
   */
  mapToRoute(
    type: NotificationType,
    data: Record<string, unknown>,
  ): NotificationRoute | null {
    const config = ROUTE_CONFIG_MAP[type];
    if (!config) return null;

    try {
      const params = config.paramsExtractor(data);
      const filteredParams: Record<string, string | number | boolean> = {};

      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          filteredParams[key] = value;
        }
      }

      return {
        screen: config.screen,
        params:
          Object.keys(filteredParams).length > 0 ? filteredParams : undefined,
      };
    } catch (error) {
      console.error('[NotificationMapper] Error extracting params:', error);
      return null;
    }
  }

  /**
   * Maps a notification payload to a parsed notification structure
   */
  mapToParsedNotification(payload: NotificationPayload): ParsedNotification {
    const { type, title, body, data = {} } = payload;
    const channelConfig = CHANNEL_CONFIG_MAP[type] || { priority: 'normal' };

    return {
      type,
      category: 'order',
      title,
      body,
      route: this.mapToRoute(type, data),
      data,
      priority: channelConfig.priority,
    };
  }

  /**
   * Validates if a string is a valid notification type
   */
  isValidNotificationType(type: string): type is NotificationType {
    return type in ROUTE_CONFIG_MAP;
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
