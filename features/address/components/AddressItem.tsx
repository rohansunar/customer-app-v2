import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Address } from '../types';

interface AddressItemProps {
  address: Address;
  onPress: () => void;
}

export function AddressItem({ address, onPress }: AddressItemProps) {

  {{address}}
  // Handle location if it's a stringified object
  let locationObj: { lat: number; lng: number; } | null = null;
  if (address.location) {
    if (typeof address.location === 'string') {
      try {
        locationObj = JSON.parse(address.location);
      } catch {
        // keep null
      }
    } else {
      locationObj = address.location;
    }
  }

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: '#fff' }]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: '#000' }]}>
            {address.street}, {address.city}, {address.state}, {address.zipCode}
          </Text>
          {locationObj && (
            <Text style={[styles.coordinates, { color: '#000' }]}>
              Lat: {locationObj.lat}, Lng: {locationObj.lng}
            </Text>
          )}
        </View>
        <Ionicons name="location-outline" size={20} color={'#000'} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  coordinates: {
    fontSize: 14,
    marginTop: 4,
    opacity: 0.7,
  },
});
