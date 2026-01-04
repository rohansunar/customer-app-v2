import { useCategories } from '@/features/category/hooks/useCategories';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Product } from '../types';

type Props = {
  product?: Product;
  onSubmit: (data: {
    name: string;
    description?: string;
    price: number;
    is_active?: boolean;
    categoryId: string;
  }) => void;
  isPending: boolean;
};

export function ProductForm({ product, onSubmit, isPending }: Props) {
  const { data: categories, isLoading } = useCategories();

  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [price, setPrice] = useState(product?.price?.toString() ?? '');
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? '');

  useEffect(() => {
    if (product) {
      setCategoryId(product.categoryId);
    }
  }, [product]);

  function handleSubmit() {
    if (!name || !price || !categoryId) {
      alert('Name, price and category are required');
      return;
    }

    onSubmit({
      name,
      description,
      price: Number(price),
      categoryId,
    });
  }

  if (isLoading) {
    return <Text>Loading categories...</Text>;
  }

  return (
    <View>
      {/* TITLE */}
      <Text style={styles.title}>
        {product ? 'Edit Product' : 'Create Product'}
      </Text>

      {/* BASIC INFO */}
      <View style={styles.card}>
        <Text style={styles.label}>Product Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 20L Water Jar"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={categoryId} onValueChange={setCategoryId}>
            <Picker.Item label="Select category" value="" />
            {categories?.map((cat) => (
              <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Price (₹)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 40"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />
      </View>

      {/* DESCRIPTION */}
      <View style={styles.card}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Optional description"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />
      </View>

      {/* SAVE BUTTON */}
      <TouchableOpacity
        style={[styles.saveButton, isPending && styles.disabled]}
        onPress={handleSubmit}
        disabled={isPending}
      >
        <Text style={styles.saveText}>
          {isPending ? 'Saving...' : 'Save Product'}
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
  },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
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

  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },

  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    overflow: 'hidden',
  },

  switchRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
