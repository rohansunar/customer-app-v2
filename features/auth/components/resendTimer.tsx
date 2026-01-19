import { useEffect, useState } from 'react';

export const RESEND_TIMER = 30;

export const useOtpTimer = (active: boolean = true) => {
  const [timer, setTimer] = useState(RESEND_TIMER);

  useEffect(() => {
    if (!active || timer === 0) return;

    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, active]);

  const resetTimer = () => setTimer(RESEND_TIMER);

  return {
    timer,
    resetTimer,
    setTimer,
  };
};
