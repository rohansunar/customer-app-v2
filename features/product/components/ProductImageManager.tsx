import * as ImagePicker from 'expo-image-picker';
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { useDeleteProductImage } from '../hooks/useDeleteProductImage';
import { useReorderProductImages } from '../hooks/useReorderProductImages';
import { useUploadProductImages } from '../hooks/useUploadProductImages';
import { buildImageFormData } from '../utils/imageFormData';

type Props = {
  productId: string;
  images: string[];
};

export function ProductImageManager({ productId, images }: Props) {
  const uploadMutation = useUploadProductImages(productId);
  const deleteMutation = useDeleteProductImage(productId);
  const reorderMutation = useReorderProductImages(productId);

  async function handlePickImages() {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const formData = buildImageFormData(result.assets);
      uploadMutation.mutate(formData);
    }
  }

  function handleDelete(imageUrl: string) {
    Alert.alert('Delete Image', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteMutation.mutate(imageUrl),
      },
    ]);
  }

//   /**
//    * Called after drag-and-drop reorder
//    */
//   function handleReorder(newImages: string[]) {
//     reorderMutation.mutate(newImages);
//   }

  return (
    <View>
      <TouchableOpacity onPress={handlePickImages}>
        {/* Add image button */}
      </TouchableOpacity>

      <DraggableFlatList
        data={images}
        keyExtractor={(item) => item}
        horizontal
        onDragEnd={({ data }) => {
          // data is reordered string[]
          reorderMutation.mutate(data);
        }}
        renderItem={({ item, drag }) => (
          <TouchableOpacity
            onLongPress={drag}
            onPress={() => handleDelete(item)}
            style={styles.imageWrapper}
          >
            <Image source={{ uri: item }} style={styles.image} />
          </TouchableOpacity>
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
});
