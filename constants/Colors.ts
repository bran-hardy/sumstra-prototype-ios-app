/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
    light: {
        text: '#11181C',
        background: '#fff',
        tint: tintColorLight,
        icon: '#687076',
        tabIconDefault: '#687076',
        tabIconSelected: tintColorLight,
    },
    dark: {
        text: '#ECEDEE',
        background: '#151718',
        tint: tintColorDark,
        icon: '#9BA1A6',
        tabIconDefault: '#9BA1A6',
        tabIconSelected: tintColorDark,
    }
};

export const CategoryColors = {
    NEED: {
        light: '#ff690055',
        dark: '#813600',
    },
    WANT: {
        light: '#00bba755',
        dark: '#006d62',
    },
    SAVING: {
        light: '#00c95155',
        dark: '#005823',
    },
    INCOME: {
        light: '#28a74555',
        dark: '#1e5f32',
    },
} as const;

export type CategoryType = keyof typeof CategoryColors;

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

// Validation Rules
export const ValidationRules = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD_MIN_LENGTH: 6,
    TRANSACTION_DESCRIPTION_MAX_LENGTH: 100,
    AMOUNT_MAX: 999999.99,
    AMOUNT_MIN: 0.01,
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