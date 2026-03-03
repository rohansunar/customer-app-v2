import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Button } from '@/core/ui/Button';
import { Text } from '@/core/ui/Text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onTopUp: (amount: number) => void;
}

export function TopUpModal({ visible, onClose, onTopUp }: Props) {
  const [amount, setAmount] = useState(500); // Initialized to 500

  const handleIncrement = () => setAmount((prev) => prev + 100);
  const handleDecrement = () => setAmount((prev) => Math.max(0, prev - 100));

  const handleManualInput = (val: string) => {
    const num = parseInt(val.replace(/[^0-9]/g, ''), 10);
    setAmount(isNaN(num) ? 0 : num);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.content}>
          <View style={styles.dragHandle} />

          <View style={styles.header}>
            <Text variant="l" weight="bold">
              Add Funds
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <IconSymbol name="xmark" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text color={colors.textSecondary} style={styles.label}>
            How much would you like to add?
          </Text>

          <View style={styles.amountContainer}>
            <TouchableOpacity
              onPress={handleDecrement}
              style={[styles.actionBtn, amount <= 0 && styles.disabledBtn]}
              disabled={amount <= 0}
            >
              <IconSymbol name="minus" size={24} color={colors.primary} />
            </TouchableOpacity>

            <View style={styles.inputSection}>
              <Text
                variant="xl"
                weight="bold"
                color={colors.primary}
                style={styles.currencySymbol}
              >
                ₹
              </Text>
              <TextInput
                value={amount.toString()}
                onChangeText={handleManualInput}
                keyboardType="numeric"
                style={styles.input}
                textAlign="center"
                underlineColorAndroid="transparent"
              />
            </View>

            <TouchableOpacity
              onPress={handleIncrement}
              style={styles.actionBtn}
            >
              <IconSymbol name="plus" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.quickSelect}>
            {[500, 1000, 2000, 5000].map((val) => (
              <TouchableOpacity
                key={val}
                style={[styles.chip, amount === val && styles.activeChip]}
                onPress={() => setAmount(val)}
              >
                <Text
                  variant="s"
                  weight="medium"
                  color={amount === val ? colors.surface : colors.textSecondary}
                >
                  ₹{val}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Button
            title={`Top Up ₹${amount}`}
            onPress={() => onTopUp(amount)}
            disabled={amount <= 0}
            style={styles.topUpButton}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
  content: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? spacing.xxl : spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.m,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  closeBtn: {
    padding: spacing.s,
    backgroundColor: colors.background,
    borderRadius: 20,
  },
  label: {
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.l,
    backgroundColor: colors.background,
    padding: spacing.m,
    borderRadius: spacing.radius.l,
  },
  actionBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  inputSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.l,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingBottom: spacing.xs,
    minWidth: 120,
    justifyContent: 'center',
  },
  currencySymbol: {
    marginRight: spacing.xs,
  },
  input: {
    fontSize: 40,
    fontWeight: '800',
    color: colors.textPrimary,
    minWidth: 80,
    padding: 0,
    margin: 0,
  },
  quickSelect: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.s,
    marginBottom: spacing.xl,
  },
  chip: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  topUpButton: {
    height: 56,
    borderRadius: spacing.radius.l,
  },
});
