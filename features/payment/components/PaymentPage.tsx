import { useCart } from '@/features/cart/hooks/useCart';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useHandlePayment } from '../hooks/useHandlePayment';
import { PaymentMode } from '../types';

/**
 * PaymentPage component allows users to select a payment mode and complete the payment.
 * It displays payment options with visual selection indicators and handles payment processing.
 */
export function PaymentPage() {
   const { data, isLoading, error } = useCart();
   const { handlePayment, isPending } = useHandlePayment(data?.cartId || '');
   const [selectedPaymentMode, setSelectedPaymentMode] = useState<PaymentMode | null>(null);

  const paymentModes: PaymentMode[] = ['Cash', 'Online', 'Monthly'];

  // Loading state view
  const renderLoadingView = (): React.ReactElement => (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#007bff" />
      <Text style={styles.loadingText}>Loading cart...</Text>
    </View>
  );

  // Error state view
  const renderErrorView = (): React.ReactElement => (
    <View style={styles.center}>
      <Text style={styles.errorText}>Error loading cart</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => router.push('/dashboard')}
        accessibilityLabel="Go to Dashboard"
        accessibilityRole="button"
        accessibilityHint="Navigates to the dashboard"
      >
        <Text style={styles.retryText}>Go to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );

  // Main payment content view
  const renderPaymentContent = (): React.ReactElement => (
    <View style={styles.content}>
      <Text style={styles.instructionText}>Select Payment Mode:</Text>
      <View style={styles.optionsContainer}>
        {paymentModes.map((mode) => (
          <TouchableOpacity
            key={mode}
            style={[
              styles.optionButton,
              selectedPaymentMode === mode && styles.selectedOption,
            ]}
            onPress={() => setSelectedPaymentMode(mode)}
            accessibilityLabel={`Select ${mode} payment`}
            accessibilityRole="button"
            accessibilityHint={`Selects ${mode} as the payment mode`}
          >
            <Text
              style={[
                styles.optionText,
                selectedPaymentMode === mode && styles.selectedOptionText,
              ]}
            >
              {mode}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.completeButton,
            (!selectedPaymentMode || isPending) && styles.disabledButton,
          ]}
          onPress={() => handlePayment(selectedPaymentMode!)}
          disabled={!selectedPaymentMode || isPending}
          accessibilityLabel="Complete Payment"
          accessibilityRole="button"
          accessibilityHint="Processes the payment with selected mode"
        >
          {isPending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.completeText}>Complete</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderContent = (): React.ReactElement => {
    if (isLoading) return renderLoadingView();
    if (error) return renderErrorView();
    return renderPaymentContent();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push('/dashboard')}
          style={styles.backButton}
          accessibilityLabel="Back to dashboard"
          accessibilityRole="button"
          accessibilityHint="Go back to the dashboard"
        >
          <Ionicons name="arrow-back" size={24} color="#007bff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Payment</Text>
        <View style={styles.placeholder} />
      </View>
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    flex: 1,
  },
  backButton: {
    padding: 4,
  },
  placeholder: {
    width: 50,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 10,
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  instructionText: {
    fontSize: 16,
    color: '#111',
    marginBottom: 16,
  },
  optionsContainer: {
    marginBottom: 32,
  },
  optionButton: {
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  selectedOption: {
    borderColor: '#007bff',
    backgroundColor: '#e3f2fd',
  },
  optionText: {
    fontSize: 16,
    color: '#111',
    textAlign: 'center',
  },
  selectedOptionText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    paddingTop: 16,
  },
  completeButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  completeText: {
    fontSize: 16,
    color: '#fff',
  },
});