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

export const useAlert = () => {
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

  /* ---------- Helpers ---------- */

  const showSuccess = useCallback(
    (title: string, message: string, onConfirm?: () => void) => {
      showAlert({
        title,
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
    (title: string, message: string, onRetry?: () => void) => {
      showAlert({
        title,
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
      title: string,
      message: string,
      onConfirm: () => void,
      onCancel?: () => void,
      confirmText = 'Confirm',
      cancelText = 'Cancel',
    ) => {
      showAlert({
        title,
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
    (title: string, message: string) => {
      showAlert({
        title,
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

