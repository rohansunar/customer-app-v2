import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Button } from '@/core/ui/Button';
import { Input } from '@/core/ui/Input';
import { Text } from '@/core/ui/Text';
import { useCities } from '@/features/city/hooks/useCities';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import {
  Alert,
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
    if (!label || !addressText || !pincode || !cityId || !lng || !lat) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    const lngNum = parseFloat(lng);
    const latNum = parseFloat(lat);
    if (isNaN(lngNum) || isNaN(latNum)) {
      Alert.alert('Error', 'Longitude and latitude must be valid numbers');
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
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={label}
          onValueChange={(value) => setLabel(value)}
        >
          <Picker.Item label="Select Label" value="" />
          <Picker.Item label="Home" value="Home" />
          <Picker.Item label="Office" value="Office" />
          <Picker.Item label="Restaurant" value="Restaurant" />
          <Picker.Item label="Shop" value="Shop" />
          <Picker.Item label="Institution" value="Institution" />
        </Picker>
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
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={cityId}
          onValueChange={(value) => setCityId(value)}
        >
          <Picker.Item label="Select City" value="" />
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
  pickerWrapper: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.radius.m,
    marginBottom: spacing.m,
  },
  saveButton: {
    marginTop: spacing.m,
  },
});
