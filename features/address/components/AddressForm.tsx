import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Button } from '@/core/ui/Button';
import { Text } from '@/core/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useAddressForm } from '../hooks/useAddressForm';
import { useAddressValidation } from '../hooks/useAddressValidation';
import { useGeocodingLogic } from '../hooks/useGeocodingLogic';
import { useLocationLogic } from '../hooks/useLocationLogic';
import { useMapLogic } from '../hooks/useMapLogic';
import { AddressFormProps } from '../types';
import { AddressFormInputs } from './AddressFormInputs';
import { AddressGeocodeInfo } from './AddressGeocodeInfo';
import { AddressMapSection } from './AddressMapSection';
import { AddressTabs } from './AddressTabs';

/**
 * AddressForm Component
 *
 * Main address form component refactored for SOLID principles and clean architecture.
 * Composes smaller, single-responsibility sub-components (e.g., AddressMapSection, AddressTabs) and custom hooks for logic separation.
 * Handles both add and edit modes based on 'address' prop presence.
 * Integrates map, geocoding, and location services for rich address input.
 * Validates form data before saving and provides user feedback.
 * Why this design: Separates concerns (UI, logic, data) for testability and maintainability.
 * Dependencies: Relies on custom hooks for state management and external services.
 * Edge cases: Handles loading states, form validation errors, and coordinate updates.
 *
 * @param address - Optional existing address for editing; if provided, pre-fills form
 * @param onSave - Callback invoked with validated CreateAddressData on successful save
 * @param onCancel - Callback to close the form without saving
 * @param isPending - Indicates save operation in progress; disables form to prevent double-submission
 */
export function AddressForm({
  address,
  onSave,
  onCancel,
  isPending,
}: AddressFormProps) {
  // Form state management: Custom hook initializes and manages form fields.
  // Pre-fills with address data if editing; provides setters for updates.
  const formState = useAddressForm(address);

  // Form validation: Hook provides validation logic for form data.
  // Ensures required fields and format correctness before submission.
  const { validateForm, validateFullAddress } = useAddressValidation();

  const [addressError, setAddressError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  //  Debounced validation for address text
  const handleAddressTextChange = (value: string) => {
    formState.setAddressText(value);
    setAddressError(null);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      const error = validateFullAddress(value);
      setAddressError(error);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Map interactions: Hook handles map region changes, updating coordinates in form state.
  // Ensures real-time sync between map position and form data.
  const { handleMapRegionChangeComplete } = useMapLogic(
    formState.lat,
    formState.lng,
    formState.setLat,
    formState.setLng,
  );

  // Location services: Provides current location fetching and integration.
  // Updates form coordinates when user selects current location.
  // 'address' passed to avoid resetting during edit mode.
  const { currentLocation, locationLoading, handleUseCurrentLocation } =
    useLocationLogic(
      formState.lat,
      formState.lng,
      formState.setLat,
      formState.setLng,
      address,
    );

  // Geocoding: Reverse geocodes coordinates to populate address fields automatically.
  // Updates address text, pincode, state, city based on map position.
  // Essential for user-friendly address entry via map interaction.
  const { geocodeResult, geocodeLoading } = useGeocodingLogic(
    formState.lat,
    formState.lng,
    formState.setAddressText,
    formState.setPincode,
    formState.setState,
    formState.setCity,
    address,
  );

  // handleSave: Validates form and constructs CreateAddressData for parent callback.
  // Only proceeds if validation passes; prevents invalid data submission.
  // Maps internal form state to API-expected structure.
  const handleSave = () => {
    const error = validateFullAddress(formState.addressText);
    setAddressError(error);

    if (error) return;

    if (validateForm(formState)) {
      onSave({
        label: formState.label,
        address: formState.addressText,
        pincode: formState.pincode,
        city: formState.city,
        state: formState.state,
        lng: formState.lng,
        lat: formState.lat,
      });
    }
  };

  // Determines edit mode based on address prop presence.
  const isEdit = !!address;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header: Displays mode-specific title and close button for UX. */}
      <View style={styles.header}>
        <Text variant="l" weight="bold">
          {isEdit ? 'Edit Address' : 'Add Address'}
        </Text>
        <TouchableOpacity onPress={onCancel}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Map Section: Interactive map for coordinate selection.
         Updates form state on region changes. */}
      <AddressMapSection
        lat={formState.lat}
        lng={formState.lng}
        onRegionChangeComplete={handleMapRegionChangeComplete}
      />

      {/* Location Buttons: Commented out feature for using current location.
         Could be re-enabled for enhanced UX, with permission handling. */}
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
      </View>

      {/* Geocode Info: Displays address derived from coordinates.
         Provides feedback on geocoding process. */}
      <AddressGeocodeInfo
        geocodeResult={geocodeResult}
        geocodeLoading={geocodeLoading}
      />

      {/* Address Tabs: Selection for address label (Home, Work, etc.).
         Updates form label state. */}
      <AddressTabs label={formState.label} onLabelChange={formState.setLabel} />

      {/* Form Inputs: Text fields for address details.
         Controlled inputs linked to form state. */}
      <AddressFormInputs
        addressText={formState.addressText}
        onAddressTextChange={handleAddressTextChange}
        pincode={formState.pincode}
        onPincodeChange={formState.setPincode}
        state={formState.state}
        onStateChange={formState.setState}
        addressError={addressError}
      />

      {/* Save Button: Triggers validation and save.
         Disabled during pending state to prevent multiple submissions. */}
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
