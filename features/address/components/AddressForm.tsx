import { useCities } from '@/features/city/hooks/useCities';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
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
  const [cityName, setCityName] = useState(address?.city?.name || '');
  const [isDefault, setIsDefault] = useState(address?.isDefault || false);

  useEffect(() => {
    if (address) {
      setLabel(address.label);
      setAddressText(address.address);
      setPincode(address.pincode);
      setCityName(address.city?.name || '');
      setIsDefault(address.isDefault);
    }
  }, [address]);

  const handleSave = () => {
    if (!label || !addressText || !pincode || !cityName) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    onSave({
      label,
      address: addressText,
      pincode,
      city: { name: cityName },
      isDefault,
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
        placeholder="Label"
        value={label}
        onChangeText={setLabel}
        style={styles.input}
      />

      <TextInput
        placeholder="Address"
        value={addressText}
        onChangeText={setAddressText}
        multiline
        style={styles.input}
      />

      <TextInput
        placeholder="Pincode"
        value={pincode}
        onChangeText={setPincode}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text>City</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={cityName}
          onValueChange={(value) => setCityName(value)}
        >
          <Picker.Item label="Select City" value="" />

          {cities?.map((city: any) => (
            <Picker.Item key={city.id} label={city.name} value={city.name} />
          ))}
        </Picker>
      </View>

      <View style={styles.switchContainer}>
        <Text>Is Default</Text>
        <Switch
          value={isDefault}
          onValueChange={setIsDefault}
        />
      </View>

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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
