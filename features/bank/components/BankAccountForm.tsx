import { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { BankAccount } from '../types';

interface BankAccountFormProps {
  account?: BankAccount;
  onSave: (data: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  }) => void;
  isPending: boolean;
}

export function BankAccountForm({
  account,
  onSave,
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

  const isEdit = !!account;

  return (
    <View>
      <Text style={styles.title}>
        {isEdit ? 'Edit Bank Account' : 'Add Bank Account'}
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Account Holder Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. John Doe"
          value={accountHolderName}
          onChangeText={setAccountHolderName}
        />

        <Text style={styles.label}>Account Number</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 1234567890"
          value={accountNumber}
          onChangeText={setAccountNumber}
          keyboardType="number-pad"
          editable={!account?.is_verified}
        />

        <Text style={styles.label}>IFSC Code</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. SBIN0001234"
          value={ifscCode}
          onChangeText={setIfscCode}
          autoCapitalize="characters"
          editable={!account?.is_verified}
        />

        <Text style={styles.label}>Bank Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. State Bank of India"
          value={bankName}
          onChangeText={setBankName}
          editable={!account?.is_verified}
        />

        {account?.is_verified && (
          <Text style={styles.note}>
            Bank details are verified and cannot be edited.
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.saveButton, isPending && styles.disabled]}
        onPress={handleSave}
        disabled={isPending}
      >
        <Text style={styles.saveText}>
          {isPending ? 'Saving...' : 'Save Bank Account'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: '#111',
    textAlign: 'center',
  },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    marginTop: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#FFF',
  },

  note: {
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
  },

  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },

  saveText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },

  disabled: {
    opacity: 0.6,
  },
});
