import { ZodError } from 'zod';
import { useEffect, useState } from 'react';
import { profileSchema, ProfileFormData } from '@/shared/utils/profileValidator';

type FormErrors = Partial<Record<keyof ProfileFormData, string>>;

export function useProfileForm(initialData?: Partial<ProfileFormData>) {
  const [form, setForm] = useState<ProfileFormData>({
    name: '',
    email: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Populate from backend ONCE
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name ?? '',
        email: initialData.email ?? '',
      });
    }
  }, [initialData]);

  function updateField<K extends keyof ProfileFormData>(
    field: K,
    value: ProfileFormData[K],
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));

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
    updateField,
    validate,
  };
}
