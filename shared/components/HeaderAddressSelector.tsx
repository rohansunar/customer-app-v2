import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Text } from '@/core/ui/Text';
import { AddressPickerModal } from '@/features/address/components/AddressPickerModal';
import { useAddresses } from '@/features/address/hooks/useAddresses';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export function HeaderAddressSelector() {
  const { data: addresses } = useAddresses();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const defaultAddress = addresses?.find((a) => a.isDefault) || addresses?.[0];

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
        onClose={() => setIsModalVisible(false)}
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
