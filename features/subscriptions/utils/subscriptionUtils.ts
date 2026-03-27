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
 * Formats a date object as YYYY-MM-DD using local calendar values.
 */
export function formatDateForApi(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Parses a YYYY-MM-DD string into a local Date object.
 */
export function parseApiDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
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
