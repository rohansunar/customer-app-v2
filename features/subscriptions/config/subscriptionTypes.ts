import { SubscriptionType } from '../types';

// Interface for subscription type configuration - Interface Segregation Principle: Specific interface for config
export interface ISubscriptionTypeConfig {
  type: SubscriptionType;
  label: string;
  description: string;
}

// Configuration array for subscription types - Open-Closed Principle: Open for extension by adding new configs without modifying existing code
export const subscriptionTypeConfigs: ISubscriptionTypeConfig[] = [
  {
    type: 'DAILY',
    label: 'Daily',
    description: 'Delivery every day',
  },
  {
    type: 'ALTERNATIVE_DAYS',
    label: 'Alternate Days',
    description: 'Delivery every 2nd day',
  },
  {
    type: 'CUSTOM_DAYS',
    label: 'Custom Days',
    description: 'Select specific days of the week',
  },
];
