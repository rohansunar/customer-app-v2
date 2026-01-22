/**
 * AddressScreen Component
 *
 * This screen manages the user's saved addresses, providing a list view with CRUD operations.
 * It follows the MVC pattern by separating UI logic from business logic via custom hooks and services.
 * The component uses React Query for data fetching and mutations to ensure efficient caching and synchronization.
 * A modal-based form is used for adding/editing addresses to maintain a clean, focused UI without navigation.
 * Edge cases handled: loading states, error states, empty lists, and user feedback via toasts.
 *
 * Dependencies:
 * - Custom hooks (useAddresses, etc.) encapsulate API calls and state management for reusability.
 * - AddressForm and AddressItem components handle specific UI concerns, promoting single responsibility.
 * - Modal for form display to avoid screen transitions and maintain context.
 */
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Text } from '@/core/ui/Text';
import { showError, showSuccess } from '@/core/ui/toast';
import { getErrorMessage } from '@/core/utils/getErrorMessage';
import { AddressForm } from '@/features/address/components/AddressForm';
import { AddressItem } from '@/features/address/components/AddressItem';
import { useAddresses } from '@/features/address/hooks/useAddresses';
import { useCreateAddress } from '@/features/address/hooks/useCreateAddress';
import { useDeleteAddress } from '@/features/address/hooks/useDeleteAddress';
import { useUpdateAddress } from '@/features/address/hooks/useUpdateAddress';
import { Address, CreateAddressData } from '@/features/address/types';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AddressScreen() {
  // Data fetching hook: Fetches user's addresses using React Query for caching and background updates.
  // Enabled only when authenticated to prevent unnecessary API calls.
  const { data: addresses, isLoading, error } = useAddresses();

  // Mutation hooks for CRUD operations: Encapsulate API calls and handle success/error states.
  // On success, they invalidate queries to refresh the list automatically.
  const createMutation = useCreateAddress();
  const updateMutation = useUpdateAddress();
  const deleteMutation = useDeleteAddress();

  // State for modal management: Tracks the selected address for editing and modal visibility.
  // selectedAddress is null for add mode, populated for edit mode.
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Early returns for loading and error states: Prevents rendering the main UI when data is unavailable.
  // This improves UX by showing appropriate feedback instead of a broken interface.
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
        <Text color={colors.error}>
          Error loading addresses: {error.message}
        </Text>
      </View>
    );
  }

  // Event handlers for user interactions: Manage modal state and form mode.
  // handleItemPress: Opens modal in edit mode with selected address pre-filled.
  // handleAddPress: Opens modal in add mode with empty form.
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

  // handleSave: Handles form submission for both create and update operations.
  // Uses conditional logic based on isEditMode to call appropriate mutation.
  // On success: Shows toast, closes modal, resets state. On error: Shows error toast.
  // This centralizes save logic, reducing duplication and ensuring consistent behavior.
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

  // handleDeleteFromList: Initiates delete operation for an address.
  // Uses mutation with success/error callbacks for user feedback.
  // Note: Deletion is irreversible; consider adding confirmation dialog in future.
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

  // handleCancel: Closes the modal and resets state without saving.
  // Ensures clean state for next interaction.
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedAddress(null);
  };

  // renderItem: Renders each address in the FlatList.
  // Passes handlers to AddressItem for press, edit, delete actions.
  // Note: onPress and onEdit both call handleItemPress; could be unified if UI allows.
  const renderItem = ({ item }: { item: Address }) => (
    <AddressItem
      address={item}
      onPress={() => handleItemPress(item)}
      onEdit={() => handleItemPress(item)}
      onDelete={() => handleDeleteFromList(item.id)}
    />
  );

  return (
    <View style={styles.container}>
      {/* Conditional rendering: Shows list if addresses exist, else empty state message.
          This handles the edge case of no addresses gracefully. */}
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
          <Text color={colors.textSecondary}>No addresses available</Text>
        </View>
      )}

      {/* Floating Action Button (FAB): Provides quick access to add new address.
          Positioned absolutely for overlay on list, common UX pattern for add actions. */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={handleAddPress}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Modal for add/edit form: Uses slide animation for smooth transition.
          Transparent background with overlay touch to close.
          Nested TouchableOpacity prevents modal content from closing on touch.
          Passes pending state to disable form during submission. */}
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

// Styles: Defines layout and appearance using StyleSheet for performance.
// Uses theme colors and spacing for consistency across the app.
// Absolute positioning for FAB to overlay content.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    paddingTop: spacing.s,
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
    borderRadius: spacing.radius.l,
    backgroundColor: colors.surface,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
});
