import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { Text } from './Text';

interface Props extends TextInputProps {
    label?: string;
    error?: string;
}

export function Input({ label, error, style, ...props }: Props) {
    return (
        <View style={styles.container}>
            {label && (
                <Text variant="s" weight="medium" style={styles.label}>
                    {label}
                </Text>
            )}
            <TextInput
                style={[
                    styles.input,
                    error ? styles.inputError : null,
                    style,
                ]}
                placeholderTextColor={colors.textTertiary}
                {...props}
            />
            {error && (
                <Text variant="xs" color={colors.error} style={styles.error}>
                    {error}
                </Text>
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
    input: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: spacing.radius.m,
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.s + 2, // ~10px
        fontSize: typography.size.m,
        color: colors.textPrimary,
    },
    inputError: {
        borderColor: colors.error,
    },
    error: {
        marginTop: spacing.xs,
    },
});
