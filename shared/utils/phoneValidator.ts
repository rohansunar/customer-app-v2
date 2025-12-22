/**
 * Validates phone numbers in E.164 format
 * Example: +919876543210
 */
export function isValidPhone(phone: string): boolean {
  const regex = /^\+?[1-9]\d{9,14}$/;
  return regex.test(phone);
}