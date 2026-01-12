import { View } from 'react-native';

export default function OrderCardSkeleton() {
  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      elevation: 3,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
    }}>
      <View style={{
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
      }}>
        {/* Header skeleton */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 6,
        }}>
          <View style={{
            height: 16,
            width: 120,
            backgroundColor: '#e0e0e0',
            borderRadius: 4,
          }} />
          <View style={{
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}>
            <View style={{
              height: 12,
              width: 60,
              backgroundColor: '#e0e0e0',
              borderRadius: 4,
              marginBottom: 2,
            }} />
            <View style={{
              height: 12,
              width: 50,
              backgroundColor: '#e0e0e0',
              borderRadius: 4,
            }} />
          </View>
        </View>

        {/* Price skeleton */}
        <View style={{
          height: 14,
          width: 100,
          backgroundColor: '#e0e0e0',
          borderRadius: 4,
          marginTop: 6,
        }} />

        {/* Status skeleton */}
        <View style={{
          height: 20,
          width: 80,
          backgroundColor: '#e0e0e0',
          borderRadius: 8,
          marginTop: 8,
          alignSelf: 'flex-start',
        }} />

        {/* OTP skeleton (optional, but include for consistency) */}
        <View style={{
          height: 16,
          width: 120,
          backgroundColor: '#e0e0e0',
          borderRadius: 4,
          marginTop: 8,
        }} />

        {/* Cancel button skeleton */}
        <View style={{
          height: 32,
          width: 100,
          backgroundColor: '#e0e0e0',
          borderRadius: 8,
          marginTop: 12,
          alignSelf: 'flex-start',
        }} />
      </View>
    </View>
  );
}