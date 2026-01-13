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
        <View style={styles.textSection}>
          <Text variant="s" weight="bold" color={colors.white}>
            Refer & Get 2 Free Jars!
          </Text>
          <Text variant="xs" color={colors.white} style={styles.subtitle}>
            Invite friends and earn rewards.
          </Text>
          <Button
            title="Invite Now"
            onPress={onPressItem}
            variant="ghost"
            style={styles.ctaButton}
            textStyle={styles.ctaText}
          />
        </View>
        <View style={styles.iconSection}>
          <Ionicons name="gift" size={32} color={colors.white} opacity={0.3} />
        </View>
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
  textSection: {
    flex: 2,
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
    alignSelf: 'flex-start',
    minHeight: 28,
  },
  ctaText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  iconSection: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
