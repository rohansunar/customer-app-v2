import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Button } from '@/core/ui/Button';
import { Input } from '@/core/ui/Input';
import { Text } from '@/core/ui/Text';
import { showError } from '@/core/ui/toast';
import { useCities } from '@/features/city/hooks/useCities';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import {
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
  const [label, setLabel] = useState(address?.label || '');
  const [addressText, setAddressText] = useState(address?.address || '');
  const [pincode, setPincode] = useState(address?.pincode || '');
  const [cityId, setCityId] = useState(address?.city?.id || '');
  const [lng, setLng] = useState(address?.location?.lng?.toString() || '');
  const [lat, setLat] = useState(address?.location?.lat?.toString() || '');

  useEffect(() => {
    if (address) {
      setLabel(address.label);
      setAddressText(address.address);
      setPincode(address.pincode);
      setCityId(address.city?.id || '');
      setLng(address.location?.lng?.toString() || '');
      setLat(address.location?.lat?.toString() || '');
    }
  }, [address]);

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
      showError('Location coordinates are required');
      return;
    }
    const lngNum = parseFloat(lng);
    const latNum = parseFloat(lat);
    if (isNaN(lngNum) || isNaN(latNum)) {
      showError('Invalid coordinates provided');
      return;
    }
    onSave({
      label,
      address: addressText,
      pincode,
      cityId,
      location: { lng: lngNum, lat: latNum },
    });
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

      <Text variant="s" color={colors.textSecondary} style={styles.label}>
        Address Type
      </Text>
      <View style={styles.tabsContainer}>
        {['Home', 'Office', 'Restaurant', 'Shop', 'Institution'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.tab,
              label === type && styles.activeTab,
            ]}
            onPress={() => setLabel(type)}
          >
            <Text
              variant="s"
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

      <Input
        label="Pincode"
        value={pincode}
        onChangeText={setPincode}
        keyboardType="numeric"
        placeholder="e.g. 560001"
      />

      <Text variant="s" color={colors.textSecondary} style={styles.label}>
        City
      </Text>
      <View style={[styles.pickerWrapper, isCitiesLoading && styles.disabledPicker]}>
        <Picker
          selectedValue={cityId}
          onValueChange={(value) => setCityId(value)}
          enabled={!isCitiesLoading}
        >
          <Picker.Item label={isCitiesLoading ? "Loading Cities..." : "Select City"} value="" />
          {cities?.map((city: any) => (
            <Picker.Item key={city.id} label={city.name} value={city.id} />
          ))}
        </Picker>
      </View>

      <Input
        label="Longitude"
        value={lng}
        onChangeText={setLng}
        keyboardType="numeric"
        placeholder="Enter Longitude"
      />

      <Input
        label="Latitude"
        value={lat}
        onChangeText={setLat}
        keyboardType="numeric"
        placeholder="Enter Latitude"
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
  saveButton: {
    marginTop: spacing.m,
  },
});
