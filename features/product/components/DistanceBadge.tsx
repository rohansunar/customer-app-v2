import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface DistanceBadgeProps {
    value: number;
    unit: string;
    style?: ViewStyle;
}

export const DistanceBadge = React.memo(({ value, unit, style }: DistanceBadgeProps) => {
    return (
        <View style={[styles.container, style]}>
            <Ionicons name="location" size={12} color={colors.primary} />
            <Text style={styles.text}>
                {value} {unit} away
            </Text>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.s,
        borderRadius: spacing.radius.circle,
        gap: 4,
        // Shadow for elevation
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3.84,
        elevation: 3,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.border,
    },
    text: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textPrimary,
    },
});
