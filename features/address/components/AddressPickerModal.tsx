import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Text } from '@/core/ui/Text';
import { toastConfig } from '@/core/ui/toastConfig';
import { getErrorMessage } from '@/core/utils/getErrorMessage';
import { useToastHelpers } from '@/core/utils/toastHelpers';
import { useAlert } from '@/core/context/AlertContext';
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
    <Modal visible={isVisible} animationType="fade" transparent={false}>
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
                  size={20}
                  color={colors.textPrimary}
                />
              </TouchableOpacity>
              <Text variant="m" weight="bold" style={styles.title}>
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
                <FlatList
                  data={addresses}
                  keyExtractor={(item) => item.id}
                  renderItem={renderItem}
                  contentContainerStyle={styles.list}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                /* ---------- EMPTY STATE ---------- */
                <View style={styles.centered}>
                  <View style={styles.emptyIconWrap}>
                    <Ionicons
                      name="location-outline"
                      size={28}
                      color={colors.textSecondary}
                    />
                  </View>
                  <Text color={colors.textSecondary} style={styles.emptyText}>
                    No addresses found
                  </Text>

                  <TouchableOpacity
                    style={styles.emptyAddButton}
                    onPress={handleAddAddress}
                    activeOpacity={0.85}
                  >
                    <Ionicons
                      name="add"
                      size={18}
                      color={colors.surface}
                      style={styles.addIcon}
                    />
                    <Text color={colors.surface} weight="medium">
                      Add New Address
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
        {!showForm && addresses && addresses.length > 0 && (
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.bottomAddButton}
              onPress={handleAddAddress}
              activeOpacity={0.85}
            >
              <Ionicons
                name="add"
                size={20}
                color={colors.primary}
                style={styles.bottomAddIcon}
              />
              <Text weight="regular" style={styles.bottomAddText}>
                Add New Address
              </Text>
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: spacing.ms,
    paddingVertical: spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
    minHeight: 48,
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
    padding: spacing.s,
    borderRadius: spacing.radius.m,
    backgroundColor: colors.surface,
    zIndex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.l,
    paddingVertical: 0,
  },
  list: {
    paddingTop: spacing.ms,
    paddingBottom: spacing.ms,
    gap: spacing.xxs,
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
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: spacing.radius.l,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: {
    marginTop: spacing.m,
    marginBottom: spacing.l,
    fontSize: 16,
  },
  emptyAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    backgroundColor: colors.primary,
    borderRadius: spacing.radius.m,
  },
  addIcon: {
    marginRight: spacing.xs,
  },
  bottomBar: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.ms,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  bottomAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.ms,
    borderRadius: spacing.radius.m,
    borderWidth: 1.8,
    borderColor: colors.info,
    backgroundColor: colors.surface,
  },
  bottomAddIcon: {
    marginRight: spacing.s,
  },
  bottomAddText: {
    color: colors.info,
  },
});
