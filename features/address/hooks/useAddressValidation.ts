import { AddressFormErrors, AddressFormState } from '../types';
import { addressFormSchema } from '@/shared/utils/addressValidator';
import { ZodError } from 'zod';
import { useToastHelpers } from '@/core/utils/toastHelpers';
import { Dispatch, SetStateAction } from 'react';

export const useAddressValidation = () => {
  const showToast = useToastHelpers();

  /* ---------------- ZOD VALIDATION ---------------- */

  const mapZodErrors = (zodError: ZodError): AddressFormErrors => {
    const fieldErrors: AddressFormErrors = {};

    zodError.issues.forEach((issue) => {
      const field = issue.path[0] as keyof AddressFormErrors;
      if (!fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    });

    return fieldErrors;
  };

  const validateZodFields = (
    formState: AddressFormState,
    setErrors: Dispatch<SetStateAction<AddressFormErrors>>,
  ): boolean => {
    const result = addressFormSchema.safeParse({
      addressText: formState.addressText,
      pincode: formState.pincode,
      city: formState.city,
      state: formState.state,
    });

    if (!result.success) {
      const zodError = result.error as ZodError;
      setErrors(mapZodErrors(zodError));

      // Show FIRST error only (better UX)
      const firstError = zodError.issues[0]?.message;
      if (firstError) {
        showToast.error(firstError);
      }

      return false;
    }

    setErrors({});
    return true;
  };

  /* ---------------- BUSINESS RULE VALIDATION ---------------- */

  const validateRequiredFields = (formState: AddressFormState): boolean => {
    const { label, lng, lat } = formState;

    if (!label) {
      showToast.error('Please select an address type (Home, Work, Other)');
      return false;
    }

    // Map selection is CRITICAL for delivery apps
    if (!lng || !lat) {
      showToast.error('Please select your location on the map');
      return false;
    }

    return true;
  };

  /* ---------------- FINAL VALIDATOR ---------------- */

  const validateForm = (
    formState: AddressFormState,
    setErrors: Dispatch<SetStateAction<AddressFormErrors>>,
  ): boolean => {
    // Step 1 → Validate inputs (Zod)
    const zodValid = validateZodFields(formState, setErrors);
    if (!zodValid) return false;

    // Step 2 → Validate delivery logic
    const requiredFieldValid = validateRequiredFields(formState);
    if (!requiredFieldValid) return false;

    return true;
  };

  return {
    validateForm,
  };
};
