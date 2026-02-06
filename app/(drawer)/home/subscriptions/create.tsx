import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Button } from '@/core/ui/Button';
import { Text } from '@/core/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCreateSubscription } from '@/features/subscriptions/hooks/useCreateSubscription';
import { useSubscriptionForm } from '@/features/subscriptions/hooks/useSubscriptionForm';
import { SubscriptionRequest } from '@/features/subscriptions/types';
import { CalendarPicker } from '@/features/subscriptions/components/CalendarPicker';
import { SubscriptionSummary } from '@/features/subscriptions/components/SubscriptionSummary';
import { QuantitySelector } from '@/features/subscriptions/components/QuantitySelector';
import { FrequencySelector } from '@/features/subscriptions/components/FrequencySelector';
import { convertDaysToNumeric } from '@/features/subscriptions/utils/subscriptionUtils';

export default function CreateSubscriptionScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();

    const productId = params.productId as string;
    const productName = params.productName as string;
    const productPrice = parseFloat(params.productPrice as string || '0');
    const productImage = params.productImage as string;
    const productDescription = params.productDescription as string;

    const form = useSubscriptionForm();
    const createSubscription = useCreateSubscription();

    const handleSave = () => {
        const payload: SubscriptionRequest = {
            productId,
            frequency: form.state.frequency,
            start_date: form.state.selectedDate.toISOString().split('T')[0],
            custom_days:
                form.state.frequency === 'CUSTOM_DAYS'
                    ? convertDaysToNumeric(form.state.customDays)
                    : undefined,
            quantity: form.state.quantity,
        };

        createSubscription.mutate(payload, {
            onSuccess: () => {
                router.push('/(drawer)/home/subscriptions' as any);
            },
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text variant="l" weight="bold">Create Subscription</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <SubscriptionSummary
                        productName={productName}
                        productPrice={productPrice}
                        productImage={productImage}
                        productDescription={productDescription}
                        startDate={form.state.selectedDate}
                        quantity={form.state.quantity}
                        frequency={form.state.frequency}
                        customDays={convertDaysToNumeric(form.state.customDays)}
                    />

                    <Text variant="m" weight="bold" style={styles.sectionTitle}>
                        Configure Delivery
                    </Text>

                    <View style={styles.card}>
                        <QuantitySelector
                            quantity={form.state.quantity}
                            onIncrement={form.actions.incrementQty}
                            onDecrement={form.actions.decrementQty}
                        />

                        <View style={{ height: spacing.l }} />

                        <FrequencySelector
                            selectedFrequency={form.state.frequency}
                            onSelectFrequency={form.actions.setFrequency}
                            selectedCustomDays={form.state.customDays}
                            onToggleCustomDay={form.actions.toggleDay}
                        />
                    </View>

                    <View style={styles.dateSection}>
                        <Text variant="m" weight="bold" style={styles.sectionTitle}>
                            Select Start Date
                        </Text>
                        <CalendarPicker
                            selectedDate={form.state.selectedDate}
                            onSelectDate={form.actions.setSelectedDate}
                        />
                        <View style={styles.dateInfo}>
                            <Ionicons name="information-circle-outline" size={14} color={colors.textTertiary} />
                            <Text variant="xs" color={colors.textTertiary}>Subscriptions must start from tomorrow or later.</Text>
                        </View>
                    </View>

                    <View style={{ height: 100 }} />
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title={createSubscription.isPending ? 'Processing...' : 'Confirm & Subscribe'}
                    onPress={handleSave}
                    disabled={
                        createSubscription.isPending ||
                        (form.state.frequency === 'CUSTOM_DAYS' && form.state.customDays.length === 0)
                    }
                    loading={createSubscription.isPending}
                    style={styles.confirmButton}
                    variant="primary"
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.l,
        paddingVertical: spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.surface,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    container: {
        flex: 1,
    },
    content: {
        padding: spacing.l,
    },
    sectionTitle: {
        marginBottom: spacing.m,
        marginTop: spacing.s,
        color: colors.textPrimary,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: spacing.radius.xl,
        padding: spacing.l,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.xl,
    },
    dateSection: {
        marginBottom: spacing.xl,
    },
    dateInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginTop: spacing.s,
        paddingHorizontal: spacing.xs,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: spacing.l,
        paddingBottom: spacing.xl,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    confirmButton: {
        height: 56,
        borderRadius: spacing.radius.xl,
    },
});
