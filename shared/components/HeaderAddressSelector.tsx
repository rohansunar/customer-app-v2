import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Text } from '@/core/ui/Text';
import { AddressPickerModal } from '@/features/address/components/AddressPickerModal';
import { useAddresses } from '@/features/address/hooks/useAddresses';
import { addressModalEvents } from '@/shared/events/addressModalEvents';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export function HeaderAddressSelector() {
  const { data: addresses } = useAddresses();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [startInAddMode, setStartInAddMode] = useState(false);

  const defaultAddress = addresses?.find((a) => a.isDefault) || addresses?.[0];

  // Allow other screens (e.g., Home CTA) to open the modal directly in add mode
  useEffect(() => {
    const unsubscribe = addressModalEvents.subscribe((event) => {
      if (event.mode === 'add') {
        setStartInAddMode(true);
        setIsModalVisible(true);
      }
    });
    // Return the cleanup function directly - must return void or a destructor, not another function
    return function cleanup() {
      unsubscribe();
    };
  }, []);

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setStartInAddMode(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
        style={styles.container}
        activeOpacity={0.7}
      >
        <View style={styles.content}>
          <View style={styles.row}>
            <Ionicons name="location" size={16} color={colors.surface} />
            <Text
              variant="s"
              weight="bold"
              color={colors.surface}
              style={styles.label}
              numberOfLines={1}
            >
              {defaultAddress?.label || 'Select Address'}
            </Text>
            <Ionicons name="chevron-down" size={14} color={colors.surface} />
          </View>
          <Text
            variant="xs"
            color="rgba(255, 255, 255, 0.8)"
            numberOfLines={1}
            style={styles.addressSnippet}
          >
            {defaultAddress?.address || 'Tap to set your location'}
          </Text>
        </View>
      </TouchableOpacity>

      <AddressPickerModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        startInAddMode={startInAddMode}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: spacing.m,
    maxWidth: '70%',
  },
  content: {
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginHorizontal: spacing.xs,
  },
  addressSnippet: {
    marginLeft: 20, // Align with text after location icon
  },
});
