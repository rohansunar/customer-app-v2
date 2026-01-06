import { router, useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native';

import { showError, showSuccess } from '@/core/ui/toast';
import { getErrorMessage } from '@/core/utils/getErrorMessage';
import { BankAccountForm } from '@/features/bank/components/BankAccountForm';
import { useUpdateBankAccount } from '@/features/bank/hooks/useUpdateBankAccount';

export default function EditBankScreen() {
  const { id, bank } = useLocalSearchParams<{ id: string; bank: string }>();
  const { mutate, isPending } = useUpdateBankAccount();

  if (!id) {
    return <Text style={{ padding: 16 }}>Invalid bank account ID</Text>;
  }

  const data = bank ? JSON.parse(bank) : null;

  if (!data) {
    return <Text style={{ padding: 16 }}>Loading bank account...</Text>;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <BankAccountForm
          account={data}
          isPending={isPending}
          onSave={(formData) => {
            mutate(
              { id, data: formData },
              {
                onSuccess: (res) => {
                  showSuccess(res?.data?.message || 'Bank updated');
                  router.replace('/bank');
                },
                onError: (error) => {
                  showError(getErrorMessage(error));
                },
              },
            );
          }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
