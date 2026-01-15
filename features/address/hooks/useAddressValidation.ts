import { showError } from '@/core/ui/toast';
import { AddressFormState } from '../types';

/**
 * Custom hook for validating address form data.
 * Provides validation logic for form submission.
 *
 * @returns Object containing validation function
 */
export function useAddressValidation() {
  /**
   * Validates the address form data and shows error messages if invalid.
   *
   * @param formState - The current form state
   * @returns True if valid, false otherwise
   */
  const validateForm = (formState: AddressFormState): boolean => {
    const { label, addressText, pincode, cityId, lng, lat } = formState;

    if (!label) {
      showError('Please select an address type');
      return false;
    }
    if (!addressText) {
      showError('Please enter your full address');
      return false;
    }
    if (!pincode) {
      showError('Please enter your pincode');
      return false;
    }
    if (!cityId) {
      showError('Please select a city');
      return false;
    }
    if (!lng || !lat) {
      showError('Please select a location on the map');
      return false;
    }
    return true;
  };

  return { validateForm };
}
