/**
 * Utility functions for transaction display formatting.
 *
 * Pure functions with no React/Native dependencies so they can be
 * unit-tested in a plain Node.js environment.
 */

import { colors } from '@/core/theme/colors';

/**
 * Formats a transaction amount with currency prefix.
 * @param type - 'credit' or 'debit'
 * @param amount - Numeric amount
 * @returns e.g. "+₹1,000" or "-₹1,000"
 */
export function formatTransactionAmount(
  type: string,
  amount: string | number,
): string {
  const numericAmount =
    typeof amount === 'string' ? parseFloat(amount) : amount;
  const formatted = isNaN(numericAmount)
    ? '0'
    : numericAmount.toLocaleString('en-IN');
  return type?.toLowerCase() === 'debit' ? `-₹${formatted}` : `+₹${formatted}`;
}

/**
 * Returns the SF Symbol icon name for a transaction type.
 * @param type - 'credit' or 'debit'
 */
export function getTransactionIcon(type: string): string {
  return type?.toLowerCase() === 'debit'
    ? 'arrow.up.right.circle.fill'
    : 'arrow.down.left.circle.fill';
}

/**
 * Returns the display color for a transaction type.
 * @param type - 'credit' or 'debit'
 */
export function getTransactionColor(type: string): string {
  return type?.toLowerCase() === 'debit' ? colors.primary : colors.success;
}

/**
 * Returns the display color for the amount text.
 * @param type - 'credit' or 'debit'
 */
export function getAmountColor(type: string): string {
  return type?.toLowerCase() === 'debit' ? colors.textPrimary : colors.success;
}

/**
 * Formats an ISO date string into a human-readable date and time.
 * @param isoString - ISO 8601 date string
 * @returns e.g. "16 Mar 2026, 1:42 AM"
 */
export function formatTransactionDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  } catch {
    return isoString;
  }
}

/**
 * Returns a human-readable label for a transaction status.
 */
export function getStatusLabel(status?: string): string {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'Pending';
    case 'failed':
      return 'Failed';
    case 'completed':
      return 'Completed';
    default:
      return status || 'Completed';
  }
}

/**
 * Returns the badge color for a transaction status.
 */
export function getStatusColor(status?: string): string {
  switch (status?.toLowerCase()) {
    case 'pending':
      return colors.warning;
    case 'failed':
      return colors.error;
    case 'completed':
      return colors.success;
    default:
      return colors.success;
  }
}
