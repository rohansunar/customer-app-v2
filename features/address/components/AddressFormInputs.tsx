import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Input } from '@/core/ui/Input';
import { Text } from '@/core/ui/Text';
import { Picker } from '@react-native-picker/picker';
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
  cityId,
  onCityIdChange,
  cities,
  isCitiesLoading,
}: AddressFormInputsProps) {
  return (
    <>
      <Input
        label="Full Address (Street, Building, etc)"
        value={addressText}
        onChangeText={onAddressTextChange}
        multiline
        placeholder="e.g. 123 Main St"
      />

      <View style={styles.rowInputs}>
        <View style={styles.halfInput}>
          <Input
            label="Pincode"
            value={pincode}
            onChangeText={onPincodeChange}
            keyboardType="numeric"
            placeholder="e.g. 560001"
          />
        </View>
        <View style={styles.halfInput}>
          <Input
            label="State"
            value={state}
            onChangeText={onStateChange}
            placeholder="e.g. Karnataka"
          />
        </View>
      </View>

      <Text variant="s" color={colors.textSecondary} style={styles.label}>
        City
      </Text>
      <View
        style={[styles.pickerWrapper, isCitiesLoading && styles.disabledPicker]}
      >
        <Picker
          selectedValue={cityId}
          onValueChange={onCityIdChange}
          enabled={!isCitiesLoading}
        >
          <Picker.Item
            label={isCitiesLoading ? 'Loading Cities...' : 'Select City'}
            value=""
          />
          {cities?.map((city: any) => (
            <Picker.Item key={city.id} label={city.name} value={city.id} />
          ))}
        </Picker>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: spacing.xs,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.radius.m,
    marginBottom: spacing.m,
  },
  disabledPicker: {
    opacity: 0.5,
    backgroundColor: colors.border,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: spacing.m,
  },
  halfInput: {
    flex: 1,
  },
});
