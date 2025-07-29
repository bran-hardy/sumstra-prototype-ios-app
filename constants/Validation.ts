
// Validation Rules
export const ValidationRules = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD_MIN_LENGTH: 6,
    TRANSACTION_DESCRIPTION_MAX_LENGTH: 100,
    AMOUNT_MAX: 999999.99,
    AMOUNT_MIN: 0.01,
} as const;