import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Button } from '@/core/ui/Button';
import { Text } from '@/core/ui/Text';
import { useForwardGeocode } from '@/features/map/hooks/useForwardGeocode';
import { addressTextSchema } from '@/shared/utils/addressValidator';
import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAddressForm } from '../hooks/useAddressForm';
import { useAddressValidation } from '../hooks/useAddressValidation';
import { AddressFormErrors, AddressFormProps } from '../address.types';
import { useGeocodingLogic } from '../hooks/useGeocodingLogic';
import { useLocationLogic } from '../hooks/useLocationLogic';
import { AddressGeocodeInfo } from './AddressGeocodeInfo';
import { AddressFormInputs } from './AddressFormInputs';
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
  serverError,
  fieldErrors,
  onClearFieldError,
}: AddressFormProps) {
  const formState = useAddressForm(address);
  const { validateForm } = useAddressValidation();
  const { geocodeAddress, loading: manualGeocodeLoading } = useForwardGeocode();
  const isEdit = !!address;

  const {
    locationLoading,
    permissionStatus,
    openSettings,
    handleUseCurrentLocation,
  } = useLocationLogic(formState.setLat, formState.setLng);

  const { geocodeResult, geocodeLoading } = useGeocodingLogic(
    formState.lat,
    formState.lng,
    formState.setPincode,
    formState.setState,
    formState.setCity,
    formState.pincode,
    formState.state,
    formState.city,
    address,
    formState.pincodeDirty,
    formState.cityDirty,
    formState.stateDirty,
  );

  const clearFieldError = (field: keyof AddressFormErrors) => {
    formState.setErrors((prev: AddressFormErrors) => {
      if (!prev[field]) return prev;
      return { ...prev, [field]: undefined };
    });
  };

  const clearLocationError = () => {
    clearFieldError('location');
  };

  const shouldResolveCoordinatesFromAddress =
    !formState.lng ||
    !formState.lat ||
    formState.addressTextDirty ||
    formState.pincodeDirty ||
    formState.cityDirty ||
    formState.stateDirty;

  const handleSave = async () => {
    if (!validateForm(formState, formState.setErrors, isEdit)) return;

    clearLocationError();

    let nextLat = formState.lat;
    let nextLng = formState.lng;

    if (shouldResolveCoordinatesFromAddress) {
      const resolvedCoordinates = await geocodeAddress({
        addressText: formState.addressText,
        city: formState.city,
        state: formState.state,
        pincode: formState.pincode,
      });

      if (!resolvedCoordinates) {
        formState.setErrors((prev: AddressFormErrors) => ({
          ...prev,
          location:
            'We could not match this address to a delivery location. Review the address details or use your current location.',
        }));
        return;
      }

      nextLat = resolvedCoordinates.latitude;
      nextLng = resolvedCoordinates.longitude;
      formState.setLat(nextLat);
      formState.setLng(nextLng);
    }

    onSave({
      label: formState.label,
      address: formState.addressText,
      pincode: formState.pincode,
      city: formState.city,
      state: formState.state,
      nearLandmark: formState.nearLandmark,
      familyMembersCount: formState.familyMembersCount,
      lng: nextLng,
      lat: nextLat,
    });
  };

  const handleUseCurrentLocationPress = async () => {
    const didResolveLocation = await handleUseCurrentLocation();
    if (didResolveLocation) {
      clearLocationError();
    }
  };

  const combinedErrors: AddressFormErrors = {
    ...formState.errors,
    ...fieldErrors,
  };

  const handleClearFieldError = (field: keyof AddressFormErrors) => {
    formState.setErrors((prev: AddressFormErrors) => ({
      ...prev,
      [field]: undefined,
    }));
    if (onClearFieldError) {
      onClearFieldError(field);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text variant="l" weight="bold">
            {isEdit ? 'Edit Address' : 'Add Address'}
          </Text>
          <TouchableOpacity onPress={onCancel}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.locationInfoCard}>
          <View style={styles.locationInfoHeader}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={colors.primary}
            />
            <Text variant="m" weight="bold">
              Use Current Location
            </Text>
          </View>
          <Text
            variant="s"
            color={colors.textSecondary}
            style={styles.locationInfoDescription}
          >
            We use your location to show products available near your delivery
            address.
          </Text>
          <View style={styles.locationButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.locationButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={() => {
                void handleUseCurrentLocationPress();
              }}
              disabled={locationLoading || isPending || manualGeocodeLoading}
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
            {permissionStatus === 'denied' && (
              <TouchableOpacity
                style={styles.locationButtonSecondary}
                onPress={openSettings}
                disabled={locationLoading || isPending || manualGeocodeLoading}
              >
                <Text
                  variant="s"
                  color={colors.primary}
                  weight="medium"
                  style={styles.secondaryButtonText}
                >
                  Open App Settings
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {permissionStatus === 'denied' && (
            <Text variant="xs" color={colors.warning} style={styles.helperText}>
              Location access is off. You can still continue by entering the
              address manually.
            </Text>
          )}
        </View>

        <AddressTabs
          label={formState.label}
          onLabelChange={formState.setLabel}
        />

        <AddressFormInputs
          addressText={formState.addressText}
          onAddressTextChange={(text) => {
            formState.setAddressText(text);
            formState.setAddressTextDirty(true);
            clearLocationError();
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
            formState.setPincodeDirty(true);
            clearLocationError();
            clearFieldError('pincode');
          }}
          state={formState.state}
          onStateChange={(text) => {
            formState.setState(text);
            formState.setStateDirty(true);
            clearLocationError();
            clearFieldError('state');
          }}
          city={formState.city}
          onCityChange={(text) => {
            formState.setCity(text);
            formState.setCityDirty(true);
            clearLocationError();
            clearFieldError('city');
          }}
          errors={combinedErrors}
          onClearError={handleClearFieldError}
          nearLandmark={formState.nearLandmark}
          onNearLandmarkChange={formState.setNearLandmark}
          familyMembersCount={formState.familyMembersCount}
          onFamilyMembersCountChange={formState.setFamilyMembersCount}
        />

        {(combinedErrors.location ||
          combinedErrors.label ||
          combinedErrors.global ||
          combinedErrors.serverError) && (
          <View style={styles.formErrorContainer}>
            <Ionicons name="alert-circle" size={20} color={colors.error} />
            <Text variant="s" color={colors.error} style={styles.formErrorText}>
              {combinedErrors.location ||
                combinedErrors.label ||
                combinedErrors.global ||
                combinedErrors.serverError}
            </Text>
          </View>
        )}

        <Button
          title={
            isPending
              ? 'Saving...'
              : manualGeocodeLoading
                ? 'Resolving Address...'
                : 'Save'
          }
          onPress={() => {
            void handleSave();
          }}
          loading={isPending || manualGeocodeLoading}
          disabled={isPending || manualGeocodeLoading || locationLoading}
          style={styles.saveButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.m,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  locationInfoCard: {
    backgroundColor: colors.background,
    borderRadius: spacing.radius.m,
    padding: spacing.m,
    marginBottom: spacing.m,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  locationInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  locationInfoDescription: {
    lineHeight: 20,
  },
  locationButtonsContainer: {
    flexDirection: 'row',
    gap: spacing.s,
    marginTop: spacing.xs,
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
  locationButtonSecondary: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.s,
    borderRadius: spacing.radius.m,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  buttonText: {
    marginLeft: spacing.xs,
  },
  secondaryButtonText: {
    textAlign: 'center',
  },
  helperText: {
    lineHeight: 18,
  },
  saveButton: {
    marginTop: spacing.m,
  },
  formErrorContainer: {
    flexDirection: 'row',
    backgroundColor: colors.error + '10',
    padding: spacing.m,
    borderRadius: spacing.radius.m,
    marginTop: spacing.m,
    gap: spacing.s,
    alignItems: 'center',
  },
  formErrorText: {
    flex: 1,
  },
});
