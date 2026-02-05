import { colors } from '@/core/theme/colors';
import { OrderItem, OrderStatus } from '../types';

/**
 * Utility functions for order-related operations
 * Following Single Responsibility Principle - each function does one thing
 */

/**
 * Formats a date string to a human-readable format
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "January 23, 2026")
 */
export function formatOrderDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Gets the color associated with an order status
 * @param status - Order status
 * @returns Color string from theme
 */
export function getStatusColor(status: OrderStatus): string {
  switch (status) {
    case 'DELIVERED':
      return colors.success;
    case 'CANCELLED':
      return colors.error;
    case 'PENDING':
    case 'CONFIRMED':
    case 'PROCESSING':
    case 'OUT_FOR_DELIVERY':
      return colors.warning;
    default:
      return colors.textSecondary;
  }
}

/**
 * Gets the human-readable label for an order status
 * @param status - Order status
 * @returns Display label for the status
 */
export function getStatusLabel(status: OrderStatus): string {
  switch (status) {
    case 'PENDING':
    case 'CONFIRMED':
    case 'PROCESSING':
      return 'Processing';
    case 'OUT_FOR_DELIVERY':
      return 'On the Way';
    case 'DELIVERED':
      return 'Delivered';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return status;
  }
}

/**
 * Gets the step index for the order tracker based on status
 * Used for progress visualization
 * @param status - Order status
 * @returns Step index (0: Processing, 1: On the Way, 2: Delivered, -1: Cancelled)
 */
export function getStepIndexForStatus(status: OrderStatus): number {
  switch (status) {
    case 'DELIVERED':
      return 2;
    case 'OUT_FOR_DELIVERY':
      return 1;
    case 'CANCELLED':
      return -1;
    case 'PENDING':
    case 'CONFIRMED':
    case 'PROCESSING':
    default:
      return 0;
  }
}

/**
 * Calculates the total quantity of items in an order
 * @param orderItems - Array of order items
 * @returns Total quantity across all items
 */
export function calculateTotalQuantity(orderItems: OrderItem[]): number {
  return orderItems.reduce((acc, item) => acc + item.quantity, 0);
}

/**
 * Gets the primary product name from order items
 * @param orderItems - Array of order items
 * @returns Primary product name or 'Unknown Item'
 */
export function getPrimaryProductName(orderItems: OrderItem[]): string {
  const primaryItem = orderItems[0];
  return primaryItem ? primaryItem.product.name : 'Unknown Item';
}

/**
 * Checks if an order can be cancelled based on its status
 * @param status - Order status
 * @returns True if order can be cancelled
 */
export function canCancelOrder(status: OrderStatus): boolean {
  return status !== 'CANCELLED' && status !== 'DELIVERED';
}

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';

/**
 * Calculates the progress percentage for the order tracker
 * @param stepIndex - Current step index
 * @returns Progress value between 0 and 1
 */
export function calculateTrackerProgress(stepIndex: number): number {
  switch (stepIndex) {
    case 0:
      return 0.15; // Small start for processing
    case 1:
      return 0.5; // Halfway for on the way
    case 2:
      return 1; // Full for delivered
    default:
      return 0;
  }
}

/**
 * Gets the color associated with a payment status
 * @param status - Payment status
 * @returns Color string from theme
 */
export function getPaymentStatusColor(status: string): string {
  switch (status) {
    case 'PAID':
      return colors.success;
    case 'FAILED':
    case 'CANCELLED':
      return colors.error;
    case 'PENDING':
    default:
      return colors.warning;
  }
}

/**
 * Gets the human-readable label for a payment status
 * @param status - Payment status
 * @returns Display label for the status
 */
export function getPaymentStatusLabel(status: string): string {
  switch (status) {
    case 'PAID':
      return 'Paid';
    case 'FAILED':
      return 'Failed';
    case 'CANCELLED':
      return 'Cancelled';
    case 'PENDING':
    default:
      return 'Pending';
  }
}
