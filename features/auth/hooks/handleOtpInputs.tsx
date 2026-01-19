import { useRef, useState } from 'react';
import { TextInput } from 'react-native';

export const OTP_LENGTH = 6;

export const useOtpInput = (clearError: () => void) => {
  const [otpDigits, setOtpDigits] = useState<string[]>(
    Array(OTP_LENGTH).fill(''),
  );
  const inputRefs = useRef<TextInput[]>([]);

  const handleChange = (text: string, index: number) => {
    clearError();
    if (!/^\d?$/.test(text)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = text;
    setOtpDigits(newDigits);

    if (text && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (key: string, digit: string, index: number) => {
    if (key === 'Backspace' && !digit && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const clearOtp = () => {
    setOtpDigits(Array(OTP_LENGTH).fill(''));
    inputRefs.current[0]?.focus();
  };

  return {
    otpDigits,
    inputRefs,
    handleChange,
    handleBackspace,
    clearOtp,
  };
};
