import { useMemo, useRef, useState } from 'react';
import { phoneSchema } from '../utils/phoneValidator';

export const usePhoneValidation = () => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const validatePhone = (value: string) => {
    const result = phoneSchema.safeParse({ phone: value });
    if (!result.success) {
      return result.error.issues[0].message;
    }
    return null;
  };

  const onChange = (value: string) => {
    setPhone(value);
    setError(null);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (value.length === 10) {
      setError(validatePhone(value));
      return;
    }

    timeoutRef.current = setTimeout(() => {
      setError(validatePhone(value));
    }, 3000);
  };

  const isValidPhone = useMemo(
    () => phone.trim().length === 10 && !error,
    [phone, error],
  );

  return {
    phone,
    error,
    isValidPhone,
    onChange,
  };
};
