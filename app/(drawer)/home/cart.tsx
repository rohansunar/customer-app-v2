import { CartSummary } from '@/features/cart/components/CartSummary';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function CartScreen() {
  return (
    <View style={styles.container}>
      <CartSummary />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
