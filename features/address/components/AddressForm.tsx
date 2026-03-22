import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Button } from '@/core/ui/Button';
import { Text } from '@/core/ui/Text';
import { addressTextSchema } from '@/shared/utils/addressValidator';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useAddressForm } from '../hooks/useAddressForm';
import { useAddressValidation } from '../hooks/useAddressValidation';
import { useGeocodingLogic } from '../hooks/useGeocodingLogic';
import { useLocationLogic } from '../hooks/useLocationLogic';
import { AddressFormErrors, AddressFormProps } from '../address.types';
import { AddressFormInputs } from './AddressFormInputs';
import { AddressGeocodeInfo } from './AddressGeocodeInfo';
import { AddressTabs } from './AddressTabs';

/**
 * AddressForm Component
 *
 * Main address form component for adding and editing user addresses.
 * Uses custom hooks for location detection, geocoding, and form validation.
 * Composes smaller sub-components like AddressTabs and AddressFormInputs.
 * Handles both add and edit modes based on 'address' prop presence.
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
  const { validateForm } = useAddressValidation();

  // Location services: Provides current location fetching and integration.
  // Updates form coordinates when user selects current location.
  // 'address' passed to avoid resetting during edit mode.
  const {
    currentLocation,
    locationLoading,
    permissionStatus,
    refetchLocation,
    openSettings,
    handleUseCurrentLocation,
  } = useLocationLogic(
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
    permissionStatus,
    formState.pincode,
    formState.state,
    formState.city,
    address,
  );


  // handleSave: Validates form and constructs CreateAddressData for parent callback.
  // Only proceeds if validation passes; prevents invalid data submission.
  // Maps internal form state to API-expected structure.
  const handleSave = () => {
    if (!validateForm(formState, formState.setErrors)) return;
    onSave({
      label: formState.label,
      address: formState.addressText,
      pincode: formState.pincode,
      city: formState.city,
      state: formState.state,
      lng: formState.lng,
      lat: formState.lat,
    });
  };

  // Determines edit mode based on address prop presence.
  const isEdit = !!address;
  const clearFieldError = (field: keyof AddressFormErrors) => {
    formState.setErrors((prev: AddressFormErrors) => {
      if (!prev[field]) return prev;
      return { ...prev, [field]: undefined };
    });
  };

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

      {/* Location Buttons: Enhanced UX for setting current location. */}
      <View style={styles.locationButtonsContainer}>
        {permissionStatus === 'granted' && (
          <TouchableOpacity
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
          </TouchableOpacity>
        )}
      </View>

      {/* Geocode Info: Displays address derived from coordinates.
          Provides feedback on geocoding process. */}
      {/* {permissionStatus === 'granted' && (
        <AddressGeocodeInfo
          geocodeResult={geocodeResult}
          geocodeLoading={geocodeLoading}
        />
        )} */}
      {/* Address Tabs: Selection for address label (Home, Work, etc.).
         Updates form label state. */}
      <AddressTabs label={formState.label} onLabelChange={formState.setLabel} />

      {/* Form Inputs: Text fields for address details.
         Controlled inputs linked to form state. */}
      <AddressFormInputs
        addressText={formState.addressText}
        onAddressTextChange={(text) => {
          formState.setAddressText(text);
          const result = addressTextSchema.safeParse(text);
          formState.setErrors((prev: AddressFormErrors) => ({
            ...prev,
            addressText: result.success
              ? undefined
              : result.error.issues[0]?.message,
          }));
        }}
        pincode={formState.pincode}
        onPincodeChange={(text) => {
          formState.setPincode(text);
          clearFieldError('pincode');
        }}
        state={formState.state}
        onStateChange={(text) => {
          formState.setState(text);
          clearFieldError('state');
        }}
        city={formState.city}
        onCityChange={(text) => {
          formState.setCity(text);
          clearFieldError('city');
        }}
        errors={formState.errors}
      />

      {/* Location Permission Message */}
      {permissionStatus !== 'granted' && (
        <View style={styles.permissionContainer}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={colors.error}
          />
          <View style={styles.permissionTextContainer}>
            <Text variant="s" color={colors.error} weight="medium">
              {permissionStatus === 'denied'
                ? 'Location permission is denied. Please enable it in your app settings to save an address and see nearby products.'
                : 'Location permission is required to save an address and to show nearby products.'}
            </Text>
            <TouchableOpacity
              onPress={
                permissionStatus === 'denied' ? openSettings : refetchLocation
              }
              style={styles.retryButton}
            >
              <Text variant="s" color={colors.primary} weight="bold">
                {permissionStatus === 'denied'
                  ? 'Open App Settings'
                  : 'Retry Enabling Permission'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Save Button: Triggers validation and save.
         Disabled during pending state or when location is missing to prevent invalid submissions. */}
      <Button
        title={isPending ? 'Saving...' : 'Save'}
        onPress={handleSave}
        loading={isPending}
        disabled={isPending || permissionStatus !== 'granted'}
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
  permissionContainer: {
    flexDirection: 'row',
    backgroundColor: colors.error + '10', // 10% opacity for subtle background
    padding: spacing.m,
    borderRadius: spacing.radius.m,
    marginTop: spacing.m,
    gap: spacing.s,
    alignItems: 'flex-start',
  },
  permissionTextContainer: {
    flex: 1,
    gap: spacing.xs,
  },
  retryButton: {
    marginTop: spacing.xs,
  },
});
