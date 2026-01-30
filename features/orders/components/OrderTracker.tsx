import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Text } from '@/core/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { OrderStatus } from '../types';
import { calculateTrackerProgress, getStepIndexForStatus } from '../utils/orderHelpers';

interface OrderTrackerProps {
    status: OrderStatus;
}

const STEPS = [
    {
        key: 'processing',
        label: 'Processing',
        icon: 'time-outline' as const,
        activeIcon: 'time' as const,
        statuses: ['PENDING', 'CONFIRMED', 'PROCESSING'],
    },
    {
        key: 'ontheway',
        label: 'On the Way',
        icon: 'car-outline' as const,
        activeIcon: 'car' as const,
        statuses: ['OUT_FOR_DELIVERY'],
    },
    {
        key: 'delivered',
        label: 'Delivered',
        icon: 'checkmark-circle-outline' as const,
        activeIcon: 'checkmark-circle' as const,
        statuses: ['DELIVERED'],
    },
];

/**
 * OrderTracker component displays order progress with animated progress bar
 * Optimized with React.memo and utility helpers
 */
function OrderTrackerComponent({ status }: OrderTrackerProps) {
    // Use centralized utility function for step calculation
    const activeIndex = useMemo(() => getStepIndexForStatus(status), [status]);
    const progress = useSharedValue(0);

    useEffect(() => {
        // Use centralized utility function for progress calculation
        const target = calculateTrackerProgress(activeIndex);
        progress.value = withTiming(target, { duration: 500 });
    }, [activeIndex, progress]);

    const animatedStyle = useAnimatedStyle(() => ({
        width: `${progress.value * 100}%`,
    }));

    const renderStep = useMemo(() => {
        return (step: typeof STEPS[0], index: number) => {
            const isActive = index === activeIndex;
            const isCompleted = index < activeIndex;
            const isFuture = index > activeIndex;

            const activeColor = colors.warning;
            const inactiveColor = colors.border;
            const completedColor = colors.warning;

            let content;
            if (isActive) {
                content = (
                    <View style={[styles.iconCircle, styles.activeCircle, { backgroundColor: activeColor }]}>
                        <Ionicons name={step.activeIcon} size={20} color={colors.white} />
                    </View>
                );
            } else if (isCompleted) {
                content = (
                    <View style={[styles.iconCircle, { backgroundColor: completedColor }]}>
                        <Ionicons name={step.activeIcon} size={20} color={colors.white} />
                    </View>
                );
            } else {
                content = (
                    <View style={[styles.iconCircle, { backgroundColor: colors.surface, borderColor: inactiveColor, borderWidth: 1 }]}>
                        <Ionicons name={step.icon} size={20} color={colors.textTertiary} />
                    </View>
                );
            }

            return (
                <View key={step.key} style={styles.stepContainer}>
                    {content}
                    <Text
                        variant="xs"
                        weight={isActive ? "bold" : "medium"}
                        color={isActive || isCompleted ? colors.textPrimary : colors.textTertiary}
                        style={styles.label}
                    >
                        {step.label}
                    </Text>
                </View>
            );
        };
    }, [activeIndex]);

    if (status === 'CANCELLED') {
        return (
            <View style={styles.container}>
                <Text color={colors.error} weight="bold">Order Cancelled</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Progress Bar Background */}
            <View style={styles.progressBarBackground}>
                {/* Animated Progress Fill */}
                <Animated.View style={[styles.progressBarFill, animatedStyle]} />
            </View>

            {/* Steps */}
            <View style={styles.stepsRow}>
                {STEPS.map((step, index) => renderStep(step, index))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: spacing.s,
        marginTop: spacing.s,
    },
    stepsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        position: 'relative',
        zIndex: 2,
    },
    stepContainer: {
        alignItems: 'center',
        width: 80,
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.xs,
        shadowColor: colors.warning,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    activeCircle: {
        shadowOpacity: 0.4,
        elevation: 5,
    },
    label: {
        textAlign: 'center',
    },
    progressBarBackground: {
        position: 'absolute',
        top: 24,
        left: 40,
        right: 40,
        height: 4,
        backgroundColor: '#F1F5F9',
        borderRadius: 2,
        zIndex: 1,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: colors.warning,
        borderRadius: 2,
    },
});

// Memoize component to prevent unnecessary re-renders
export default React.memo(OrderTrackerComponent);

