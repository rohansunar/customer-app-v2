import { ProductForm } from '@/features/product/components/ProductForm';
import { ProductImageManager } from '@/features/product/components/ProductImageManager';
import { useProduct } from '@/features/product/hooks/useProduct';
import { useUpdateProduct } from '@/features/product/hooks/useUpdateProduct';
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useProduct(id);
  const { mutate, isPending } = useUpdateProduct();

  if (isLoading || !data) return <Text>Loading...</Text>;

  return (
    <View style={{ padding: 16 }}>
      {/* 🔹 IMAGE MANAGEMENT SECTION */}
      <ProductImageManager
        productId={id}
        images={data.images ?? []}
      />

      {/* 🔹 PRODUCT FORM */}
      <ProductForm
        product={data}
        isPending={isPending}
        onSubmit={(formData) =>
          mutate({ id, data: formData })
        }
      />
    </View>
  );
}
