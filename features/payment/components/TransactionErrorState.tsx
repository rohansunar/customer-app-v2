import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Button } from '@/core/ui/Button';
import { Text } from '@/core/ui/Text';
import { IconSymbol } from '@/core/ui/icon-symbol';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface TransactionErrorStateProps {
    /** Called when user taps the Retry button. */
    onRetry: () => void;
}

/**
 * Displayed when fetching transactions fails.
 * Shows an error icon, message, and a retry button.
 */
export function TransactionErrorState({ onRetry }: TransactionErrorStateProps) {
    return (
        <View style={styles.container}>
            <View style={styles.iconWrapper}>
                <IconSymbol
                    name="xmark.circle.fill"
                    size={36}
                    color={colors.error + '90'}
                />
            </View>
            <Text weight="bold" variant="m" style={styles.title}>
                Failed to Load
            </Text>
            <Text
                variant="s"
                color={colors.textSecondary}
                style={styles.subtitle}
            >
                We couldn't fetch your transaction history. Check your connection and
                try again.
            </Text>
            <Button
                title="Retry"
                variant="outline"
                onPress={onRetry}
                style={styles.retryButton}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
        paddingHorizontal: spacing.l,
        backgroundColor: colors.surface,
        borderRadius: spacing.radius.l,
        borderWidth: 1,
        borderColor: colors.error + '30',
    },
    iconWrapper: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: colors.error + '10',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    title: {
        marginBottom: spacing.s,
        color: colors.textPrimary,
    },
    subtitle: {
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: spacing.l,
    },
    retryButton: {
        minWidth: 100,
        borderColor: colors.error + '60',
    },
});
