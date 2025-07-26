import { LucideIcon } from "lucide-react-native";
import { GestureResponderEvent, Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

type CustomButtonProps = {
    title?: string;
    onPress: (event: GestureResponderEvent) => void;
    disabled?: boolean;
    buttonStyle?: ViewStyle;
    textStyle?: TextStyle;
    Icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
}

export default function Button({ title, onPress, disabled = false, buttonStyle, textStyle, Icon, iconPosition = 'left'} : CustomButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                styles.button,
                disabled && styles.disabled,
                pressed && !disabled && styles.pressed,
                buttonStyle,
            ]}
        >
            <View style={styles.contentRow}>
                {Icon && iconPosition === 'left' && (
                    <Icon size={24} color="white" style={styles.icon} />
                )}
                {title && (
                    <Text style={[styles.text, textStyle]}>
                        {title}
                    </Text>
                )}
                {Icon && iconPosition === 'right' && (
                    <Icon size={24} color="white" style={styles.icon} />
                )}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#1D4ED8', // blue-700
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    text: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 16,
    },
    disabled: {
        backgroundColor: '#9CA3AF', // gray-400
    },
    pressed: {
        opacity: 0.75,
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    icon: {
        marginHorizontal: 0,
    }
});