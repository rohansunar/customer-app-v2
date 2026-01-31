import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertType, IconName } from '../ui/customAlert';

/** What callers pass */
export interface AlertOptions {
  title?: string;
  message: string;
  type?: AlertType;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
  showCloseButton?: boolean;
  icon?: IconName;
  autoDismiss?: number;
  dismissOnBackdropPress?: boolean;
  accessibility?: {
    alertTitle?: string;
    alertMessage?: string;
  };
}

/** Internal state */
interface AlertState extends AlertOptions {
  visible: boolean;
}

const getDefaultTitle = (type?: AlertType): string => {
  switch (type) {
    case 'success':
      return 'Success';
    case 'error':
      return 'Error';
    case 'warning':
      return 'Warning';
    case 'confirm':
      return 'Confirm';
    default:
      return 'Alert';
  }
};

// Rename to internal useAlertState to make it clear it's for internal use
export const useAlertState = () => {
  const [alert, setAlert] = useState<AlertState>({
    visible: false,
    title: 'Alert',
    message: '',
    type: 'info',
    primaryButtonText: 'OK',
    showCloseButton: true,
  });

  /** Prevent state updates after unmount */
  const isMounted = useRef<boolean>(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const showAlert = useCallback((options: AlertOptions) => {
    if (!isMounted.current) return;

    if (__DEV__) {
      console.log('[Alert] show:', options);
    }

    setAlert({
      ...options,
      visible: true,
      title: options.title ?? getDefaultTitle(options.type),
      type: options.type ?? 'info',
      primaryButtonText: options.primaryButtonText ?? 'OK',
      showCloseButton: options.showCloseButton !== false,
    });
  }, []);

  const hideAlert = useCallback(() => {
    if (!isMounted.current) return;

    setAlert((prev) => ({
      ...prev,
      visible: false,
    }));
  }, []);

  /* ---------- Helper methods ---------- */

  const showSuccess = useCallback(
    (message: string, title?: string, onConfirm?: () => void) => {
      showAlert({
        title: title || 'Success',
        message,
        type: 'success',
        autoDismiss: 3000,
        onPrimaryPress: () => {
          onConfirm?.();
          hideAlert();
        },
      });
    },
    [showAlert, hideAlert],
  );

  const showError = useCallback(
    (message: string, title?: string, onRetry?: () => void) => {
      showAlert({
        title: title || 'Error',
        message,
        type: 'error',
        primaryButtonText: 'Retry',
        secondaryButtonText: 'Cancel',
        onPrimaryPress: () => {
          onRetry?.();
          hideAlert();
        },
        onSecondaryPress: hideAlert,
      });
    },
    [showAlert, hideAlert],
  );

  const showConfirm = useCallback(
    (
      message: string,
      onConfirm: () => void,
      title?: string,
      onCancel?: () => void,
      confirmText = 'Confirm',
      cancelText = 'Cancel',
    ) => {
      showAlert({
        title: title || 'Confirm',
        message,
        type: 'confirm',
        primaryButtonText: confirmText,
        secondaryButtonText: cancelText,
        onPrimaryPress: () => {
          onConfirm();
          hideAlert();
        },
        onSecondaryPress: () => {
          onCancel?.();
          hideAlert();
        },
      });
    },
    [showAlert, hideAlert],
  );

  const showInfo = useCallback(
    (message: string, title?: string) => {
      showAlert({
        title: title || 'Info',
        message,
        type: 'info',
        autoDismiss: 4000,
      });
    },
    [showAlert],
  );

  return {
    alert,
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showConfirm,
    showInfo,
  };
};

// Type for the context value
export type AlertContextType = ReturnType<typeof useAlertState>;
