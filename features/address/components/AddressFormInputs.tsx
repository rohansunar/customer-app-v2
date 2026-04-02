import { spacing } from '@/core/theme/spacing';
import { Input } from '@/core/ui/Input';
import { Text } from '@/core/ui/Text';
import { StyleSheet, View } from 'react-native';
import { AddressFormInputsProps } from '../address.types';
import { FamilyMembersInput } from './FamilyMembersInput';

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
  isEdit = false,
  familyMembersCount,
  onFamilyMembersCountChange,
  nearLandmark,
  onNearLandmarkChange,
  onClearError,
}: AddressFormInputsProps) {
  const handleAddressTextChange = (text: string) => {
    onAddressTextChange(text);
    if (errors.addressText && onClearError) {
      onClearError('addressText');
    }
  };

  const handlePincodeChange = (text: string) => {
    onPincodeChange(text);
    if (errors.pincode && onClearError) {
      onClearError('pincode');
    }
  };

  const handleStateChange = (text: string) => {
    onStateChange(text);
    if (errors.state && onClearError) {
      onClearError('state');
    }
  };

  const handleCityChange = (text: string) => {
    onCityChange(text);
    if (errors.city && onClearError) {
      onClearError('city');
    }
  };

  return (
    <>
      <Input
        label="Full Address (Street, Building, etc)"
        value={addressText}
        onChangeText={handleAddressTextChange}
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
            onChangeText={handleStateChange}
            placeholder="e.g. Mahastarhra"
            error={!!errors.state}
            editable={!isEdit}
          />
          {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}
        </View>
        <View style={styles.halfInput}>
          <Input
            label="City"
            value={city}
            onChangeText={handleCityChange}
            placeholder="e.g. Mumbai"
            error={!!errors.city}
            editable={!isEdit}
          />
          {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
        </View>
      </View>
      <View style={styles.halfInput}>
        <Input
          label="Pincode"
          value={pincode}
          onChangeText={handlePincodeChange}
          keyboardType="number-pad"
          placeholder="e.g. 400002"
          error={!!errors.pincode}
          editable={!isEdit}
        />
        {errors.pincode && (
          <Text style={styles.errorText}>{errors.pincode}</Text>
        )}
      </View>

      <FamilyMembersInput
        label="Family Members"
        value={familyMembersCount}
        onChange={onFamilyMembersCountChange}
        error={errors.familyMembersCount}
      />
      <Input
        label="Nearby Landmark (Optional)"
        value={nearLandmark}
        onChangeText={onNearLandmarkChange}
        placeholder="e.g. Opposite Park"
      />
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: spacing.xs,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: spacing.s,
  },
  halfInput: {
    flex: 1,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: spacing.xxs,
    marginBottom: spacing.xs,
  },
  helperText: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 4,
  },
});
