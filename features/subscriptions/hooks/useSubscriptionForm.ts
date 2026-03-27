import { useState } from 'react';
import { DayOfWeek, SubscriptionType } from '../types';

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
  reset: () => void;
}

const DEFAULT_FREQUENCY: SubscriptionType = 'DAILY';
const DEFAULT_QUANTITY = 1;

function getDefaultStartDate(): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
}

// Combined interface for the hook return - Dependency Inversion Principle: Abstraction over concrete state
export interface IUseSubscriptionForm {
  state: ISubscriptionFormState;
  actions: ISubscriptionFormActions;
}

// Custom hook for managing subscription form state
// Single Responsibility Principle: Handles only form state management
export function useSubscriptionForm(): IUseSubscriptionForm {
  const [frequency, setFrequency] =
    useState<SubscriptionType>(DEFAULT_FREQUENCY);
  const [customDays, setCustomDays] = useState<DayOfWeek[]>([]);
  const [quantity, setQuantity] = useState(DEFAULT_QUANTITY);
  const [selectedDate, setSelectedDate] = useState(getDefaultStartDate);

  const reset = () => {
    setFrequency(DEFAULT_FREQUENCY);
    setCustomDays([]);
    setQuantity(DEFAULT_QUANTITY);
    setSelectedDate(getDefaultStartDate());
  };

  const toggleDay = (day: DayOfWeek) => {
    setCustomDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const incrementQty = () => setQuantity((q) => q + 1);
  const decrementQty = () => setQuantity((q) => Math.max(1, q - 1));

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
      reset,
    },
  };
}
