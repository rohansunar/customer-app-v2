import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Text } from '@/core/ui/Text';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export function HeaderAvatar() {
  const { data } = useProfile();

  const getInitials = (name: string) => {
    if (!name || name.trim() === '') return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(data?.name ?? '');

  return (
    <TouchableOpacity
      onPress={() => router.push('/profile')}
      activeOpacity={0.7}
      style={styles.container}
    >
      <View style={styles.avatar}>
        <Text variant="s" weight="bold" color={colors.primary}>
          {initials}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: spacing.m,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
});
