import { useMemo, useState } from 'react';
import { DayOfWeek, Subscription, SubscriptionType } from '../types';
import {
  calculateUpcomingDates,
  convertDaysToNames,
} from '../utils/subscriptionUtils';

// Interface for subscription form state - Interface Segregation Principle: Segregated from component props
export interface ISubscriptionFormState {
  frequency: SubscriptionType;
  customDays: DayOfWeek[];
  quantity: number;
  selectedDate: Date;
}

// Interface for subscription form actions
export interface ISubscriptionFormActions {
  setFrequency: (frequency: SubscriptionType) => void;
  setCustomDays: (customDays: DayOfWeek[]) => void;
  setQuantity: (quantity: number) => void;
  setSelectedDate: (date: Date) => void;
  toggleDay: (day: DayOfWeek) => void;
  incrementQty: () => void;
  decrementQty: () => void;
}

// Combined interface for the hook return - Dependency Inversion Principle: Abstraction over concrete state
export interface IUseSubscriptionForm {
  state: ISubscriptionFormState;
  actions: ISubscriptionFormActions;
  getUpcomingDates: string[];
}

// Custom hook for managing subscription form state
// Single Responsibility Principle: Handles only form state management
export function useSubscriptionForm(
  existingSubscription?: Subscription,
): IUseSubscriptionForm {
  const [frequency, setFrequency] = useState<SubscriptionType>(
    existingSubscription?.frequency || 'DAILY',
  );
  // Convert numeric days from existing subscription to day names for form state
  const [customDays, setCustomDays] = useState<DayOfWeek[]>(
    existingSubscription?.custom_days
      ? convertDaysToNames(existingSubscription.custom_days)
      : [],
  );
  const [quantity, setQuantity] = useState(existingSubscription?.quantity || 1);
  const [selectedDate, setSelectedDate] = useState(() => {
    if (existingSubscription?.start_date) {
      return new Date(existingSubscription.start_date);
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });

  const toggleDay = (day: DayOfWeek) => {
    setCustomDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const incrementQty = () => setQuantity((q) => q + 1);
  const decrementQty = () => setQuantity((q) => Math.max(1, q - 1));

  const getUpcomingDates = useMemo(
    () => calculateUpcomingDates(frequency, selectedDate),
    [frequency, selectedDate],
  );

  return {
    state: {
      frequency,
      customDays,
      quantity,
      selectedDate,
    },
    actions: {
      setFrequency,
      setCustomDays,
      setQuantity,
      setSelectedDate,
      toggleDay,
      incrementQty,
      decrementQty,
    },
    getUpcomingDates,
  };
}
