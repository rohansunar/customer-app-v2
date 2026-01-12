import { Text, TouchableOpacity } from 'react-native';

interface CancelButtonProps {
  onPress: () => void;
}

export default function CancelButton({ onPress }: CancelButtonProps) {
  return (
    <TouchableOpacity
      style={{
        marginTop: 12,
        backgroundColor: '#dc3545',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        alignSelf: 'flex-start',
      }}
      onPress={onPress}
      activeOpacity={0.7}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel="Cancel order"
      accessibilityHint="Opens a modal to select cancellation reason"
    >
      <Text style={{
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Inter',
      }}>
        Cancel Order
      </Text>
    </TouchableOpacity>
  );
}