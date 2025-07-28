import React, { forwardRef } from "react";
import { StyleSheet, Text, TextInputProps, TextStyle, View, ViewStyle } from "react-native";
import { TextInput } from "react-native-gesture-handler";

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
    const hasError = Boolean(error);

    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <Text style={[styles.label, labelStyle]}>
                    {label}
                    {required && <Text style={styles.required}> * </Text>}
                </Text>
            )}
            <TextInput
                ref={ref}
                style={[
                    styles.input,
                    hasError && styles.inputError,
                    inputStyle,
                ]}
                placeholderTextColor="#9CA3AF"
                {...textInputProps}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
});

Input.displayName = 'Input';

export default Input;

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        width: '100%',
    },
    label: {
        marginBottom: 6,
        fontSize: 14,
        fontWeight: '500',
        color: '#374151', // gray-700
    },
    required: {
        color: '#DC2626',
    },
    input: {
        paddingVertical: 14,
        paddingHorizontal: 14,
        fontSize: 16,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#D1D5DB', // gray-300
        backgroundColor: '#F9FAFB', // gray-50
        color: '#111827', // gray-900
    },
    inputError: {
        borderColor: '#DC2626',
        backgroundColor: '#FEF2F2',
    },
    errorText: {
        marginTop: 4,
        fontSize: 12,
        color: '#DC2626', // red-600
    },
});