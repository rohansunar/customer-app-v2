import { useToastHelpers } from '@/core/utils/toastHelpers';
import { addressValidator } from '@/shared/utils/addressValidator';
import { AddressFormState } from '../types';
/**
 * Custom hook for validating address form data.
 * Provides validation logic for form submission.
 *
 * @returns Object containing validation function
 */
export function useAddressValidation() {
  const showToast = useToastHelpers();

  // /**
  //  * Validates the address form data and shows error messages if invalid.
  //  *
  //  * @param formState - The current form state
  //  * @returns True if valid, false otherwise
  //  */
  const validateFullAddress = (addressText: string): string | null => {
    const result = addressValidator.safeParse(addressText);
    if (!result.success) {
      return result.error.issues[0].message;
    }
    return null;
  };

  const validateForm = (formState: AddressFormState): boolean => {
    const { label, addressText, pincode, city, state, lng, lat } = formState;
    const addressError = validateFullAddress(formState.addressText);
    if (addressError) {
      showToast.error(addressError);
      return false;
    }
    if (!label) {
      showToast.error('Please select an address type');
      return false;
    }
    if (!addressText) {
      showToast.error('Please enter your full address');
      return false;
    }
    if (!pincode) {
      showToast.error('Please enter your pincode');
      return false;
    }
    if (!city) {
      showToast.error('City is required. Please select a location on the map.');
      return false;
    }
    if (!state) {
      showToast.error('State is required. Please select a location on the map.');
      return false;
    }
    if (!lng || !lat) {
      showToast.error('Please select a location on the map');
      return false;
    }
    return true;
  };

  return {
    validateForm,
    validateFullAddress,
  };
}
