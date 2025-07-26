import { StyleSheet, Text, TextInputProps, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

type CustomInputProps = {
    label?: string;
    error?: string;
    containerStyle?: object;
    inputStyle?: object;
} & TextInputProps;


export default function Input({ label, error, containerStyle, inputStyle, ...textInputProps } : CustomInputProps) {
    return (
        <View>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    inputStyle,
                    error && { borderColor: '#DC2626' },
                ]}
                placeholderTextColor="#9CA3AF"
                {...textInputProps}
            >
                {error && <Text style={styles.errorText}>{error}</Text>}
            </TextInput>
        </View>
    );
}

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
    errorText: {
        marginTop: 4,
        fontSize: 12,
        color: '#DC2626', // red-600
    },
});