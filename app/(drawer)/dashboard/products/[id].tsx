import { showError, showSuccess } from '@/core/ui/toast';
import { getErrorMessage } from '@/core/utils/getErrorMessage';
import { ProductForm } from '@/features/product/components/ProductForm';
import { ProductImageManager } from '@/features/product/components/ProductImageManager';
import { useProduct } from '@/features/product/hooks/useProduct';
import { useUpdateProduct } from '@/features/product/hooks/useUpdateProduct';
import { useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useProduct(id);
  const { mutate, isPending } = useUpdateProduct();

  if (isLoading || !data) return <Text>Loading...</Text>;
  if (!data.is_active) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ color: '#6B7280' }}>
          This product is deleted. Restore it from the product list to edit.
        </Text>
      </View>
    );
  }
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16 }}
      >
        {/* <View style={{ padding: 16 }}> */}
        {/* 🔹 IMAGE MANAGEMENT SECTION */}
        <ProductImageManager productId={id} images={data.images ?? []} />

        {/* 🔹 PRODUCT FORM */}
        <ProductForm
          product={data}
          isPending={isPending}
          onSubmit={(formData) =>
            mutate(
              { id, data: formData },
              {
                onSuccess: (res) => {
                  showSuccess(
                    res?.data?.message || 'Product updated successfully',
                  );
                },
                onError: (error) => {
                  showError(getErrorMessage(error));
                },
              },
            )
          }
        />
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
}
