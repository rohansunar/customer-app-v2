import { colors } from '@/core/theme/colors';

/**
 * Utility functions for subscription-related operations
 * Following Single Responsibility Principle
 */

/**
 * Calculates days until a given date
 * @param dateString - ISO date string
 * @returns Number of days until the date (0 if today or past)
 */
export function calculateDaysUntil(dateString: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(dateString);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
}

/**
 * Gets urgency color based on days remaining
 * @param daysRemaining - Number of days until delivery
 * @returns Color string from theme
 */
export function getUrgencyColor(daysRemaining: number): string {
  if (daysRemaining === 0) return colors.success;
  if (daysRemaining <= 2) return colors.error;
  if (daysRemaining <= 4) return colors.warning;
  return colors.primary;
}

/**
 * Calculates delivery progress percentage
 * @param daysRemaining - Number of days until delivery
 * @returns Progress percentage (0-100)
 */
export function calculateDeliveryProgress(daysRemaining: number): number {
  if (daysRemaining === 0) return 100;
  if (daysRemaining > 7) return 0;
  return ((7 - daysRemaining) / 7) * 100;
}

/**
 * Formats countdown text
 * @param daysRemaining - Number of days until delivery
 * @returns Formatted countdown string
 */
export function formatCountdown(daysRemaining: number): string {
  if (daysRemaining === 0) return 'Today';
  if (daysRemaining === 1) return 'Tomorrow';
  return `${daysRemaining} days`;
}

/**
 * Gets gradient colors based on subscription status
 * @param isActive - Whether subscription is active
 * @returns Array of gradient colors
 */
export function getGradientColors(isActive: boolean): [string, string] {
  return isActive ? ['#3B82F6', '#2563EB'] : ['#9CA3AF', '#6B7280'];
}

/**
 * Gets card overlay gradient colors
 * @param isActive - Whether subscription is active
 * @returns Array of overlay gradient colors
 */
export function getOverlayGradient(isActive: boolean): [string, string] {
  return isActive
    ? ['rgba(59, 130, 246, 0.05)', 'rgba(37, 99, 235, 0.02)']
    : ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)'];
}

/**
 * Formats date for display
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export function formatSubscriptionDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Formats short date for display
 * @param dateString - ISO date string
 * @returns Short formatted date string
 */
export function formatShortDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
