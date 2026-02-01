import { useAlert } from '@/core/context/AlertContext';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Text } from '@/core/ui/Text';
import { toastConfig } from '@/core/ui/toastConfig';
import { getErrorMessage } from '@/core/utils/getErrorMessage';
import { useToastHelpers } from '@/core/utils/toastHelpers';
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
  ActivityIndicator,
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
  const showToast = useToastHelpers();
  const { showConfirm } = useAlert();

  const handleSetDefault = useCallback(
    (id: string) => {
      setDefaultMutation.mutate(id, {
        onSuccess: () => {
          showToast.success('Location updated');
          onClose();
        },
        onError: (error) => {
          showToast.error(getErrorMessage(error));
        },
      });
    },
    [setDefaultMutation, showToast, onClose],
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
      showConfirm(
        'Delete Address', // title
        'Are you sure you want to delete this address?', // message
        () => {
          deleteMutation.mutate(id, {
            onSuccess: () => {
              showToast.success('Address Deleted');
            },
            onError: (error) => {
              showToast.error(getErrorMessage(error));
            },
          });
        },
        () => {
          console.log('Deletion cancelled');
        },
        'Delete', // confirmText
        'Cancel', // cancelText
      );
    },
    [deleteMutation, showToast, showConfirm],
  );

  const handleSaveAddress = useCallback(
    (formData: CreateAddressData) => {
      if (editingAddress) {
        updateMutation.mutate(
          { id: editingAddress.id, data: formData },
          {
            onSuccess: () => {
              showToast.success('Address updated');
              setShowForm(false);
              setEditingAddress(null);
              onClose();
            },
            onError: (error) => {
              showToast.error(getErrorMessage(error));
            },
          },
        );
      } else {
        createMutation.mutate(formData, {
          onSuccess: () => {
            showToast.success('Address added');
            setShowForm(false);
            setEditingAddress(null);
            onClose();
          },
          onError: (error) => {
            showToast.error(getErrorMessage(error));
          },
        });
      }
    },
    [editingAddress, updateMutation, showToast, onClose, createMutation],
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
    <Modal visible={isVisible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        {!showForm ? (
          <>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={handleCloseModal}
                style={styles.closeButton}
              >
                <Ionicons
                  name="chevron-down"
                  size={24}
                  color={colors.textPrimary}
                />
              </TouchableOpacity>
              <Text variant="l" weight="bold" style={styles.title}>
                Select Address
              </Text>
              <View style={styles.headerPlaceholder} />
            </View>

            <View style={styles.content}>
              {isLoading ? (
                /* ---------- LOADING ---------- */
                <View style={styles.centered}>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text style={styles.loadingText}>Loading addresses...</Text>
                </View>
              ) : addresses && addresses.length > 0 ? (
                /* ---------- ADDRESSES PRESENT ---------- */
                <>
                  {/* Add Address button ONLY when addresses exist */}
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

                  <FlatList
                    data={addresses}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                  />
                </>
              ) : (
                /* ---------- EMPTY STATE ---------- */
                <View style={styles.centered}>
                  <Ionicons
                    name="location-outline"
                    size={64}
                    color={colors.textSecondary}
                  />
                  <Text color={colors.textSecondary} style={styles.emptyText}>
                    No addresses found
                  </Text>

                  <TouchableOpacity
                    style={styles.emptyAddButton}
                    onPress={handleAddAddress}
                  >
                    <Text color={colors.primary} weight="medium">
                      Add your first address
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
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
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
    height: 60,
  },
  title: {
    flex: 1,
    textAlign: 'left',
    marginLeft: 7, // Offset for the close button width
  },
  headerPlaceholder: {
    width: 24, // Matches close button width for balance
  },
  closeButton: {
    padding: spacing.xs,
    zIndex: 1,
  },
  content: {
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  addButtonText: {
    marginLeft: spacing.xs,
  },
  list: {
    paddingBottom: spacing.xl,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.m,
    color: colors.textSecondary,
  },
  emptyText: {
    marginTop: spacing.m,
    marginBottom: spacing.l,
    fontSize: 16,
  },
  emptyAddButton: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    backgroundColor: colors.primary + '10', // 10% opacity
    borderRadius: spacing.radius.m,
  },

  // Address item styles
  addressItem: {
    padding: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  addressItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  addressName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tag: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: spacing.xs,
    backgroundColor: colors.primary + '20',
  },
  tagText: {
    fontSize: 10,
    color: colors.primary,
  },
  addressText: {
    color: colors.textSecondary,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: spacing.s,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.l,
  },
  actionButtonText: {
    marginLeft: spacing.xs,
    color: colors.primary,
  },
});
