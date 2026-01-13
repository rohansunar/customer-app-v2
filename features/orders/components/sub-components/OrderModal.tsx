import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Text } from '@/core/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

interface OrderModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export default function OrderModal({
  visible,
  onClose,
  onConfirm,
}: OrderModalProps) {
  const [cancelReason, setCancelReason] = useState('Changed my mind');

  const handleConfirm = () => {
    onConfirm(cancelReason);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <Text
            variant="l"
            weight="bold"
            color={colors.textPrimary}
            style={styles.title}
          >
            Cancel Order
          </Text>
          <Text
            variant="s"
            color={colors.textSecondary}
            style={styles.subtitle}
          >
            Please select a reason for cancelling your order:
          </Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={cancelReason}
              onValueChange={(itemValue) => setCancelReason(itemValue)}
            >
              <Picker.Item label="Changed my mind" value="Changed my mind" />
              <Picker.Item label="Wrong item" value="Wrong item" />
              <Picker.Item label="Delivery delay" value="Delivery delay" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
            activeOpacity={0.8}
          >
            <Text variant="m" weight="bold" color={colors.surface}>
              Confirm Cancellation
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: {
    backgroundColor: colors.surface,
    padding: spacing.l,
    borderRadius: spacing.radius.l,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    position: 'relative',
  },
  closeIcon: {
    position: 'absolute',
    top: spacing.m,
    right: spacing.m,
    zIndex: 1,
  },
  title: {
    marginBottom: spacing.s,
    textAlign: 'center',
    marginTop: spacing.s,
  },
  subtitle: {
    marginBottom: spacing.m,
    textAlign: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.radius.m,
    marginBottom: spacing.l,
    backgroundColor: colors.background,
  },
  confirmButton: {
    backgroundColor: colors.error,
    paddingVertical: spacing.m,
    borderRadius: spacing.radius.m,
    alignItems: 'center',
  },
});
