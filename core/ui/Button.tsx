import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import React from 'react';
import { ActivityIndicator, StyleSheet, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { Text } from './Text';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface Props {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    icon?: React.ReactNode;
}

export function Button({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    style,
    textStyle,
    icon,
}: Props) {
    const getBackgroundColor = () => {
        if (disabled) return colors.textTertiary;
        switch (variant) {
            case 'primary': return colors.primary;
            case 'secondary': return colors.secondary;
            case 'outline': return 'transparent';
            case 'ghost': return 'transparent';
            default: return colors.primary;
        }
    };

    const getTextColor = () => {
        if (disabled) return colors.surface;
        switch (variant) {
            case 'primary': return colors.surface;
            case 'secondary': return colors.textPrimary;
            case 'outline': return colors.primary;
            case 'ghost': return colors.primary;
            default: return colors.surface;
        }
    };

    const getBorder = () => {
        if (variant === 'outline' && !disabled) {
            return { borderWidth: 1, borderColor: colors.primary };
        }
        return {};
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                styles.container,
                { backgroundColor: getBackgroundColor() },
                getBorder(),
                style,
            ]}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <>
                    {icon}
                    <Text
                        weight="semibold"
                        style={[
                            styles.text,
                            { color: getTextColor(), marginLeft: icon ? spacing.s : 0 },
                            textStyle,
                        ]}
                    >
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: spacing.m,
        paddingHorizontal: spacing.l,
        borderRadius: spacing.radius.m,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
    },
    text: {
        fontSize: 16,
    },
});
