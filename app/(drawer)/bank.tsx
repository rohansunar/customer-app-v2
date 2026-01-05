import { showError, showSuccess } from '@/core/ui/toast';
import { getErrorMessage } from '@/core/utils/getErrorMessage';
import { BankAccountForm } from '@/features/bank/components/BankAccountForm';
import { BankAccountItem } from '@/features/bank/components/BankAccountItem';
import { useBankAccounts } from '@/features/bank/hooks/useBankAccount';
import { useCreateBankAccount } from '@/features/bank/hooks/useCreateBankAccount';
import { useDeleteBankAccount } from '@/features/bank/hooks/useDeleteBankAccount';
import { useUpdateBankAccount } from '@/features/bank/hooks/useUpdateBankAccount';
import { BankAccount } from '@/features/bank/types';
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

export default function BankScreen() {
  const { data: accounts, isLoading, error } = useBankAccounts();
  const createMutation = useCreateBankAccount();
  const updateMutation = useUpdateBankAccount();
  const deleteMutation = useDeleteBankAccount();

  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(
    null,
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text>Loading bank accounts...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error loading bank accounts: {error.message}</Text>
      </View>
    );
  }

  const handleItemPress = (account: BankAccount) => {
    setSelectedAccount(account);
    setIsEditMode(true);
    setIsModalVisible(true);
  };

  const handleAddPress = () => {
    setSelectedAccount(null);
    setIsEditMode(false);
    setIsModalVisible(true);
  };

  const handleSave = (formData: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  }) => {
    if (isEditMode && selectedAccount) {
      updateMutation.mutate(
        { id: selectedAccount.id, data: formData },
        {
          onSuccess: (res) => {
            showSuccess(
              res?.data?.message || 'Bank account updated successfully',
            );
            setIsModalVisible(false);
            setSelectedAccount(null);
          },
          onError: (error) => {
            showError(getErrorMessage(error));
          },
        },
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: (res) => {
          showSuccess(
            res?.data?.message || 'Bank account created successfully',
          );
          setIsModalVisible(false);
        },
        onError: (error) => {
          showError(getErrorMessage(error));
        },
      });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedAccount(null);
    setIsEditMode(false);
  };

  const handleDelete = (account: BankAccount) => {
    deleteMutation.mutate(account.id, {
      onSuccess: (res) => {
        showSuccess(res?.data?.message || 'Bank account deleted successfully');
      },
      onError: (error) => {
        showError(getErrorMessage(error));
      },
    });
  };

  const renderItem = ({ item }: { item: BankAccount }) => (
    <BankAccountItem
      account={item}
      onPress={() => handleItemPress(item)}
      onDelete={() => handleDelete(item)}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bank Accounts</Text>

      {accounts && accounts.length > 0 ? (
        <FlatList
          data={accounts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.centered}>
          <Text>No Bank Accounts found</Text>
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
        presentationStyle="overFullScreen"
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={handleCancel}>
          <TouchableOpacity style={styles.modalContent} onPress={() => {}}>
            <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
            <BankAccountForm
              account={selectedAccount || undefined}
              onSave={handleSave}
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
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    backgroundColor: 'white',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
