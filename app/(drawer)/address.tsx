import { showError, showSuccess } from '@/core/ui/toast';
import { getErrorMessage } from '@/core/utils/getErrorMessage';
import { AddressForm } from '@/features/address/components/AddressForm';
import { AddressItem } from '@/features/address/components/AddressItem';
import { useAddresses } from '@/features/address/hooks/useAddresses';
import { useCreateAddress } from '@/features/address/hooks/useCreateAddress';
import { useDeleteAddress } from '@/features/address/hooks/useDeleteAddress';
import { useSetDefaultAddress } from '@/features/address/hooks/useSetDefaultAddress';
import { useUpdateAddress } from '@/features/address/hooks/useUpdateAddress';
import { Address, CreateAddressData } from '@/features/address/types';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AddressScreen() {
  const { data: addresses, isLoading, error } = useAddresses();
  const createMutation = useCreateAddress();
  const updateMutation = useUpdateAddress();
  const setDefaultMutation = useSetDefaultAddress();
  const deleteMutation = useDeleteAddress();

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text>Loading addresses...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error loading addresses: {error.message}</Text>
      </View>
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

  const handleSave = (formData: CreateAddressData) => {
    if (isEditMode && selectedAddress) {
      updateMutation.mutate(
        { id: selectedAddress.id, data: formData },
        {
          onSuccess: (res) => {
            showSuccess(res?.data?.message || 'Address updated successfully');
            setIsModalVisible(false);
            setSelectedAddress(null);
          },
          onError: (error) => {
            showError(getErrorMessage(error));
          },
        },
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: (res) => {
          showSuccess(res?.data?.message || 'Address created successfully');
          setIsModalVisible(false);
        },
        onError: (error) => {
          showError(getErrorMessage(error));
        },
      });
    }
  };

  const handleDeleteFromList = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: (res) => {
        showSuccess(res?.data?.message || 'Address deleted successfully');
      },
      onError: (error) => {
        showError(getErrorMessage(error));
      },
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedAddress(null);
  };

  const handleToggleDefault = (address: Address) => {
    setDefaultMutation.mutate(address.id,
      {
        onSuccess: (res) => {
          showSuccess(res?.data?.message || 'Address updated successfully');
        },
        onError: (error) => {
          showError(getErrorMessage(error));
        },
      },
    );
  };

  const renderItem = ({ item }: { item: Address }) => (
    <AddressItem
      address={item}
      onPress={() => handleItemPress(item)}
      onDelete={() => handleDeleteFromList(item.id)}
      onToggleDefault={() => handleToggleDefault(item)}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Addresses</Text>

      {addresses && addresses.length > 0 ? (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.centered}>
          <Text>No addresses available</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: '#007AFF' }]}
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
        <TouchableOpacity style={styles.modalOverlay} onPress={handleCancel}>
          <TouchableOpacity
            style={styles.modalContent}
            onPress={() => {}}
            activeOpacity={1}
          >
            <AddressForm
              address={selectedAddress || undefined}
              onSave={handleSave}
              onCancel={handleCancel}
              isPending={createMutation.isPending || updateMutation.isPending}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
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
    backgroundColor: 'white',
    elevation: 5,
    shadowColor: '#0e64e6ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
});
