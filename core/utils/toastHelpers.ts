import { useToast } from '../context/ToastContext';
import { ToastPosition } from '../ui/customToast';

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
    showGenericToast(message, 'success', { ...options, duration: 30000 });
  };

  const error = (message: string, options?: ToastOptions) => {
    showGenericToast(message, 'error', { ...options, duration: 30000 });
  };

  const warning = (message: string, options?: ToastOptions) => {
    showGenericToast(message, 'warning', { ...options, duration: 30000 });
  };

  const info = (message: string, options?: ToastOptions) => {
    showGenericToast(message, 'info', { ...options, duration: 30000 });
  };

  return {
    // Generic methods
    success,
    error,
    warning,
    info,

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
