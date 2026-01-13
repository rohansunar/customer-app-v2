import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Button } from '@/core/ui/Button';
import { Text } from '@/core/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Share, StyleSheet, TouchableOpacity, View } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function ReferralModal({ visible, onClose }: Props) {
  const referralCode = 'WATER2024'; // Mock code

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join me on Water-v2 and get your first jars for free! Use my referral code: ${referralCode}`,
      });
    } catch (error) {
      console.error('Sharing failed:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text variant="l" weight="bold">
              Invite Friends
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.illustration}>
              <Ionicons name="people-circle" size={80} color={colors.primary} />
            </View>

            <Text centered variant="m" weight="semibold">
              Get 2 Free Water Jars!
            </Text>
            <Text
              centered
              variant="s"
              color={colors.textSecondary}
              style={styles.description}
            >
              Share your referral code with friends. When they place their first
              order, you'll receive 2 free jars of water.
            </Text>

            <View style={styles.codeContainer}>
              <Text variant="xs" color={colors.textTertiary}>
                YOUR REFERRAL CODE
              </Text>
              <Text
                variant="xl"
                weight="bold"
                color={colors.primary}
                style={styles.code}
              >
                {referralCode}
              </Text>
            </View>

            <Button
              title="Share Invite Link"
              onPress={handleShare}
              style={styles.shareButton}
              icon={
                <Ionicons name="share-social" size={20} color={colors.white} />
              }
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: spacing.radius.xl,
    borderTopRightRadius: spacing.radius.xl,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: spacing.xs,
  },
  content: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  illustration: {
    marginBottom: spacing.m,
  },
  description: {
    marginTop: spacing.s,
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  codeContainer: {
    backgroundColor: colors.background,
    padding: spacing.l,
    borderRadius: spacing.radius.m,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    width: '100%',
    marginBottom: spacing.xl,
  },
  code: {
    letterSpacing: 2,
    marginTop: spacing.xs,
  },
  shareButton: {
    width: '100%',
    height: 54,
  },
});
