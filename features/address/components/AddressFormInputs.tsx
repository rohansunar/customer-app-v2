import { spacing } from '@/core/theme/spacing';
import { Input } from '@/core/ui/Input';
import { Text } from '@/core/ui/Text';
import { StyleSheet } from 'react-native';
import { AddressFormInputsProps } from '../types';

/**
 * Sub-component for rendering the form input fields.
 * Includes address text, pincode, state, and city picker.
 *
 * @param addressText - Full address text
 * @param onAddressTextChange - Callback for address text changes
 * @param pincode - Pincode value
 * @param onPincodeChange - Callback for pincode changes
 * @param state - State value
 * @param onStateChange - Callback for state changes
 * @param cityId - Selected city ID
 * @param onCityIdChange - Callback for city selection
 * @param cities - List of available cities
 * @param isCitiesLoading - Loading state for cities
 */
export function AddressFormInputs({
  addressText,
  onAddressTextChange,
  pincode,
  onPincodeChange,
  state,
  onStateChange,
  addressError,
}: AddressFormInputsProps) {
  return (
    <>
      <Input
        label="Full Address (Street, Building, etc)"
        value={addressText}
        onChangeText={onAddressTextChange}
        multiline
        placeholder="e.g. Flat 12, 123 Main St"
        error={!!addressError}
      />
      {addressError && <Text style={styles.errorText}>{addressError}</Text>}
    </>
  );
}

const styles = StyleSheet.create({
  rowInputs: {
    flexDirection: 'row',
    gap: spacing.m,
  },
  halfInput: {
    flex: 1,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginBottom: 4,
  },
});
