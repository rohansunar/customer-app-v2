import { showError, showSuccess } from '@/core/ui/toast';
import { getErrorMessage } from '@/core/utils/getErrorMessage';
import { BankAccountItem } from '@/features/bank/components/BankAccountItem';
import { useBankAccounts } from '@/features/bank/hooks/useBankAccounts';
import { useDeleteBankAccount } from '@/features/bank/hooks/useDeleteBankAccount';
import { BankAccount } from '@/features/bank/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function BankScreen() {
  const { data: accounts, isLoading, error } = useBankAccounts();
  const deleteMutation = useDeleteBankAccount();

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

  const handleDelete = (account: BankAccount) => {
    deleteMutation.mutate(account.id, {
      onSuccess: (res) => {
        showSuccess(res?.data?.message || 'Account deleted');
      },
      onError: (error) => {
        showError(getErrorMessage(error));
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bank Accounts</Text>

      {accounts && accounts.length > 0 ? (
        <FlatList
          data={accounts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BankAccountItem
              account={item}
              onPress={() =>
                router.push({
                  pathname: '/bank/[id]',
                  params: {
                    id: item.id,
                    bank: JSON.stringify(item),
                  },
                })
              }
              onDelete={() => handleDelete(item)}
            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.centered}>
          <Text>No Bank Accounts found</Text>
        </View>
      )}

      {/* Add Bank Button */}
      {accounts && accounts.length == 0 && (
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: '#007AFF' }]}
          onPress={() => router.push('/bank/create')}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      )}
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
});
