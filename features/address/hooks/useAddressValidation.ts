import { AddressFormErrors, AddressFormState } from '../address.types';
import { addressFormSchema } from '@/shared/utils/addressValidator';
import { ZodError } from 'zod';
import { Dispatch, SetStateAction } from 'react';

export const useAddressValidation = () => {
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
      setErrors(mapZodErrors(result.error as ZodError));
      return false;
    }

    setErrors({});
    return true;
  };

  const validateRequiredFields = (
    formState: AddressFormState,
    setErrors: Dispatch<SetStateAction<AddressFormErrors>>,
  ): boolean => {
    const { label } = formState;

    if (!label) {
      setErrors((prev) => ({
        ...prev,
        label: 'Please select an address type (Home, Work, Other)',
      }));
      return false;
    }

    return true;
  };

  const validateForm = (
    formState: AddressFormState,
    setErrors: Dispatch<SetStateAction<AddressFormErrors>>,
    isEdit: boolean = false,
  ): boolean => {
    const zodValid = validateZodFields(formState, setErrors);
    if (!zodValid) return false;

    if (formState.familyMembersCount < 1) {
      setErrors((prev) => ({
        ...prev,
        familyMembersCount: 'At least 1 family member is required',
      }));
      return false;
    }

    const requiredFieldValid = validateRequiredFields(
      formState,
      setErrors,
    );
    if (!requiredFieldValid) return false;

    return true;
  };

  return {
    validateForm,
  };
};
