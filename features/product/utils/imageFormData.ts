/**
 * Builds FormData for multiple image upload
 * Backend expects files[] as multipart data
 */
export function buildImageFormData(assets: any[]) {
  const formData = new FormData();

  assets.forEach((asset, index) => {
    formData.append('files', {
      uri: asset.uri,
      name: `product_${index}.jpg`,
      type: 'image/jpeg',
    } as any);
  });

  return formData;
}
