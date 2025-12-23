import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, TextInput } from 'react-native';
import { BankAccount } from '../types';

interface BankAccountFormProps {
  account?: BankAccount;
  onSave: (data: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  }) => void;
  onDelete?: () => void;
  onCancel: () => void;
  isPending: boolean;
}

export function BankAccountForm({
  account,
  onSave,
  onDelete,
  onCancel,
  isPending,
}: BankAccountFormProps) {
  const [accountHolderName, setAccountHolderName] = useState(
    account?.accountHolderName || '',
  );
  const [accountNumber, setAccountNumber] = useState(
    account?.accountNumber || '',
  );
  const [ifscCode, setIfscCode] = useState(account?.ifscCode || '');
  const [bankName, setBankName] = useState(account?.bankName || '');

  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');

  useEffect(() => {
    if (account) {
      setAccountHolderName(account.accountHolderName);
      setAccountNumber(account.accountNumber);
      setIfscCode(account.ifscCode);
      setBankName(account.bankName);
    }
  }, [account]);

  const handleSave = () => {
    if (!accountHolderName || !accountNumber || !ifscCode || !bankName) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    onSave({ accountHolderName, accountNumber, ifscCode, bankName });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete this bank account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ],
    );
  };

  const isEdit = !!account;

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ThemedText style={[styles.title, { color: textColor }]}>
        {isEdit ? 'Edit Bank Account' : 'Add Bank Account'}
      </ThemedText>

      <TextInput
        placeholder="Account Holder Name"
        value={accountHolderName}
        onChangeText={setAccountHolderName}
        style={[styles.input, { color: textColor, borderColor: textColor }]}
      />

      <TextInput
        placeholder="Account Number"
        value={accountNumber}
        onChangeText={setAccountNumber}
        keyboardType="number-pad"
        style={[styles.input, { color: textColor, borderColor: textColor }]}
        editable={!account?.is_verified}
      />

      <TextInput
        placeholder="IFSC Code"
        value={ifscCode}
        onChangeText={setIfscCode}
        autoCapitalize="characters"
        style={[styles.input, { color: textColor, borderColor: textColor }]}
        editable={!account?.is_verified}
      />

      <TextInput
        placeholder="Bank Name"
        value={bankName}
        onChangeText={setBankName}
        style={[styles.input, { color: textColor, borderColor: textColor }]}
        editable={!account?.is_verified}
      />

      {account?.is_verified && (
        <ThemedText style={styles.note}>
          Bank details are verified and cannot be edited.
        </ThemedText>
      )}

      <ThemedView style={styles.buttonContainer}>
        <Button title="Cancel" onPress={onCancel} />
        <Button
          title={isPending ? 'Saving...' : 'Save'}
          onPress={handleSave}
          disabled={isPending}
        />
      </ThemedView>

      {isEdit && onDelete && (
        <Button title="Delete" onPress={handleDelete} color="red" />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    borderRadius: 4,
  },
  note: {
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
});
