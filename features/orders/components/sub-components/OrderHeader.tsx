import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Text } from '@/core/ui/Text';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface OrderHeaderProps {
  orderNo: string;
  createdAt: string;
}

export default function OrderHeader({ orderNo, createdAt }: OrderHeaderProps) {
  const dateObj = new Date(createdAt);
  const formattedDate = dateObj.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = dateObj.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.container}>
      <Text variant="m" weight="bold" color={colors.textPrimary}>
        #{orderNo}
      </Text>
      <Text variant="xs" color={colors.textSecondary}>
        {formattedDate} • {formattedTime}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
});
