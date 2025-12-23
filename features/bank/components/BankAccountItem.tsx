import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { BankAccount } from '../types';

interface BankAccountItemProps {
  account: BankAccount;
  onPress: () => void;
}

export function BankAccountItem({ account, onPress }: BankAccountItemProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor }]}
      onPress={onPress}
    >
      <ThemedView style={styles.content}>
        <ThemedText style={[styles.title, { color: textColor }]}>
          {account.bankName} - {account.accountNumber}
        </ThemedText>
        <Ionicons
          name={account.is_verified ? 'checkmark-circle' : 'time-outline'}
          size={20}
          color={account.is_verified ? 'green' : 'orange'}
        />
      </ThemedView>
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
});
