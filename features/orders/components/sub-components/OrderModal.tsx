import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

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
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
      >
        <View
          style={{
            backgroundColor: '#fff',
            padding: 20,
            borderRadius: 16,
            width: '80%',
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              marginBottom: 16,
              textAlign: 'center',
              fontFamily: 'Inter',
            }}
          >
            Cancel Order
          </Text>
          <Picker
            selectedValue={cancelReason}
            onValueChange={(itemValue) => setCancelReason(itemValue)}
            style={{
              height: 50,
              marginBottom: 16,
            }}
          >
            <Picker.Item label="Changed my mind" value="Changed my mind" />
            <Picker.Item label="Wrong item" value="Wrong item" />
            <Picker.Item label="Delivery delay" value="Delivery delay" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
          <TouchableOpacity
            style={{
              backgroundColor: '#dc3545',
              paddingVertical: 10,
              borderRadius: 8,
              marginBottom: 8,
            }}
            onPress={handleConfirm}
            activeOpacity={0.7}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Confirm cancel order"
          >
            <Text
              style={{
                color: '#fff',
                textAlign: 'center',
                fontSize: 16,
                fontWeight: '600',
                fontFamily: 'Inter',
              }}
            >
              Confirm Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#6c757d',
              paddingVertical: 10,
              borderRadius: 8,
            }}
            onPress={onClose}
            activeOpacity={0.7}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Close modal"
          >
            <Text
              style={{
                color: '#fff',
                textAlign: 'center',
                fontSize: 16,
                fontWeight: '600',
                fontFamily: 'Inter',
              }}
            >
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
