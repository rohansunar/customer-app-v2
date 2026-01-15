import { SubscriptionType } from '../types';

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
