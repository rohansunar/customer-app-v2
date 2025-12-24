import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AddressForm } from '@/features/address/components/AddressForm';
import { AddressItem } from '@/features/address/components/AddressItem';
import { useAddresses } from '@/features/address/hooks/useAddresses';
import { useCreateAddress } from '@/features/address/hooks/useCreateAddress';
import { useDeleteAddress } from '@/features/address/hooks/useDeleteAddress';
import { useUpdateAddress } from '@/features/address/hooks/useUpdateAddress';
import { Address } from '@/features/address/types';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Modal, StyleSheet, TouchableOpacity } from 'react-native';

export default function AddressScreen() {
  const { data: addresses, isLoading, error } = useAddresses();
  const createMutation = useCreateAddress();
  const updateMutation = useUpdateAddress();
  const deleteMutation = useDeleteAddress();

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');

  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Loading addresses...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Error loading addresses: {error.message}</ThemedText>
      </ThemedView>
    );
  }

  const handleItemPress = (address: Address) => {
    setSelectedAddress(address);
    setIsEditMode(true);
    setIsModalVisible(true);
  };

  const handleAddPress = () => {
    setSelectedAddress(null);
    setIsEditMode(false);
    setIsModalVisible(true);
  };

  const handleSave = (formData: {
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
  }) => {
    if (isEditMode && selectedAddress) {
      updateMutation.mutate(
        { id: selectedAddress.id, data: formData },
        {
          onSuccess: () => {
            setIsModalVisible(false);
            setSelectedAddress(null);
          },
        },
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          setIsModalVisible(false);
        },
      });
    }
  };

  const handleDelete = () => {
    if (selectedAddress) {
      deleteMutation.mutate(selectedAddress.id, {
        onSuccess: () => {
          setIsModalVisible(false);
          setSelectedAddress(null);
        },
      });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedAddress(null);
  };

  const renderItem = ({ item }: { item: Address }) => (
    <AddressItem address={item} onPress={() => handleItemPress(item)} />
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ThemedText style={styles.title}>Addresses</ThemedText>

      {addresses && addresses.length > 0 ? (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <ThemedView style={styles.centered}>
          <ThemedText>No addresses found</ThemedText>
        </ThemedView>
      )}

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: tintColor }]}
        onPress={handleAddPress}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={handleCancel}
        transparent
      >
        <ThemedView style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <AddressForm
              address={selectedAddress || undefined}
              onSave={handleSave}
              onDelete={isEditMode ? handleDelete : undefined}
              onCancel={handleCancel}
              isPending={createMutation.isPending || updateMutation.isPending}
            />
          </ThemedView>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  listContainer: {
    paddingBottom: 80, // Space for FAB
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#0e64e6ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
});
