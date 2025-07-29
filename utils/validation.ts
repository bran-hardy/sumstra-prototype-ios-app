import { ValidationRules } from "@/constants";

export const validateEmail = (email: string): boolean => {
    return ValidationRules.EMAIL.test(email);
}

export const validatePassword = (password: string): boolean => {
    return password.length >= ValidationRules.PASSWORD_MIN_LENGTH;
}

export const validateAmount = (amount: number): boolean => {
    return amount > ValidationRules.AMOUNT_MIN && amount <= ValidationRules.AMOUNT_MAX;
}