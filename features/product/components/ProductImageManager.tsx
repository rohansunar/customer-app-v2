import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { useDeleteProductImage } from '../hooks/useDeleteProductImage';
import { useReorderProductImages } from '../hooks/useReorderProductImages';
import { useUploadProductImages } from '../hooks/useUploadProductImages';
import { buildImageFormData } from '../utils/imageFormData';
const MAX_IMAGES = 5;

type Props = {
  productId: string;
  images: string[];
};

export function ProductImageManager({ productId, images }: Props) {
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const uploadMutation = useUploadProductImages(productId);
  const deleteMutation = useDeleteProductImage(productId);
  const reorderMutation = useReorderProductImages(productId);

  async function handlePickImages() {
    const remainingSlots = MAX_IMAGES - images.length;
    if (remainingSlots <= 0) {
      Alert.alert(
        'Limit reached',
        `You can upload up to ${MAX_IMAGES} images.`,
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedAssets = result.assets.slice(0, remainingSlots);
      if (result.assets.length > remainingSlots) {
        Alert.alert(
          'Image limit',
          `Only ${remainingSlots} more images can be added.`,
        );
      }
      const formData = buildImageFormData(selectedAssets);
      setUploadProgress(0);
      uploadMutation.mutate(
        {
          formData,
          onProgress: (p) => setUploadProgress(p),
        },
        {
          onSettled: () => setUploadProgress(null),
        },
      );
    }
  }

  function handleImageDelete(imageUrl: string) {
    Alert.alert('Delete Image', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteMutation.mutate(imageUrl),
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.addButton,
          images.length >= MAX_IMAGES && styles.disabled,
        ]}
        onPress={handlePickImages}
        disabled={images.length >= MAX_IMAGES}
      >
        <Text style={styles.addText}>
          {images.length >= MAX_IMAGES ? 'Image limit reached' : '+ Add Images'}
        </Text>
      </TouchableOpacity>

      {uploadProgress !== null && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${uploadProgress}%` }]} />
          <Text style={styles.progressText}>Uploading… {uploadProgress}%</Text>
        </View>
      )}

      <Text style={styles.helperText}>
        Tap ✕ to delete · Long press to reorder · {images.length}/{MAX_IMAGES}{' '}
        images used
      </Text>

      <DraggableFlatList
        data={images}
        keyExtractor={(item) => item}
        horizontal
        onDragEnd={({ data }) => {
          // data is reordered string[]
          reorderMutation.mutate(data);
        }}
        renderItem={({ item, drag }) => (
          <View style={styles.imageContainer}>
            {/* IMAGE */}
            <TouchableOpacity
              onLongPress={drag}
              onPress={() => handleImageDelete(item)}
              style={styles.imageWrapper}
            >
              <Image source={{ uri: item }} style={styles.image} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteIcon}
              onPress={() => handleImageDelete(item)}
              disabled={deleteMutation.isPending}
              activeOpacity={0.7}
            >
              <Ionicons
                name="close-circle"
                size={22}
                color={deleteMutation.isPending ? '#B0B0B0' : '#FF3B30'}
              />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  addButton: {
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    marginBottom: 12,
  },
  addText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  imageWrapper: {
    marginRight: 12,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
  },
  imageContainer: {
    marginRight: 12,
  },
  deleteIcon: {
    position: 'absolute',
    top: -2,
    right: -6,
    backgroundColor: '#FFF',
    borderRadius: 12,
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  progressContainer: {
    marginTop: 8,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  progressText: {
    marginTop: 6,
    fontSize: 12,
    color: '#6B7280',
  },
  disabled: {
    opacity: 0.5,
  },
});
