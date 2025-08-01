import { ValidationRules } from "./Validation";

// App Configuration
export const AppConfig = {
    // Navigation
    TAB_BAR_HEIGHT: 80,
    HEADER_HEIGHT: 60,

    // UI Constants
    BORDER_RADIUS: {
        small: 4,
        medium: 8,
        large: 12,
        xl: 16,
        xxl: 32,
        full: 50,
    },

    SPACING: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },

    FONT_SIZES: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
        xxxl: 32,
    },

    // Animation durations (in milliseconds)
    ANIMATION_DURATION: {
        fast: 150,
        normal: 300,
        slow: 500,
    },

    // FlatList optimization
    FLATLIST_CONFIG: {
        windowSize: 5,
        maxToRenderPerBatch: 10,
        updateCellsBatchingPeroid: 50,
        initialNumToRender: 10,
        removeClippedSubviews: true,
    },
} as const;


// Date Format Options
export const DateFormats = {
    SHORT: { month: 'short', day: 'numeric' },
    LONG: { year: 'numeric', month: 'long', day: 'numeric' },
    FULL: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    },
} as const;

// Category Names
export const Category = {
    INCOME: "INCOME",
    WANT: "WANT",
    NEED: "NEED",
    SAVING: "SAVING",
} as const;

// Error Messages
export const ErrorMessages = {
    NETWORK_ERROR: 'Network error. Please check you connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    VALIDATION_FAILED: 'Please check your input and try again.',
    GENERIC_ERROR: 'Something went wrong. Please try again.',
    TRANSACTION_NOT_FOUND: 'Transaction not found.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    PASSWORD_TOO_SHORT: `Password must be at least ${ValidationRules.PASSWORD_MIN_LENGTH} characters long.`
} as const;