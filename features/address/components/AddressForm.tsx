import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Button } from '@/core/ui/Button';
import { Input } from '@/core/ui/Input';
import { Text } from '@/core/ui/Text';
import { showError, showSuccess } from '@/core/ui/toast';
import { useCities } from '@/features/city/hooks/useCities';
import { MapComponent } from '@/features/map/components/MapComponent';
import { useLocation } from '@/features/map/hooks/useLocation';
import { useReverseGeocode } from '@/features/map/hooks/useReverseGeocode';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { AddressFormProps } from '../types';

export function AddressForm({
  address,
  onSave,
  onCancel,
  isPending,
}: AddressFormProps) {
  const { data: cities, isLoading: isCitiesLoading } = useCities();
  const {
    location: currentLocation,
    loading: locationLoading,
    refetch: refetchLocation,
  } = useLocation();
  const {
    result: geocodeResult,
    loading: geocodeLoading,
    reverseGeocode,
  } = useReverseGeocode();

  const [label, setLabel] = useState(address?.label || 'Home');
  const [addressText, setAddressText] = useState(address?.address || '');
  const [pincode, setPincode] = useState(address?.pincode || '');
  const [cityId, setCityId] = useState(address?.city?.id || '');
  const [lng, setLng] = useState(address?.location?.lng || 0);
  const [lat, setLat] = useState(address?.location?.lat || 0);
  const [state, setState] = useState('');

  useEffect(() => {
    if (address) {
      setLabel(address.label);
      setAddressText(address.address);
      setPincode(address.pincode);
      setCityId(address.city?.id || '');
      setLng(address.location?.lng || 0);
      setLat(address.location?.lat || 0);
    }
  }, [address]);

  // Initialize map with current location or saved location
  useEffect(() => {
    if (!address && currentLocation && lat === 0 && lng === 0) {
      setLat(currentLocation.latitude);
      setLng(currentLocation.longitude);
    }
  }, [currentLocation, address, lat, lng]);

  // Reverse geocode when coordinates change (with debouncing to prevent flickering)
  useEffect(() => {
    if (lat !== 0 && lng !== 0) {
      // Debounce the reverse geocoding to avoid constant updates while dragging
      const timeoutId = setTimeout(() => {
        reverseGeocode(lat, lng);
      }, 800); // Wait 800ms after user stops dragging

      return () => clearTimeout(timeoutId);
    }
  }, [lat, lng, reverseGeocode]);

  // Auto-fill address details from geocode result
  useEffect(() => {
    if (geocodeResult && !address) {
      if (geocodeResult.formattedAddress && !addressText) {
        setAddressText(geocodeResult.formattedAddress);
      }
      if (geocodeResult.postalCode && !pincode) {
        setPincode(geocodeResult.postalCode);
      }
      if (geocodeResult.state) {
        setState(geocodeResult.state);
      }
    }
  }, [geocodeResult, address, addressText, pincode]);

  const handleUseCurrentLocation = () => {
    if (currentLocation) {
      setLat(currentLocation.latitude);
      setLng(currentLocation.longitude);
      showSuccess('Current location set');
    } else {
      refetchLocation();
    }
  };

  const handleMapRegionChange = (region: any) => {
    setLat(region.latitude);
    setLng(region.longitude);
  };

  const handleFillFromMap = () => {
    if (geocodeResult) {
      if (geocodeResult.formattedAddress) {
        setAddressText(geocodeResult.formattedAddress);
      }
      if (geocodeResult.postalCode) {
        setPincode(geocodeResult.postalCode);
      }
      showSuccess('Address details filled from map location');
    }
  };

  const handleSave = () => {
    if (!label) {
      showError('Please select an address type');
      return;
    }
    if (!addressText) {
      showError('Please enter your full address');
      return;
    }
    if (!pincode) {
      showError('Please enter your pincode');
      return;
    }
    if (!cityId) {
      showError('Please select a city');
      return;
    }
    if (!lng || !lat) {
      showError('Please select a location on the map');
      return;
    }
    onSave({
      label,
      address: addressText,
      pincode,
      cityId,
      location: { lng, lat },
    });
  };

  const isEdit = !!address;
  const hasValidCoordinates = lat !== 0 && lng !== 0;

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

      {/* Map View - Always visible at the top */}
      {hasValidCoordinates && (
        <View style={styles.mapContainer}>
          <MapComponent
            region={{
              latitude: lat,
              longitude: lng,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            onRegionChange={handleMapRegionChange}
            height={250}
          />
          <View style={styles.mapOverlay}>
            <Ionicons name="location-sharp" size={40} color={colors.error} />
          </View>
          <View style={styles.mapInfoOverlay}>
            <Text variant="xs" color={colors.white} weight="medium">
              Drag map to select location
            </Text>
          </View>
        </View>
      )}

      {/* Location Buttons */}
      <View style={styles.locationButtonsContainer}>
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

      {/* Address Details from Geocoding */}
      {geocodeResult && (
        <View style={styles.geocodeInfo}>
          {geocodeLoading && (
            <View style={styles.geocodeLoadingRow}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text
                variant="xs"
                color={colors.textSecondary}
                style={styles.loadingText}
              >
                Detecting address...
              </Text>
            </View>
          )}
          <View style={styles.geocodeRow}>
            <Ionicons name="location" size={16} color={colors.primary} />
            <Text
              variant="xs"
              color={colors.textSecondary}
              numberOfLines={2}
              style={styles.geocodeText}
            >
              {geocodeResult.formattedAddress}
            </Text>
          </View>
          {geocodeResult.city && (
            <View style={styles.geocodeRow}>
              <Ionicons name="business" size={16} color={colors.primary} />
              <Text variant="xs" color={colors.textSecondary}>
                City: {geocodeResult.city}
              </Text>
            </View>
          )}
          {geocodeResult.state && (
            <View style={styles.geocodeRow}>
              <Ionicons name="map" size={16} color={colors.primary} />
              <Text variant="xs" color={colors.textSecondary}>
                State: {geocodeResult.state}
              </Text>
            </View>
          )}
          {geocodeResult.postalCode && (
            <View style={styles.geocodeRow}>
              <Ionicons name="mail" size={16} color={colors.primary} />
              <Text variant="xs" color={colors.textSecondary}>
                Pincode: {geocodeResult.postalCode}
              </Text>
            </View>
          )}
        </View>
      )}

      <Text variant="s" color={colors.textSecondary} style={styles.label}>
        Save address as
      </Text>
      <View style={styles.tabsContainer}>
        {['Home', 'Office', 'Restaurant', 'Shop', 'Institution'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.tab, label === type && styles.activeTab]}
            onPress={() => setLabel(type)}
          >
            <Text
              variant="xs"
              weight={label === type ? 'bold' : 'medium'}
              color={label === type ? colors.white : colors.textSecondary}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Input
        label="Full Address (Street, Building, etc)"
        value={addressText}
        onChangeText={setAddressText}
        multiline
        placeholder="e.g. 123 Main St"
      />

      <View style={styles.rowInputs}>
        <View style={styles.halfInput}>
          <Input
            label="Pincode"
            value={pincode}
            onChangeText={setPincode}
            keyboardType="numeric"
            placeholder="e.g. 560001"
          />
        </View>
        <View style={styles.halfInput}>
          <Input
            label="State"
            value={state}
            onChangeText={setState}
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
          onValueChange={(value) => setCityId(value)}
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

      {/* Coordinates Display */}
      {hasValidCoordinates && (
        <View style={styles.coordinatesContainer}>
          <View style={styles.coordinateRow}>
            <Ionicons name="location" size={16} color={colors.primary} />
            <Text
              variant="s"
              color={colors.textSecondary}
              style={styles.coordinateLabel}
            >
              Latitude:
            </Text>
            <Text variant="s" weight="medium">
              {lat.toFixed(4)}
            </Text>
          </View>
          <View style={styles.coordinateRow}>
            <Ionicons name="location" size={16} color={colors.primary} />
            <Text
              variant="s"
              color={colors.textSecondary}
              style={styles.coordinateLabel}
            >
              Longitude:
            </Text>
            <Text variant="s" weight="medium">
              {lng.toFixed(4)}
            </Text>
          </View>
        </View>
      )}

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
  label: {
    marginBottom: spacing.xs,
  },
  tabsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.m,
    gap: spacing.s,
  },
  tab: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: spacing.radius.circle,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  activeTab: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
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
  coordinatesContainer: {
    backgroundColor: colors.background,
    padding: spacing.m,
    borderRadius: spacing.radius.m,
    marginBottom: spacing.m,
    gap: spacing.s,
  },
  coordinateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  coordinateLabel: {
    marginLeft: spacing.xs,
  },
  mapContainer: {
    height: 250,
    marginBottom: spacing.m,
    borderRadius: spacing.radius.m,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    height: 250,
  },
  mapOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -40,
    pointerEvents: 'none',
  },
  mapInfoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  geocodeInfo: {
    backgroundColor: colors.background,
    padding: spacing.m,
    borderRadius: spacing.radius.m,
    marginBottom: spacing.m,
    gap: spacing.s,
  },
  geocodeLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
    paddingBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.xs,
  },
  loadingText: {
    marginLeft: spacing.xs,
  },
  geocodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
  },
  geocodeText: {
    flex: 1,
    marginLeft: spacing.xs,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: spacing.m,
  },
  halfInput: {
    flex: 1,
  },
  saveButton: {
    marginTop: spacing.m,
  },
});
