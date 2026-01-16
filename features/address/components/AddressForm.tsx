import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Button } from '@/core/ui/Button';
import { Text } from '@/core/ui/Text';
import { useCities } from '@/features/city/hooks/useCities';
import { Ionicons } from '@expo/vector-icons';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { useAddressForm } from '../hooks/useAddressForm';
import { useAddressValidation } from '../hooks/useAddressValidation';
import { useMapInteractions } from '../hooks/useMapInteractions';
import { AddressFormProps } from '../types';
import { AddressFormInputs } from './AddressFormInputs';
import { AddressGeocodeInfo } from './AddressGeocodeInfo';
import { AddressMapSection } from './AddressMapSection';
import { AddressTabs } from './AddressTabs';

/**
 * Main address form component refactored for SOLID principles.
 * Composes smaller, single-responsibility sub-components and custom hooks.
 *
 * @param address - Optional existing address for editing
 * @param onSave - Callback to save the address
 * @param onCancel - Callback to cancel the form
 * @param isPending - Loading state for save operation
 */
export function AddressForm({
  address,
  onSave,
  onCancel,
  isPending,
}: AddressFormProps) {
  const { data: cities, isLoading: isCitiesLoading } = useCities();

  // Form state management
  const formState = useAddressForm(address);

  // Map and location interactions
  const {
    geocodeResult,
    geocodeLoading,
    locationLoading,
    handleUseCurrentLocation,
    handleMapRegionChange,
    handleFillFromMap,
  } = useMapInteractions(
    formState.lat,
    formState.lng,
    formState.setLat,
    formState.setLng,
    formState.setAddressText,
    formState.setPincode,
    formState.setState,
    address,
    formState.addressText,
    formState.pincode,
  );

  // Validation
  const { validateForm } = useAddressValidation();

  const handleSave = () => {
    if (validateForm(formState)) {
      onSave({
        label: formState.label,
        address: formState.addressText,
        pincode: formState.pincode,
        cityId: formState.cityId,
        location: { lng: formState.lng, lat: formState.lat },
      });
    }
  };

  const isEdit = !!address;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text variant="l" weight="bold">
          {isEdit ? 'Edit Address' : 'Add Address'}
        </Text>
        <TouchableOpacity onPress={onCancel}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Map Section */}
      <AddressMapSection
        lat={formState.lat}
        lng={formState.lng}
        onRegionChange={handleMapRegionChange}
      />

      {/* Location Buttons */}
      <View style={styles.locationButtonsContainer}>
        {/* <TouchableOpacity
          style={[styles.locationButton, { backgroundColor: colors.primary }]}
          onPress={handleUseCurrentLocation}
          disabled={locationLoading}
        >
          {locationLoading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <>
              <Ionicons name="locate" size={20} color={colors.white} />
              <Text
                variant="s"
                color={colors.white}
                weight="medium"
                style={styles.buttonText}
              >
                Use Current Location
              </Text>
            </>
          )}
        </TouchableOpacity> */}

        {geocodeResult && (
          <TouchableOpacity
            style={[
              styles.locationButton,
              { backgroundColor: colors.secondary },
            ]}
            onPress={handleFillFromMap}
          >
            <Ionicons name="download" size={20} color={colors.white} />
            <Text
              variant="s"
              color={colors.white}
              weight="medium"
              style={styles.buttonText}
            >
              Fill from Map
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Geocode Info */}
      <AddressGeocodeInfo
        geocodeResult={geocodeResult}
        geocodeLoading={geocodeLoading}
      />

      {/* Address Tabs */}
      <AddressTabs label={formState.label} onLabelChange={formState.setLabel} />

      {/* Form Inputs */}
      <AddressFormInputs
        addressText={formState.addressText}
        onAddressTextChange={formState.setAddressText}
        pincode={formState.pincode}
        onPincodeChange={formState.setPincode}
        state={formState.state}
        onStateChange={formState.setState}
        cityId={formState.cityId}
        onCityIdChange={formState.setCityId}
        cities={cities}
        isCitiesLoading={isCitiesLoading}
      />

      <Button
        title={isPending ? 'Saving...' : 'Save'}
        onPress={handleSave}
        loading={isPending}
        style={styles.saveButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
  },
  content: {
    padding: spacing.l,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  locationButtonsContainer: {
    flexDirection: 'row',
    gap: spacing.s,
    marginBottom: spacing.m,
  },
  locationButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.s,
    borderRadius: spacing.radius.m,
    gap: spacing.xs,
  },
  buttonText: {
    marginLeft: spacing.xs,
  },
  saveButton: {
    marginTop: spacing.m,
  },
});
