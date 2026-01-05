import { Ionicons } from '@expo/vector-icons';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BankAccount } from '../types';

interface BankAccountItemProps {
  account: BankAccount;
  onPress: () => void;
  onDelete: () => void;
}

export function BankAccountItem({
  account,
  onPress,
  onDelete,
}: BankAccountItemProps) {
  const handleDeletePress = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete this bank account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ],
    );
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {account.accountHolderName} - {account.accountNumber} -{' '}
          {account.bankName}
        </Text>
        <View style={styles.icons}>
          <Ionicons
            name={account.is_verified ? 'checkmark-circle' : 'time-outline'}
            size={20}
            color={account.is_verified ? 'green' : 'orange'}
          />
          <TouchableOpacity
            onPress={handleDeletePress}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={20} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteButton: {
    padding: 4,
  },
});
