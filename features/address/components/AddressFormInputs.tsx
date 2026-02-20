import { spacing } from '@/core/theme/spacing';
import { Input } from '@/core/ui/Input';
import { Text } from '@/core/ui/Text';
import { StyleSheet, View } from 'react-native';
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
  city,
  onCityChange,
  errors = {},
}: AddressFormInputsProps) {
  return (
    <>
      <Input
        label="Full Address (Street, Building, etc)"
        value={addressText}
        onChangeText={onAddressTextChange}
        multiline
        placeholder="e.g. Flat 12, 123 Main St"
        error={!!errors.addressText}
      />
      {errors.addressText && (
        <Text style={styles.errorText}>{errors.addressText}</Text>
      )}

      <View style={styles.rowInputs}>
        <View style={styles.halfInput}>
          <Input
            label="State"
            value={state}
            onChangeText={onStateChange}
            placeholder="e.g. Karnataka"
            error={!!errors.state}
          />
          {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}
        </View>
        <View style={styles.halfInput}>
          <Input
            label="City"
            value={city}
            onChangeText={onCityChange}
            placeholder="e.g. Siliguri"
            error={!!errors.city}
          />
          {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
        </View>
      </View>
      <View style={styles.halfInput}>
        <Input
          label="Pincode"
          value={pincode}
          onChangeText={onPincodeChange}
          keyboardType="number-pad"
          placeholder="e.g. 734001"
          error={!!errors.pincode}
        />
        {errors.pincode && (
          <Text style={styles.errorText}>{errors.pincode}</Text>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: spacing.xs,
  },
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
