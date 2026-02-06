import { DayOfWeek, SubscriptionType } from '../types';

/**
 * Mapping of day names to numeric values for API requests.
 * Backend expects: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
 */
const DAY_NAME_TO_NUMBER: Record<DayOfWeek, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

/**
 * Mapping of numeric values to day names for display purposes.
 */
const DAY_NUMBER_TO_NAME: Record<number, DayOfWeek> = {
  0: 'SUNDAY',
  1: 'MONDAY',
  2: 'TUESDAY',
  3: 'WEDNESDAY',
  4: 'THURSDAY',
  5: 'FRIDAY',
  6: 'SATURDAY',
};

/**
 * Converts an array of day names to numeric values for API requests.
 * @param dayNames - Array of day names (e.g., ['MONDAY', 'WEDNESDAY'])
 * @returns Array of numeric values (e.g., [1, 3])
 */
export function convertDaysToNumeric(dayNames: DayOfWeek[]): number[] {
  return dayNames.map((day) => DAY_NAME_TO_NUMBER[day]);
}

/**
 * Converts an array of numeric values to day names for display purposes.
 * @param numericDays - Array of numeric values (e.g., [1, 3])
 * @returns Array of day names (e.g., ['MONDAY', 'WEDNESDAY'])
 */
export function convertDaysToNames(numericDays: number[]): DayOfWeek[] {
  return numericDays.map((day) => DAY_NUMBER_TO_NAME[day]);
}

/**
 * Converts numeric day values to short day names for display.
 * @param numericDays - Array of numeric values (e.g., [1, 3])
 * @returns Array of short day names (e.g., ['Mon', 'Wed'])
 */
function getShortDayNames(numericDays: number[]): string[] {
  const DAY_NUMBERS_TO_SHORT_NAMES: Record<number, string> = {
    0: 'Sun',
    1: 'Mon',
    2: 'Tue',
    3: 'Wed',
    4: 'Thu',
    5: 'Fri',
    6: 'Sat',
  };
  return numericDays.map((day) => DAY_NUMBERS_TO_SHORT_NAMES[day]);
}

/**
 * Calculates the human-readable label for a subscription frequency.
 * @param frequency - The subscription frequency type.
 * @param custom_days - Optional array of custom days (numeric or string) for CUSTOM_DAYS frequency.
 * @returns The formatted frequency label.
 */
export function getFrequencyLabel(
  frequency: SubscriptionType,
  custom_days?: number[] | string[] | null,
): string {
  switch (frequency) {
    case 'DAILY':
      return 'Daily';
    case 'ALTERNATIVE_DAYS':
      return 'Alternative Days';
    case 'CUSTOM_DAYS':
      if (!custom_days || custom_days.length === 0) {
        return 'Custom: None';
      }
      // Handle numeric arrays (from API)
      if (typeof custom_days[0] === 'number') {
        return `Custom: ${getShortDayNames(custom_days as number[]).join(', ')}`;
      }
      // Handle string arrays (from form state)
      return `Custom: ${(custom_days as string[]).map((d) => d.substring(0, 3)).join(', ')}`;
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

/**
 * Interface for detailed subscription calculation results
 */
export interface SubscriptionDetails {
  effectiveStartDate: Date;
  effectiveEndDate: Date;
  periodLabel: string;
  totalDeliveries: number;
  daysRemaining: number;
  totalAmount: number;
  isNextMonth: boolean;
}

/**
 * Calculates all subscription details including zero-day handling.
 * If the start date is the last day of the month, the period shifts to the entire next month.
 */
export function getSubscriptionDetails(
  startDate: Date,
  frequency: SubscriptionType,
  quantity: number,
  price: number,
  customDays: number[] = [],
): SubscriptionDetails {
  const year = startDate.getFullYear();
  const month = startDate.getMonth();

  // Check if startDate is the last day of the month
  const lastDayOfCurrentMonth = new Date(year, month + 1, 0).getDate();
  const isLastDay = startDate.getDate() === lastDayOfCurrentMonth;

  let effectiveStartDate: Date;
  let effectiveEndDate: Date;
  let periodLabel: string;
  let isNextMonth = false;

  if (isLastDay) {
    // Shift to next month
    effectiveStartDate = new Date(year, month + 1, 1);
    effectiveEndDate = new Date(year, month + 2, 0);
    const nextMonthName = effectiveStartDate.toLocaleDateString(undefined, {
      month: 'long',
    });
    periodLabel = `Full Month (${nextMonthName})`;
    isNextMonth = true;
  } else {
    // Stay in current month
    effectiveStartDate = new Date(startDate);
    effectiveEndDate = new Date(year, month + 1, 0);
    const currentMonthName = effectiveStartDate.toLocaleDateString(undefined, {
      month: 'long',
    });
    periodLabel = `Rest of ${currentMonthName}`;
  }

  // Calculate deliveries between effective start and end dates
  let totalDeliveries = 0;
  const loopDate = new Date(effectiveStartDate);

  while (loopDate <= effectiveEndDate) {
    const dayOfWeek = loopDate.getDay();
    let isDeliveryDay = false;

    if (frequency === 'DAILY') {
      isDeliveryDay = true;
    } else if (frequency === 'ALTERNATIVE_DAYS') {
      // Calculate days difference from the *effective* start date to ensure consistent pattern
      const diffInDays = Math.floor(
        (loopDate.getTime() - effectiveStartDate.getTime()) /
          (1000 * 60 * 60 * 24),
      );
      if (diffInDays % 2 === 0) {
        isDeliveryDay = true;
      }
    } else if (frequency === 'CUSTOM_DAYS') {
      if (customDays.includes(dayOfWeek)) {
        isDeliveryDay = true;
      }
    }

    if (isDeliveryDay) {
      totalDeliveries++;
    }

    // Move to next day
    loopDate.setDate(loopDate.getDate() + 1);
  }

  const daysRemaining =
    Math.floor(
      (effectiveEndDate.getTime() - effectiveStartDate.getTime()) /
        (1000 * 60 * 60 * 24),
    ) + 1;

  const totalAmount = totalDeliveries * quantity * price;

  return {
    effectiveStartDate,
    effectiveEndDate,
    periodLabel,
    totalDeliveries,
    daysRemaining,
    totalAmount,
    isNextMonth,
  };
}
