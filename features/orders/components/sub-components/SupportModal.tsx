import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Button } from '@/core/ui/Button';
import { Text } from '@/core/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSubmitSupportTicket } from '../../hooks/useSubmitSupportTicket';

interface Props {
  visible: boolean;
  onClose: () => void;
  orderNo: string;
}

const SUBJECTS = [
  'Order issues',
  'Delivery delay',
  'Wrong item',
  'Payment issue',
  'Other',
];

export default function SupportModal({ visible, onClose, orderNo }: Props) {
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [message, setMessage] = useState('');
  const submitTicket = useSubmitSupportTicket();

  const handleSubmit = () => {
    if (!message.trim()) return;

    submitTicket.mutate(
      { orderNo, subject, message },
      {
        onSuccess: () => {
          setMessage('');
          onClose();
        },
      },
    );
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
            <View>
              <Text variant="l" weight="bold">
                Contact Support
              </Text>
              <Text variant="s" color={colors.textSecondary}>
                Order #{orderNo}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <Text variant="m" weight="semibold" style={styles.sectionTitle}>
              What can we help you with?
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={subject}
                onValueChange={(itemValue) => setSubject(itemValue)}
              >
                {SUBJECTS.map((s) => (
                  <Picker.Item key={s} label={s} value={s} />
                ))}
              </Picker>
            </View>

            <Text variant="m" weight="semibold" style={styles.sectionTitle}>
              Message
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Describe your issue here..."
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={6}
              value={message}
              onChangeText={setMessage}
              textAlignVertical="top"
            />
          </ScrollView>

          <View style={styles.footer}>
            <Button
              title={submitTicket.isPending ? 'Submitting...' : 'Send Message'}
              onPress={handleSubmit}
              disabled={submitTicket.isPending || !message.trim()}
              loading={submitTicket.isPending}
              style={styles.submitButton}
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
    maxHeight: '80%',
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
    padding: spacing.l,
  },
  sectionTitle: {
    marginBottom: spacing.s,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.radius.m,
    marginBottom: spacing.l,
    backgroundColor: colors.background,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.radius.m,
    padding: spacing.m,
    backgroundColor: colors.background,
    color: colors.textPrimary,
    minHeight: 120,
    fontSize: 16,
  },
  footer: {
    padding: spacing.l,
    paddingBottom: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  submitButton: {
    height: 54,
  },
});
