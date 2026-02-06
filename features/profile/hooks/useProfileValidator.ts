import { useEffect, useState } from 'react';
import {
  profileSchema,
  ProfileFormData,
} from '@/shared/utils/profileValidator';
import { Profile } from '../types';

type FormErrors = Partial<Record<keyof ProfileFormData, string>>;

export function useProfileForm(initialData?: Profile | undefined) {
  const [form, setForm] = useState<ProfileFormData>({
    name: '',
    email: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isDirty, setIsDirty] = useState(false);

  // Populate from backend ONCE and track original values
  useEffect(() => {
    if (initialData) {
      const initialForm = {
        name: initialData.name ?? '',
        email: initialData.email ?? '',
      };
      setForm(initialForm);
    }
  }, [initialData]);

  function updateField<K extends keyof ProfileFormData>(
    field: K,
    value: ProfileFormData[K],
  ) {
    setForm((prev) => {
      const newForm = { ...prev, [field]: value };
      // Check if form differs from initial
      if (initialData) {
        const initialForm = {
          name: initialData.name ?? '',
          email: initialData.email ?? '',
        };
        setIsDirty(
          newForm.name !== initialForm.name ||
            newForm.email !== initialForm.email,
        );
      }
      return newForm;
    });

    // Clear error as user edits
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function validate(): boolean {
    const result = profileSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof ProfileFormData;
        fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  }

  return {
    form,
    errors,
    isDirty,
    updateField,
    validate,
  };
}
