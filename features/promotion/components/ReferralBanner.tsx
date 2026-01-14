import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Button } from '@/core/ui/Button';
import { Card } from '@/core/ui/Card';
import { Text } from '@/core/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface Props {
  onPressItem: () => void;
}

export function ReferralBanner({ onPressItem }: Props) {
  return (
    <Card style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="gift" size={32} color={colors.white} opacity={0.3} />
        <View style={styles.textContainer}>
          <Text variant="s" weight="bold" color={colors.white}>
            Refer & Get 2 Free Jars!
          </Text>
          <Text variant="xs" color={colors.white} style={styles.subtitle}>
            Invite friends and earn rewards.
          </Text>
        </View>
        <Button
          title="Invite Now"
          onPress={onPressItem}
          variant="ghost"
          style={styles.ctaButton}
          textStyle={styles.ctaText}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    marginBottom: spacing.m,
    overflow: 'hidden',
    padding: 0,
    borderWidth: 0,
  },

  content: {
    flexDirection: 'row',
    padding: spacing.s,
    alignItems: 'center',
  },

  textContainer: {
    flex: 1,
    marginLeft: spacing.m,
  },

  subtitle: {
    marginTop: 0,
    marginBottom: spacing.xs,
    lineHeight: 14,
    opacity: 0.9,
  },

  ctaButton: {
    backgroundColor: colors.white,
    paddingVertical: 4,
    paddingHorizontal: spacing.m,
    borderRadius: spacing.radius.s,
    minHeight: 28,
  },

  ctaText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 12,
  },
});
