import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

interface Props extends ViewProps {
    variant?: 'elevated' | 'outlined' | 'flat';
}

export function Card({ style, variant = 'elevated', ...props }: Props) {
    const getStyle = () => {
        switch (variant) {
            case 'elevated':
                return styles.elevated;
            case 'outlined':
                return styles.outlined;
            case 'flat':
                return styles.flat;
            default:
                return styles.elevated;
        }
    };

    return (
        <View style={[styles.base, getStyle(), style]} {...props} />
    );
}

const styles = StyleSheet.create({
    base: {
        backgroundColor: colors.surface,
        borderRadius: spacing.radius.l,
        padding: spacing.m,
    },
    elevated: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    outlined: {
        borderWidth: 1,
        borderColor: colors.border,
    },
    flat: {
        backgroundColor: colors.surface, // Or transparent if desired
    },
});
