import { colors } from './colors';

export const statusColors = {
    // Order Statuses
    PENDING: {
        background: '#FFF3CD',
        text: '#856404',
    },
    CONFIRMED: {
        background: '#D4EDDA',
        text: '#155724',
    },
    OUT_FOR_DELIVERY: {
        background: '#D1ECF1',
        text: '#0C5460',
    },
    DELIVERED: {
        background: '#D4EDDA',
        text: '#155724',
    },
    CANCELLED: {
        background: '#F8D7DA',
        text: '#721C24',
    },

    // Subscription Statuses
    ACTIVE: {
        background: colors.surfaceHighlight,
        text: colors.primary,
        border: colors.primary,
    },
    PAUSED: {
        background: colors.background,
        text: colors.textSecondary,
        border: colors.border,
    },
} as const;

export type AppStatus = keyof typeof statusColors;
