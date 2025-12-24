import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useEffect, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, TextInput } from 'react-native';
import { Address } from '../types';

interface AddressFormProps {
  address?: Address;
  onSave: (data: {
    service_radius_m: number;
    delivery_time_msg: string;
    street: string;
    cityId: string;
    state: string;
    zipCode: string;
    country: string;
    location: {
      lat: number;
      lng: number;
    };
    address: string;
  }) => void;
  onDelete?: () => void;
  onCancel: () => void;
  isPending: boolean;
}

export function AddressForm({
  address,
  onSave,
  onDelete,
  onCancel,
  isPending,
}: AddressFormProps) {
  const [service_radius_m, setServiceRadiusM] = useState(
    address?.service_radius_m?.toString() || '',
  );

  const [delivery_time_msg, setDeliveryTimeMsg] = useState(address?.delivery_time_msg || '');

  const [street, setStreet] = useState(address?.street || '');
  const [cityId, setCityId] = useState(address?.cityId || '');
  const [state, setState] = useState(address?.state || '');
  const [zipCode, setZipCode] = useState(address?.zipCode || '');
  const [country, setCountry] = useState(address?.country || '');
  const [lat, setLat] = useState(address?.location?.lat?.toString() || '');
  const [lng, setLng] = useState(address?.location?.lng?.toString() || '');
  const [fullAddress, setFullAddress] = useState(address?.address || '');

  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');

  useEffect(() => {
    if (address) {
      setServiceRadiusM(address.service_radius_m.toString());
      setDeliveryTimeMsg(address.delivery_time_msg);
      setStreet(address.street);
      setCityId(address.cityId);
      setState(address.state);
      setZipCode(address.zipCode);
      setCountry(address.country);
      setLat(address.location.lat.toString());
      setLng(address.location.lng.toString());
      setFullAddress(address.address);
    }
  }, [address]);

  const handleSave = () => {
    if (
      !service_radius_m ||
      !delivery_time_msg ||
      !street ||
      !cityId ||
      !state ||
      !zipCode ||
      !country ||
      !lat ||
      !lng ||
      !fullAddress
    ) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    const radius = parseFloat(service_radius_m);
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    if (isNaN(radius) || isNaN(latitude) || isNaN(longitude)) {
      Alert.alert('Error', 'Invalid numeric values');
      return;
    }
    onSave({
      service_radius_m: radius,
      delivery_time_msg,
      street,
      cityId,
      state,
      zipCode,
      country,
      location: { lat: latitude, lng: longitude },
      address: fullAddress,
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ],
    );
  };

  const isEdit = !!address;

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <ThemedText style={[styles.title, { color: textColor }]}>
        {isEdit ? 'Edit Address' : 'Add Address'}
      </ThemedText>

      <TextInput
        placeholder="Street"
        value={street}
        onChangeText={setStreet}
        style={[styles.input, { color: textColor, borderColor: textColor }]}
      />

      <TextInput
        placeholder="City ID"
        value={cityId}
        onChangeText={setCityId}
        style={[styles.input, { color: textColor, borderColor: textColor }]}
      />

      <TextInput
        placeholder="State"
        value={state}
        onChangeText={setState}
        style={[styles.input, { color: textColor, borderColor: textColor }]}
      />

      <TextInput
        placeholder="Zip Code"
        value={zipCode}
        onChangeText={setZipCode}
        style={[styles.input, { color: textColor, borderColor: textColor }]}
      />

      <TextInput
        placeholder="Country"
        value={country}
        onChangeText={setCountry}
        style={[styles.input, { color: textColor, borderColor: textColor }]}
      />

      <TextInput
        placeholder="Latitude"
        value={lat}
        onChangeText={setLat}
        keyboardType="numeric"
        style={[styles.input, { color: textColor, borderColor: textColor }]}
      />

      <TextInput
        placeholder="Longitude"
        value={lng}
        onChangeText={setLng}
        keyboardType="numeric"
        style={[styles.input, { color: textColor, borderColor: textColor }]}
      />

      <TextInput
        placeholder="Full Address"
        value={fullAddress}
        onChangeText={setFullAddress}
        multiline
        style={[styles.input, { color: textColor, borderColor: textColor }]}
      />

      <TextInput
        placeholder="Service Radius (m)"
        value={service_radius_m}
        onChangeText={setServiceRadiusM}
        keyboardType="numeric"
        style={[styles.input, { color: textColor, borderColor: textColor }]}
      />

      <TextInput
        placeholder="Delivery Time Message"
        value={delivery_time_msg}
        onChangeText={setDeliveryTimeMsg}
        style={[styles.input, { color: textColor, borderColor: textColor }]}
      />

      <ThemedView style={styles.buttonContainer}>
        <Button title="Cancel" onPress={onCancel} />
        <Button
          title={isPending ? 'Saving...' : 'Save'}
          onPress={handleSave}
          disabled={isPending}
        />
      </ThemedView>

      {isEdit && onDelete && (
        <Button title="Delete" onPress={handleDelete} color="red" />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    borderRadius: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
});
