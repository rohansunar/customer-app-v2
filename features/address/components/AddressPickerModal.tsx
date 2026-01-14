import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Text } from '@/core/ui/Text';
import { showError, showSuccess } from '@/core/ui/toast';
import { toastConfig } from '@/core/ui/toastConfig';
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
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

interface AddressPickerModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export function AddressPickerModal({
  isVisible,
  onClose,
}: AddressPickerModalProps) {
  const { data: addresses, isLoading } = useAddresses();
  const setDefaultMutation = useSetDefaultAddress();
  const deleteMutation = useDeleteAddress();
  const createMutation = useCreateAddress();
  const updateMutation = useUpdateAddress();
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleSetDefault = useCallback(
    (id: string) => {
      setDefaultMutation.mutate(id, {
        onSuccess: () => {
          showSuccess('Location updated');
          onClose();
        },
        onError: (error) => {
          showError(getErrorMessage(error));
        },
      });
    },
    [setDefaultMutation, onClose],
  );

  const handleAddAddress = useCallback(() => {
    setEditingAddress(null);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((address: Address) => {
    setEditingAddress(address);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          // showSuccess('Address deleted');
        },
        onError: (error) => {
          showError(getErrorMessage(error));
        },
      });
    },
    [deleteMutation],
  );

  const handleSaveAddress = useCallback(
    (formData: CreateAddressData) => {
      if (editingAddress) {
        updateMutation.mutate(
          { id: editingAddress.id, data: formData },
          {
            onSuccess: () => {
              showSuccess('Address updated');
              setShowForm(false);
              setEditingAddress(null);
              onClose();
            },
            onError: (error) => {
              showError(getErrorMessage(error));
            },
          },
        );
      } else {
        createMutation.mutate(formData, {
          onSuccess: () => {
            showSuccess('Address added');
            setShowForm(false);
            setEditingAddress(null);
            onClose();
          },
          onError: (error) => {
            showError(getErrorMessage(error));
          },
        });
      }
    },
    [editingAddress, updateMutation, createMutation, onClose],
  );

  const renderItem = useCallback(
    ({ item }: { item: Address }) => (
      <AddressItem
        address={item}
        onPress={() => handleSetDefault(item.id)}
        onEdit={() => handleEdit(item)}
        onDelete={() => handleDelete(item.id)}
      />
    ),
    [handleSetDefault, handleEdit, handleDelete],
  );

  const handleCloseModal = useCallback(() => {
    setShowForm(false);
    setEditingAddress(null);
    onClose();
  }, [onClose]);

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container}>
          {!showForm ? (
            <>
              <View style={styles.header}>
                <Text variant="l" weight="bold">
                  Select Address
                </Text>
                <TouchableOpacity
                  onPress={handleCloseModal}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddAddress}
              >
                <Ionicons name="add" size={20} color={colors.primary} />
                <Text
                  color={colors.primary}
                  weight="medium"
                  style={styles.addButtonText}
                >
                  Add Address
                </Text>
              </TouchableOpacity>

              {isLoading ? (
                <View style={styles.centered}>
                  <Text>Loading addresses...</Text>
                </View>
              ) : addresses && addresses.length > 0 ? (
                <FlatList
                  data={addresses}
                  keyExtractor={(item) => item.id}
                  renderItem={renderItem}
                  contentContainerStyle={styles.list}
                />
              ) : (
                <View style={styles.centered}>
                  <Text color={colors.textSecondary}>No addresses found</Text>
                </View>
              )}
            </>
          ) : (
            <AddressForm
              address={editingAddress || undefined}
              onSave={handleSaveAddress}
              onCancel={() => setShowForm(false)}
              isPending={createMutation.isPending || updateMutation.isPending}
            />
          )}
          <Toast config={toastConfig} position="top" topOffset={20} />
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: spacing.radius.l,
    borderTopRightRadius: spacing.radius.l,
    height: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: spacing.xs,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  addButtonText: {
    marginLeft: spacing.xs,
  },
  list: {
    padding: spacing.m,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
});
