import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BankAccountForm } from '@/features/bank/components/BankAccountForm';
import { BankAccountItem } from '@/features/bank/components/BankAccountItem';
import { useBankAccounts } from '@/features/bank/hooks/useBankAccount';
import { useCreateBankAccount } from '@/features/bank/hooks/useCreateBankAccount';
import { useDeleteBankAccount } from '@/features/bank/hooks/useDeleteBankAccount';
import { useUpdateBankAccount } from '@/features/bank/hooks/useUpdateBankAccount';
import { BankAccount } from '@/features/bank/types';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Modal, StyleSheet, TouchableOpacity } from 'react-native';

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

  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');

  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Loading bank accounts...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Error loading bank accounts: {error.message}</ThemedText>
      </ThemedView>
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
          onSuccess: () => {
            setIsModalVisible(false);
            setSelectedAccount(null);
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
    if (selectedAccount) {
      deleteMutation.mutate(selectedAccount.id, {
        onSuccess: () => {
          setIsModalVisible(false);
          setSelectedAccount(null);
        },
      });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedAccount(null);
  };

  const renderItem = ({ item }: { item: BankAccount }) => (
    <BankAccountItem account={item} onPress={() => handleItemPress(item)} />
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ThemedText style={styles.title}>Bank Accounts</ThemedText>

      {accounts && accounts.length > 0 ? (
        <FlatList
          data={accounts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <ThemedView style={styles.centered}>
          <ThemedText>No Bank Accounts found</ThemedText>
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
            <BankAccountForm
              account={selectedAccount || undefined}
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
