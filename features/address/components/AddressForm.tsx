import { useEffect, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { AddressFormProps } from '../types';

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
  const [street, setStreet] = useState(address?.street || '');
  const [city, setCity] = useState(address?.city || '');
  const [state, setState] = useState(address?.state || '');
  const [zipCode, setZipCode] = useState(address?.zipCode || '');
  const [lat, setLat] = useState(address?.location?.lat?.toString() || '');
  const [lng, setLng] = useState(address?.location?.lng?.toString() || '');
  const [fullAddress, setFullAddress] = useState(address?.address || '');

  useEffect(() => {
    if (address) {
      setServiceRadiusM(address.service_radius_m.toString());
      setStreet(address.street);
      setCity(address.city);
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
      !city ||
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
      city,
      state,
      zipCode,
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {isEdit ? 'Edit Address' : 'Add Address'}
      </Text>

      <TextInput
        placeholder="Street"
        value={street}
        onChangeText={setStreet}
        style={styles.input}
      />

      <TextInput
        placeholder="City"
        value={city}
        onChangeText={setCity}
        style={[styles.input]}
      />

      <TextInput
        placeholder="State"
        value={state}
        onChangeText={setState}
        style={styles.input}
      />

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

      <View style={styles.buttonContainer}>
        <Button title="Cancel" onPress={onCancel} />
        <Button
          title={isPending ? 'Saving...' : 'Save'}
          onPress={handleSave}
          disabled={isPending}
        />
      </View>

      {isEdit && onDelete && (
        <Button title="Delete" onPress={handleDelete} color="red" />
      )}
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
   input: {
     borderWidth: 1,
     padding: 12,
     marginBottom: 12,
     borderRadius: 4,
     color: 'black',
     borderColor: 'gray',
   },
   buttonContainer: {
     flexDirection: 'row',
     justifyContent: 'space-around',
     marginTop: 16,
   },
});
