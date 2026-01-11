import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Address } from '../types';

interface AddressItemProps {
  address: Address;
  onPress: () => void;
  onDelete?: () => void;
}

export function AddressItem({ address, onPress, onDelete }: AddressItemProps) {
  const displayLabel = address.isDefault ? `${address.label} (Primary)` : address.label;

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: '#fff' }]}
      onPress={onPress}
      accessibilityLabel={`Address: ${displayLabel}, ${address.address}, ${address.city.name}, ${address.pincode}`}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: '#000' }]}>
            {displayLabel}
          </Text>
          <Text style={[styles.address, { color: '#000' }]}>
            {address.address}
          </Text>
          <Text style={[styles.details, { color: '#000' }]}>
            {address.city.name}, {address.pincode}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <Ionicons name="location-outline" size={20} color={'#000'} />
          {onDelete && (
            <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
              <Ionicons name="trash-outline" size={20} color={'red'} />
            </TouchableOpacity>
          )}
        </View>
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
  address: {
    fontSize: 14,
    marginTop: 4,
  },
  details: {
    fontSize: 14,
    marginTop: 2,
    opacity: 0.7,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    marginLeft: 8,
  },
});
