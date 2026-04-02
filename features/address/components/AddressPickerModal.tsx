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
import {
  Address,
  AddressFormErrors,
  CreateAddressData,
} from '@/features/address/address.types';
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
  startInAddMode?: boolean;
}

export function AddressPickerModal({
  isVisible,
  onClose,
  startInAddMode = false,
}: AddressPickerModalProps) {
  const { data: addresses, isLoading } = useAddresses();
  const setDefaultMutation = useSetDefaultAddress();
  const deleteMutation = useDeleteAddress();
  const createMutation = useCreateAddress();
  const updateMutation = useUpdateAddress();
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [fieldErrors, setFieldErrors] = useState<Partial<AddressFormErrors>>(
    {},
  );
  const showToast = useToastHelpers();
  const { showConfirm } = useAlert();

  const handleSetDefault = useCallback(
    (id: string) => {
      setSettingDefaultId(id);
      setDefaultMutation.mutate(id, {
        onSuccess: () => {
          showToast.success('Location updated');
          setSettingDefaultId(null);
          onClose();
        },
        onError: (error) => {
          showToast.error(getErrorMessage(error));
          setSettingDefaultId(null);
          onClose();
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
    setServerError(undefined);
    setFieldErrors({});
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
        () => {},

        'Delete', // confirmText
        'Cancel', // cancelText
      );
    },
    [deleteMutation, showToast, showConfirm],
  );

  const handleSaveAddress = useCallback(
    (formData: CreateAddressData) => {
      setServerError(undefined);
      setFieldErrors({});
      const mutation = editingAddress ? updateMutation : createMutation;
      const mutationData = editingAddress
        ? { id: editingAddress.id, data: formData }
        : formData;

      mutation.mutate(mutationData as any, {
        onSuccess: () => {
          showToast.success(
            editingAddress ? 'Address updated' : 'Address added',
          );
          setShowForm(false);
          setEditingAddress(null);
          setServerError(undefined);
          setFieldErrors({});
        },
        onError: (error: any) => {
          const errors = error?.response?.data?.errors;
          const message = error?.response?.data?.message;
          const globalError = error?.response?.data?.error;

          if (errors && typeof errors === 'object') {
            const mappedFieldErrors: Partial<AddressFormErrors> = {};
            const fieldKeys = [
              'addressText',
              'pincode',
              'city',
              'state',
              'label',
              'nearLandmark',
              'familyMembersCount',
            ] as const;
            fieldKeys.forEach((key) => {
              if (errors[key]) {
                mappedFieldErrors[key] = errors[key];
              }
            });
            setFieldErrors(mappedFieldErrors);

            if (message || globalError) {
              setServerError(message || globalError);
            }
          } else if (message || globalError) {
            setServerError(message || globalError);
          } else {
            setServerError(getErrorMessage(error));
          }
        },
      });
    },
    [editingAddress, updateMutation, createMutation, showToast],
  );

  const renderItem = useCallback(
    ({ item }: { item: Address }) => (
      <AddressItem
        address={item}
        onPress={() => {
          if (settingDefaultId) return;
          handleSetDefault(item.id);
        }}
        isLoading={settingDefaultId === item.id}
        onEdit={() => handleEdit(item)}
        onDelete={() => handleDelete(item.id)}
      />
    ),
    [handleSetDefault, handleEdit, handleDelete, settingDefaultId],
  );

  const handleBackAction = useCallback(() => {
    if (showForm) {
      setShowForm(false);
      setEditingAddress(null);
    } else {
      onClose();
    }
  }, [showForm, onClose]);

  // Open directly in add mode when requested externally
  React.useEffect(() => {
    if (isVisible && startInAddMode) {
      setEditingAddress(null);
      setShowForm(true);
    }
  }, [isVisible, startInAddMode]);

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={false}
      onRequestClose={handleBackAction}
    >
      <SafeAreaView style={styles.container}>
        {!showForm ? (
          <>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={handleBackAction}
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
            serverError={serverError}
            onClearServerError={() => setServerError(undefined)}
            fieldErrors={fieldErrors}
            onClearFieldError={(field) =>
              setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
            }
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
