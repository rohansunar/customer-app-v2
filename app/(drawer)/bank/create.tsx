import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { showError, showSuccess } from '@/core/ui/toast';
import { getErrorMessage } from '@/core/utils/getErrorMessage';
import { BankAccountForm } from '@/features/bank/components/BankAccountForm';
import { useCreateBankAccount } from '@/features/bank/hooks/useCreateBankAccount';

export const options = {
  headerShown: false,
  title: 'Edit Bank',
};

export default function CreateBankScreen() {
  const { mutate, isPending } = useCreateBankAccount();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <BankAccountForm
          isPending={isPending}
          onSave={(data) => {
            mutate(data, {
              onSuccess: (res) => {
                showSuccess(res?.data?.message || 'Bank Account Added');
                router.replace('/bank');
              },
              onError: (error) => {
                showError(getErrorMessage(error));
              },
            });
          }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
