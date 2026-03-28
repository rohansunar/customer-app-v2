import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Text } from '@/core/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import SupportModal from '@/features/orders/components/sub-components/SupportModal';
import { useProfile } from '@/features/profile/hooks/useProfile';

interface SupportOption {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subject: string;
}

const SUPPORT_OPTIONS: SupportOption[] = [
  {
    icon: 'chatbubbles',
    label: 'Support And Feedback',
    subject: 'General Queries and Feedback',
  },
];

export default function SupportSection() {
  const { data } = useProfile();
  const [modalVisible, setModalVisible] = useState(false);

  const handleOptionPress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.optionsContainer}>
        {SUPPORT_OPTIONS.map((option, index) => (
          <TouchableOpacity
            key={option.label}
            style={[
              styles.optionRow,
              index < SUPPORT_OPTIONS.length - 1 && styles.optionRowBorder,
            ]}
            onPress={handleOptionPress}
            activeOpacity={0.7}
          >
            <View style={styles.optionContent}>
              <View style={styles.iconContainer}>
                <Ionicons name={option.icon} size={22} color={colors.primary} />
              </View>
              <Text variant="m" weight="medium" style={styles.optionLabel}>
                {option.label}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>
        ))}
      </View>

      <SupportModal
        visible={modalVisible}
        onClose={handleCloseModal}
        orderNo={undefined}
        isGeneralSupport={true}
        phone={data?.phone}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.l,
    marginTop: spacing.l,
  },
  title: {
    marginBottom: spacing.s,
    paddingHorizontal: spacing.xs,
  },
  optionsContainer: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.l,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.m,
    minHeight: 56,
  },
  optionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 35,
    height: 35,
    borderRadius: spacing.radius.s,
    backgroundColor: colors.primary + '12',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.s,
  },
  optionLabel: {
    flex: 1,
    marginRight: spacing.s,
  },
});
