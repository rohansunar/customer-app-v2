import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Text } from '@/core/ui/Text';
import { IconSymbol } from '@/core/ui/icon-symbol';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useWalletTransactions } from '../hooks/useWalletTransactions';
import { TransactionEmptyState } from './TransactionEmptyState';
import { TransactionErrorState } from './TransactionErrorState';
import { TransactionItem } from './TransactionItem';
import { TransactionListSkeleton } from './TransactionListSkeleton';

/** Number of transactions shown before "View All" is tapped. */
const DEFAULT_VISIBLE_COUNT = 5;

/**
 * Recent Transactions section component.
 *
 * Designed to be embedded inside a parent ScrollView (e.g. profile.tsx)
 * rather than managing its own scroll, since pull-to-refresh is handled
 * by the parent's RefreshControl.
 *
 * States:
 * - Loading → animated skeleton placeholders
 * - Error   → error card with retry button
 * - Empty   → empty-state illustration
 * - Data    → sorted transaction list (newest first) with show-all toggle
 */
export function RecentTransactions() {
    const { data, isLoading, isError, refetch } = useWalletTransactions();
    const [showAll, setShowAll] = useState(false);

    // Sort newest-first (ISO strings sort lexicographically)
    const sorted = data
        ? [...data].sort((a, b) => {
            const dateA = a?.createdAt || a?.date || '';
            const dateB = b?.createdAt || b?.date || '';
            return dateB.localeCompare(dateA);
        })
        : [];
    const visible = showAll ? sorted : sorted.slice(0, DEFAULT_VISIBLE_COUNT);
    const hasMore = sorted.length > DEFAULT_VISIBLE_COUNT;

    return (
        <View style={styles.section}>
            {/* Section header */}
            <View style={styles.header}>
                <Text variant="l" weight="bold">
                    Recent Transactions
                </Text>
                {!isLoading && !isError && hasMore && (
                    <TouchableOpacity
                        onPress={() => setShowAll((prev) => !prev)}
                        style={styles.toggleBtn}
                        accessibilityRole="button"
                        accessibilityLabel={showAll ? 'Show fewer transactions' : 'View all transactions'}
                    >
                        <Text variant="s" weight="medium" color={colors.primary}>
                            {showAll ? 'Show Less' : 'View All'}
                        </Text>
                        <IconSymbol
                            name={showAll ? 'chevron.up' : 'chevron.down'}
                            size={14}
                            color={colors.primary}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {/* Content */}
            <View style={styles.listContainer}>
                {isLoading && <TransactionListSkeleton count={DEFAULT_VISIBLE_COUNT} />}

                {!isLoading && isError && (
                    <TransactionErrorState onRetry={refetch} />
                )}

                {!isLoading && !isError && sorted.length === 0 && (
                    <TransactionEmptyState />
                )}

                {!isLoading && !isError && visible.map((tx) => (
                    <TransactionItem key={tx.id} transaction={tx} />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        paddingHorizontal: spacing.l,
        paddingBottom: spacing.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    toggleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.s,
        backgroundColor: colors.primary + '10',
        borderRadius: spacing.radius.circle,
    },
    listContainer: {
        gap: spacing.s,
    },
});
