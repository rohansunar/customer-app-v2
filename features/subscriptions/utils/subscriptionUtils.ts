import { SubscriptionType } from '../types';

/**
 * Calculates the human-readable label for a subscription frequency.
 * @param frequency - The subscription frequency type.
 * @param custom_days - Optional array of custom days for CUSTOM_DAYS frequency.
 * @returns The formatted frequency label.
 */
export function getFrequencyLabel(frequency: SubscriptionType, custom_days?: string[]): string {
  switch (frequency) {
    case 'DAILY':
      return 'Daily';
    case 'ALTERNATIVE_DAYS':
      return 'Alternative Days';
    case 'CUSTOM_DAYS':
      return `Custom: ${custom_days?.map((d) => d.substring(0, 3)).join(', ')}`;
    default:
      return frequency;
  }
}

// Utility function for calculating upcoming dates - Single Responsibility Principle: Handles only date calculation logic
export function calculateUpcomingDates(
  frequency: SubscriptionType,
  selectedDate: Date,
): string[] {
  if (frequency === 'CUSTOM_DAYS') return [];
  const dates = [];
  const baseDate = new Date(selectedDate);
  const interval = frequency === 'DAILY' ? 1 : 2;
  for (let i = 0; i < 4; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i * interval);
    dates.push(
      d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
    );
  }
  return dates;
}
