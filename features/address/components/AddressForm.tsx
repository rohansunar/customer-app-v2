import { useCities } from '@/features/city/hooks/useCities';
import { INDIAN_STATES } from '@/shared/constants/indianStates';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
  const [service_radius_m, setServiceRadiusM] = useState(
    address?.service_radius_m?.toString() || '',
  );
  const [street, setStreet] = useState(address?.street || '');
  const [cityId, setCityId] = useState(address?.cityId || '');
  const [state, setState] = useState(address?.state || '');
  const [zipCode, setZipCode] = useState(address?.zipCode || '');
  const [lat, setLat] = useState(address?.location?.lat?.toString() || '');
  const [lng, setLng] = useState(address?.location?.lng?.toString() || '');
  const [fullAddress, setFullAddress] = useState(address?.address || '');

  useEffect(() => {
    if (address) {
      setServiceRadiusM(address.service_radius_m.toString());
      setStreet(address.street);
      setCityId(address.cityId);
      setState(address.state);
      setZipCode(address.zipCode);
      setLat(address.location?.lat?.toString() || '');
      setLng(address.location?.lng?.toString() || '');
      setFullAddress(address.address);
    }
  }, [address]);

  const handleSave = () => {
    if (
      !service_radius_m ||
      !street ||
      !cityId ||
      !state ||
      !zipCode ||
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
      street,
      cityId,
      state,
      zipCode,
      location: { lat: latitude, lng: longitude },
      address: fullAddress,
    });
  };

  const isEdit = !!address;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isEdit ? 'Edit Address' : 'Add Address'}
        </Text>
        <TouchableOpacity onPress={onCancel}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Street"
        value={street}
        onChangeText={setStreet}
        style={styles.input}
      />

      <Text>City</Text>
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

      <Text>State</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={state}
          onValueChange={(value) => setState(value)}
        >
          <Picker.Item label="Select State" value="" />

          {INDIAN_STATES.map((stateName) => (
            <Picker.Item key={stateName} label={stateName} value={stateName} />
          ))}
        </Picker>
      </View>

      <TextInput
        placeholder="Zip Code"
        value={zipCode}
        onChangeText={setZipCode}
        style={[styles.input]}
      />

      <TextInput
        placeholder="Latitude"
        value={lat}
        onChangeText={setLat}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Longitude"
        value={lng}
        onChangeText={setLng}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Full Address"
        value={fullAddress}
        onChangeText={setFullAddress}
        multiline
        style={styles.input}
      />

      <TextInput
        placeholder="Service Radius (m)"
        value={service_radius_m}
        onChangeText={setServiceRadiusM}
        keyboardType="numeric"
        style={styles.input}
      />

      <TouchableOpacity
        style={[styles.saveButton, isPending && styles.disabledButton]}
        onPress={isPending ? () => {} : handleSave}
      >
        <Text style={styles.saveButtonText}>
          {isPending ? 'Saving...' : 'Save'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: 'black',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    borderRadius: 4,
    color: 'black',
    borderColor: 'gray',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
