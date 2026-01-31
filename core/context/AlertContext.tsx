import React, { createContext, useContext } from 'react';
import Alert from '../ui/customAlert';
import { AlertContextType, useAlertState } from '../utils/useAlert';

// Create context with proper typing
const AlertContext = createContext<AlertContextType | null>(null);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const alertHelpers = useAlertState();

  return (
    <AlertContext.Provider value={alertHelpers}>
      {children}

      {/* Global Alert Component */}
      <Alert
        visible={alertHelpers.alert.visible}
        title={alertHelpers.alert.title}
        message={alertHelpers.alert.message}
        type={alertHelpers.alert.type}
        primaryButtonText={alertHelpers.alert.primaryButtonText}
        secondaryButtonText={alertHelpers.alert.secondaryButtonText}
        onPrimaryPress={
          alertHelpers.alert.onPrimaryPress || alertHelpers.hideAlert
        }
        onSecondaryPress={alertHelpers.alert.onSecondaryPress}
        onClose={alertHelpers.hideAlert}
        showCloseButton={alertHelpers.alert.showCloseButton}
        icon={alertHelpers.alert.icon}
        autoDismiss={alertHelpers.alert.autoDismiss}
        dismissOnBackdropPress={alertHelpers.alert.dismissOnBackdropPress}
        accessibility={alertHelpers.alert.accessibility}
      />
    </AlertContext.Provider>
  );
};

// Main hook to use in components
export const useAlert = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) {
    throw new Error('useAlert must be used within AlertProvider');
  }
  return ctx;
};

// Optional: Export specific methods for convenience
export const useAlertMethods = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) {
    throw new Error('useAlertMethods must be used within AlertProvider');
  }

  return {
    showSuccess: ctx.showSuccess,
    showError: ctx.showError,
    showConfirm: ctx.showConfirm,
    showInfo: ctx.showInfo,
  };
};
