import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Text } from '@/core/ui/Text';
import { IconSymbol } from '@/core/ui/icon-symbol';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WalletTransaction } from '../types';
import {
    formatTransactionAmount,
    formatTransactionDate,
    getAmountColor,
    getStatusColor,
    getStatusLabel,
    getTransactionColor,
    getTransactionIcon,
} from '../utils/transactionUtils';

interface TransactionItemProps {
    transaction: WalletTransaction;
}

/**
 * Renders a single wallet transaction row.
 *
 * Displays:
 * - Type icon with colour coding (green = credit, blue = debit)
 * - Description and formatted date/time
 * - Amount with sign prefix and en-IN locale formatting
 * - Optional status badge (pending / completed / failed)
 */
export function TransactionItem({ transaction }: TransactionItemProps) {
    const { type, amount, description, date, createdAt, status } = transaction;

    const iconName = getTransactionIcon(type) as any;
    const iconColor = getTransactionColor(type);
    const amountColor = getAmountColor(type);
    const amountText = formatTransactionAmount(type, amount);
    const dateText = formatTransactionDate(createdAt || date || '');
    const statusLabel = getStatusLabel(status);
    const statusColor = getStatusColor(status);

    return (
        <View style={styles.container}>
            {/* Icon */}
            <View
                style={[
                    styles.iconContainer,
                    { backgroundColor: iconColor + '15' },
                ]}
            >
                <IconSymbol name={iconName} size={22} color={iconColor} />
            </View>

            {/* Description + date */}
            <View style={styles.info}>
                <Text weight="medium" style={styles.description} numberOfLines={1}>
                    {description}
                </Text>
                <Text variant="xs" color={colors.textSecondary} style={styles.date}>
                    {dateText}
                </Text>
            </View>

            {/* Amount + status */}
            <View style={styles.right}>
                <Text weight="bold" color={amountColor} style={styles.amount}>
                    {amountText}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: statusColor + '18' }]}>
                    <Text variant="xs" weight="medium" color={statusColor}>
                        {statusLabel}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: spacing.m,
        borderRadius: spacing.radius.l,
        marginBottom: spacing.s,
        borderWidth: 1,
        borderColor: colors.border,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.m,
        flexShrink: 0,
    },
    info: {
        flex: 1,
        marginRight: spacing.s,
    },
    description: {
        fontSize: 14,
        marginBottom: 2,
    },
    date: {
        lineHeight: 16,
    },
    right: {
        alignItems: 'flex-end',
        gap: 4,
    },
    amount: {
        fontSize: 14,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: spacing.radius.circle,
    },
});
