import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/core/ui/Text';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface FamilyMembersInputProps {
  value: number;
  onChange: (value: number) => void;
  error?: string | boolean;
  label?: string;
}

const MIN_VALUE = 1;
const MAX_VALUE = 20;

export function FamilyMembersInput({
  value,
  onChange,
  error,
  label = 'Family Members',
}: FamilyMembersInputProps) {
  const handleDecrement = () => {
    if (value > MIN_VALUE) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < MAX_VALUE) {
      onChange(value + 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="s" weight="medium" style={styles.label}>
        {label}
      </Text>
      <View
        style={[styles.inputContainer, error && styles.inputContainerError]}
      >
        <TouchableOpacity
          style={[styles.button, value <= MIN_VALUE && styles.buttonDisabled]}
          onPress={handleDecrement}
          disabled={value <= MIN_VALUE}
        >
          <Ionicons
            name="remove"
            size={20}
            color={value <= MIN_VALUE ? colors.textTertiary : colors.primary}
          />
        </TouchableOpacity>
        <View style={styles.valueContainer}>
          <Text variant="m" weight="semibold" style={styles.value}>
            {value}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.button, value >= MAX_VALUE && styles.buttonDisabled]}
          onPress={handleIncrement}
          disabled={value >= MAX_VALUE}
        >
          <Ionicons
            name="add"
            size={20}
            color={value >= MAX_VALUE ? colors.textTertiary : colors.primary}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.helperText}>
        This information helps us recommend more relevant products based on
        household needs.
      </Text>
      {error && typeof error === 'string' && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.m,
  },
  label: {
    marginBottom: spacing.xs,
    color: colors.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.radius.m,
    overflow: 'hidden',
  },
  inputContainerError: {
    borderColor: colors.error,
  },
  button: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  buttonDisabled: {
    backgroundColor: colors.border + '40',
  },
  valueContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.s + 2,
  },
  value: {
    fontSize: typography.size.l,
    color: colors.textPrimary,
  },
  helperText: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: spacing.xs,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: spacing.xs,
  },
});
