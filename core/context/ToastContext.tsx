import React, { createContext, useState, useContext, ReactNode } from 'react';
import Toast, { ToastType, ToastPosition } from '../ui/customToast';

interface ToastContextType {
  showToast: (
    message: string,
    type: ToastType,
    options?: {
      duration?: number;
      position?: ToastPosition;
      actionText?: string;
      onAction?: () => void;
    },
  ) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    visible: boolean;
    duration: number;
    position: ToastPosition;
    actionText?: string;
    onAction?: () => void;
  }>({
    message: '',
    type: 'info',
    visible: false,
    duration: 3000,
    position: 'top',
  });

  const showToast = (
    message: string,
    type: ToastType,
    options?: {
      duration?: number;
      position?: ToastPosition;
      actionText?: string;
      onAction?: () => void;
    },
  ) => {
    setToast({
      message,
      type,
      visible: true,
      duration: options?.duration || 3000,
      position: options?.position || 'top',
      actionText: options?.actionText,
      onAction: options?.onAction,
    });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        duration={toast.duration}
        position={toast.position}
        actionText={toast.actionText}
        onAction={toast.onAction}
        onHide={hideToast}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
