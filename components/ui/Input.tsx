import { AppConfig } from "@/constants";
import { useThemeColor } from "@/hooks";
import React, { forwardRef } from "react";
import { StyleSheet, Text, TextInputProps, TextStyle, View, ViewStyle } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { ThemedText } from "../layout";

interface CustomInputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
    labelStyle?: TextStyle;
    required?: boolean;
};

const Input = forwardRef<TextInput, CustomInputProps>(({
    label,
    error,
    containerStyle,
    inputStyle,
    labelStyle,
    required = false,
    ...textInputProps
}, ref) => {
    const inputColor = useThemeColor('text')
    const inputBackgroundColor = useThemeColor('input');
    const placeholderTextColor = useThemeColor('placeholder');
    const errorColor = useThemeColor('error');
    const hasError = Boolean(error);

    return (
        <View style={containerStyle}>
            {label && (
                <ThemedText style={[styles.label, labelStyle]}>
                    {label}
                    {required && <Text style={styles.required}> * </Text>}
                </ThemedText>
            )}
            <TextInput
                ref={ref}
                style={[
                    { backgroundColor: inputBackgroundColor, color: inputColor },
                    styles.input,
                    hasError && { outlineWidth: 1, outlineColor: errorColor, },
                    inputStyle,
                ]}
                placeholderTextColor={placeholderTextColor}
                {...textInputProps}
            />
            <Text style={[{ color: errorColor }, styles.errorText]}>{error}</Text>
        </View>
    );
});


export default Input;

const styles = StyleSheet.create({
    label: {
        marginBottom: AppConfig.SPACING.sm,
        marginLeft: AppConfig.SPACING.md,
        fontSize: AppConfig.FONT_SIZES.sm,
        fontWeight: '600',
    },
    required: {
        color: '#DC2626',
    },
    input: {
        paddingVertical: AppConfig.SPACING.md,
        paddingHorizontal:  AppConfig.SPACING.md,
        fontSize: 16,
        borderRadius: AppConfig.BORDER_RADIUS.full,
    },
    errorText: {
        marginTop: AppConfig.SPACING.xs,
        marginLeft: AppConfig.SPACING.md,
        fontSize: AppConfig.FONT_SIZES.sm,
    },
});