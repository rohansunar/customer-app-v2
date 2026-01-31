import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useEffect, useRef } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Dimensions,
  Keyboard,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export type AlertType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

export type IconName = keyof typeof Ionicons.glyphMap;

export interface AlertProps {
  visible: boolean;
  title?: string;
  message: string;
  type?: AlertType;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryPress: () => void;
  onSecondaryPress?: () => void;
  onClose?: () => void;
  showCloseButton?: boolean;
  icon?: IconName;
  autoDismiss?: number; // Auto dismiss after milliseconds
  dismissOnBackdropPress?: boolean;
  accessibility?: {
    alertTitle?: string;
    alertMessage?: string;
  };
}

const Alert: React.FC<AlertProps> = ({
  visible,
  title,
  message,
  type,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryPress,
  onSecondaryPress,
  onClose,
  showCloseButton = true,
  icon,
  autoDismiss,
  dismissOnBackdropPress = true,
  accessibility,
}) => {
  const scaleValue = useRef(new Animated.Value(0.8)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;
  const autoDismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle keyboard dismissal
  useEffect(() => {
    if (visible) {
      Keyboard.dismiss();
    }
  }, [visible]);

  // Handle auto dismiss
  useEffect(() => {
    // Clear existing timer before creating a new one
    if (autoDismissTimer.current) {
      clearTimeout(autoDismissTimer.current);
      autoDismissTimer.current = null;
    }

    if (visible && autoDismiss && autoDismiss > 0) {
      autoDismissTimer.current = setTimeout(() => {
        onClose?.();
      }, autoDismiss);
    }

    return () => {
      if (autoDismissTimer.current) {
        clearTimeout(autoDismissTimer.current);
        autoDismissTimer.current = null;
      }
    };
  }, [visible, autoDismiss, onClose]);

  // Announce to screen readers
  useEffect(() => {
    if (visible) {
      AccessibilityInfo.announceForAccessibility(`${title}. ${message}`);
    }
  }, [visible, title, message]);

  // Animation
  useEffect(() => {
    const animationConfig = {
      duration: 300,
      useNativeDriver: true,
    };

    if (visible) {
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 10,
          restDisplacementThreshold: 0.001,
          restSpeedThreshold: 0.001,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          ...animationConfig,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 0.8,
          ...animationConfig,
        }),
        Animated.timing(opacityValue, {
          toValue: 0,
          ...animationConfig,
        }),
      ]).start();
    }

    // Clean up animations on unmount
    return () => {
      scaleValue.setValue(0.8);
      opacityValue.setValue(0);
    };
  }, [visible, scaleValue, opacityValue]);

  const getIcon = (): IconName => {
    if (icon) return icon;

    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'close-circle';
      case 'warning':
        return 'warning';
      case 'info':
        return 'information-circle';
      case 'confirm':
        return 'help-circle';
      default:
        return 'information-circle';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'success':
        return '#34C759';
      case 'error':
        return '#FF3B30';
      case 'warning':
        return '#FF9500';
      case 'info':
        return '#007AFF';
      case 'confirm':
        return '#5856D6';
      default:
        return '#007AFF';
    }
  };

  const handleBackdropPress = () => {
    if (dismissOnBackdropPress && onClose) {
      onClose();
    }
  };

  const handlePrimaryPress = () => {
    onPrimaryPress();
    if (autoDismissTimer.current) {
      clearTimeout(autoDismissTimer.current);
      autoDismissTimer.current = null;
    }
  };

  const handleSecondaryPress = () => {
    onSecondaryPress?.();
    if (autoDismissTimer.current) {
      clearTimeout(autoDismissTimer.current);
      autoDismissTimer.current = null;
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
      hardwareAccelerated
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={handleBackdropPress}
        accessibilityLabel="Close alert"
        accessibilityRole="button"
      >
        <BlurView
          intensity={Platform.OS === 'ios' ? 50 : 20}
          style={styles.blurContainer}
          tint="dark"
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalTouchable}>
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  opacity: opacityValue,
                  transform: [{ scale: scaleValue }],
                },
              ]}
              accessibilityViewIsModal
              accessible
              accessibilityLabel={accessibility?.alertTitle || title}
              accessibilityHint={accessibility?.alertMessage || message}
            >
              <View style={styles.alertBox}>
                {showCloseButton && onClose && (
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={onClose}
                    accessibilityLabel="Close alert"
                    accessibilityRole="button"
                  >
                    <Ionicons name="close" size={24} color="#8E8E93" />
                  </TouchableOpacity>
                )}

                <View style={styles.iconContainer}>
                  <Ionicons
                    name={getIcon()}
                    size={64}
                    color={getColor()}
                    accessibilityElementsHidden
                  />
                </View>

                <Text style={styles.title} accessibilityRole="header">
                  {title}
                </Text>

                <Text style={styles.message} accessibilityRole="text">
                  {message}
                </Text>

                <View style={styles.buttonContainer}>
                  {secondaryButtonText && onSecondaryPress && (
                    <TouchableOpacity
                      style={[styles.button, styles.secondaryButton]}
                      onPress={handleSecondaryPress}
                      accessibilityLabel={secondaryButtonText}
                      accessibilityRole="button"
                    >
                      <Text style={styles.secondaryButtonText}>
                        {secondaryButtonText}
                      </Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={[
                      styles.button,
                      styles.primaryButton,
                      { backgroundColor: getColor() },
                    ]}
                    onPress={handlePrimaryPress}
                    accessibilityLabel={primaryButtonText}
                    accessibilityRole="button"
                  >
                    <Text style={styles.primaryButtonText}>
                      {primaryButtonText}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </BlurView>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTouchable: {
    width: width - 80,
    maxWidth: 400,
  },
  modalContainer: {
    width: '100%',
  },
  alertBox: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
    zIndex: 1,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primaryButton: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButton: {
    backgroundColor: '#F2F2F7',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Alert;
