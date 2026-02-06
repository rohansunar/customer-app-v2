import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Text } from '@/core/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface QuantitySelectorProps {
    quantity: number;
    onIncrement: () => void;
    onDecrement: () => void;
}

export function QuantitySelector({ quantity, onIncrement, onDecrement }: QuantitySelectorProps) {
    return (
        <View style={styles.qtySection}>
            <View>
                <Text variant="m" weight="semibold">Quantity</Text>
                <Text variant="xs" color={colors.textSecondary}>Per delivery</Text>
            </View>
            <View style={styles.qtyControls}>
                <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={onDecrement}
                >
                    <Ionicons name="remove" size={20} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text variant="l" weight="bold" style={styles.qtyText}>
                    {quantity}
                </Text>
                <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={onIncrement}
                >
                    <Ionicons name="add" size={20} color={colors.textPrimary} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    qtySection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    qtyControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.m,
        backgroundColor: colors.background,
        padding: spacing.xs,
        borderRadius: spacing.radius.l,
        borderWidth: 1,
        borderColor: colors.border,
    },
    qtyBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    qtyText: {
        minWidth: 24,
        textAlign: 'center',
    },
});
