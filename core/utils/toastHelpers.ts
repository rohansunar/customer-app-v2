import { ToastPosition } from '../ui/customToast';
import { useToast } from './ToastContext';

interface ToastOptions {
  duration?: number;
  position?: ToastPosition;
  actionText?: string;
  onAction?: () => void;
  showIcon?: boolean;
}

export const useToastHelpers = () => {
  const { showToast } = useToast();

  // Generic toast functions
  const showGenericToast = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info',
    options?: ToastOptions,
  ) => {
    showToast(message, type, options);
  };

  // Success toasts
  const success = (message: string, options?: ToastOptions) => {
    showGenericToast(message, 'success', options);
  };

  const error = (message: string, options?: ToastOptions) => {
    showGenericToast(message, 'error', options);
  };

  const warning = (message: string, options?: ToastOptions) => {
    showGenericToast(message, 'warning', options);
  };

  const info = (message: string, options?: ToastOptions) => {
    showGenericToast(message, 'info', options);
  };

  // Water App Specific Toast Functions
  const waterAppToasts = {
    // Order related
    orderPlaced: (orderNumber?: string) => {
      const message = orderNumber
        ? `Order #${orderNumber} placed successfully! 🎉`
        : 'Order placed successfully! 🎉';

      success(message, {
        duration: 4000,
        position: 'top',
      });
    },

    orderUpdated: (status: string) => {
      const messages: Record<string, string> = {
        confirmed: 'Order confirmed! Our vendor is preparing your water 🚰',
        dispatched: 'Your water is on the way! 🚚',
        delivered: 'Water delivered successfully! ✅',
        cancelled: 'Order cancelled successfully',
      };

      const message = messages[status] || `Order ${status}`;
      const type = status === 'cancelled' ? 'warning' : 'success';

      showGenericToast(message, type, {
        duration: 3000,
        position: 'top',
      });
    },

    // Water bottle related
    waterBottleVerified: () => {
      success('Water bottle verified! Bottle is sealed and safe to drink ✅', {
        duration: 3000,
      });
    },

    waterBottleRejected: (reason?: string) => {
      const defaultMessage =
        'Water bottle rejected. Please take a clear photo of the sealed bottle.';
      const message = reason || defaultMessage;

      error(message, {
        duration: 5000,
        actionText: 'Retry',
      });
    },

    // Payment related
    paymentSuccess: (amount?: number) => {
      const message = amount
        ? `Payment of ₹${amount} successful! 💳`
        : 'Payment successful! 💳';

      success(message, {
        duration: 3000,
      });
    },

    paymentFailed: (retryAction?: () => void) => {
      error('Payment failed. Please try again', {
        duration: 4000,
        actionText: 'Retry Payment',
        onAction: retryAction,
      });
    },

    // Delivery related
    deliveryAssigned: (driverName: string, eta: string) => {
      info(`🚚 ${driverName} will deliver your water in ${eta}`, {
        duration: 5000,
      });
    },

    deliveryDelayed: (newTime: string) => {
      warning(`Delivery delayed. New estimated time: ${newTime}`, {
        duration: 6000,
      });
    },

    // Vendor related
    vendorAccepted: (vendorName: string) => {
      success(`✅ ${vendorName} accepted your order!`, {
        duration: 4000,
      });
    },

    vendorOutOfStock: (vendorName: string, alternative?: string) => {
      const message = alternative
        ? `${vendorName} is out of stock. ${alternative} is available nearby`
        : `${vendorName} is temporarily out of stock`;

      warning(message, {
        duration: 6000,
        actionText: alternative ? 'View Alternative' : undefined,
      });
    },

    // User account related
    profileUpdated: () => {
      success('Profile updated successfully!', {
        duration: 3000,
      });
    },

    addressSaved: () => {
      success('Delivery address saved!', {
        duration: 3000,
      });
    },

    // App notifications
    appUpdateAvailable: () => {
      info('New update available! Tap to update', {
        duration: 6000,
        actionText: 'Update',
        onAction: () => {
          // Open app store
          console.log('Open app store for update');
        },
      });
    },

    offlineMode: () => {
      warning('You are offline. Some features may be limited', {
        duration: 4000,
      });
    },

    backOnline: () => {
      success('You are back online! ✓', {
        duration: 3000,
      });
    },

    // Water quality alerts
    waterQualityCertified: (waterType: string) => {
      success(`${waterType} water is certified pure and safe to drink`, {
        duration: 4000,
      });
    },

    // Subscription related
    subscriptionRenewed: (plan: string) => {
      success(`${plan} subscription renewed! Next delivery scheduled`, {
        duration: 4000,
      });
    },

    subscriptionExpiring: (days: number) => {
      warning(`Your subscription expires in ${days} days. Renew now!`, {
        duration: 5000,
        actionText: 'Renew',
      });
    },
  };

  return {
    // Generic methods
    success,
    error,
    warning,
    info,

    // Water app specific methods
    ...waterAppToasts,

    // Helper to show loading toast (custom)
    loading: (message: string) => {
      // Note: For loading states, you might want a different component
      // This shows an info toast that stays until manually hidden
      showGenericToast(message, 'info', {
        duration: 999999, // Long duration
      });
    },

    // Helper to hide loading toast
    hideLoading: () => {
      // This would require a ref to the toast context
      // Implementation depends on your context structure
    },
  };
};
