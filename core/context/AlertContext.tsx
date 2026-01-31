import React, { createContext, useContext } from 'react';
import Alert from '../ui/customAlert';
import { useAlert } from '../utils/useAlert';

type AlertContextType = ReturnType<typeof useAlert>;

const AlertContext = createContext<AlertContextType | null>(null);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const alertHelpers = useAlert();

  return (
    <AlertContext.Provider value={alertHelpers}>
      {children}

      {/* 🔥 Render Alert ONCE globally */}
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
      />
    </AlertContext.Provider>
  );
};

export const useAlertContext = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) {
    throw new Error('useAlertContext must be used within AlertProvider');
  }
  return ctx;
};
