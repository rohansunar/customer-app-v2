import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Text } from '@/core/ui/Text';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { subscriptionTypeConfigs } from '../config/subscriptionTypes';
import { DayOfWeek, SubscriptionType } from '../types';

interface FrequencySelectorProps {
    selectedFrequency: SubscriptionType;
    onSelectFrequency: (frequency: SubscriptionType) => void;
    selectedCustomDays: DayOfWeek[];
    onToggleCustomDay: (day: DayOfWeek) => void;
}

const DAYS: DayOfWeek[] = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
];

export function FrequencySelector({
    selectedFrequency,
    onSelectFrequency,
    selectedCustomDays,
    onToggleCustomDay,
}: FrequencySelectorProps) {
    return (
        <View>
            <Text variant="s" weight="bold" style={styles.subTitle}>
                Frequency
            </Text>
            <View style={styles.typeRow}>
                {subscriptionTypeConfigs.map((config) => (
                    <TouchableOpacity
                        key={config.type}
                        style={[
                            styles.typeOptionCompact,
                            selectedFrequency === config.type && styles.selectedTypeOption,
                        ]}
                        onPress={() => onSelectFrequency(config.type)}
                    >
                        <Text
                            weight="semibold"
                            variant="xs"
                            color={
                                selectedFrequency === config.type
                                    ? colors.primary
                                    : colors.textPrimary
                            }
                        >
                            {config.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {selectedFrequency === 'CUSTOM_DAYS' && (
                <View style={styles.daysContainerCompact}>
                    {DAYS.map((day) => (
                        <TouchableOpacity
                            key={day}
                            style={[
                                styles.dayChipCompact,
                                selectedCustomDays.includes(day) && styles.selectedDayChip,
                            ]}
                            onPress={() => onToggleCustomDay(day)}
                        >
                            <Text
                                variant="xs"
                                weight="medium"
                                color={
                                    selectedCustomDays.includes(day)
                                        ? colors.primary
                                        : colors.textSecondary
                                }
                            >
                                {day.substring(0, 3)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    subTitle: {
        marginBottom: spacing.s,
        color: colors.textSecondary,
    },
    typeRow: {
        flexDirection: 'row',
        gap: spacing.s,
        marginBottom: spacing.m,
    },
    typeOptionCompact: {
        flex: 1,
        paddingVertical: spacing.s,
        paddingHorizontal: spacing.xs,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: spacing.radius.m,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedTypeOption: {
        borderColor: colors.primary,
        backgroundColor: colors.primary + '10',
    },
    daysContainerCompact: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.xs,
        marginTop: spacing.s,
    },
    dayChipCompact: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface,
    },
    selectedDayChip: {
        borderColor: colors.primary,
        backgroundColor: colors.primary + '10',
    },
});
