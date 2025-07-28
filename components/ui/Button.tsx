import { useThemeColor } from "@/hooks/useThemeColor";
import { LucideIcon } from "lucide-react-native";
import { GestureResponderEvent, Pressable, PressableProps, StyleSheet, Text, TextStyle, View } from "react-native";

interface CustomButtonProps extends PressableProps {
    title?: string;
    size?: number;
    onPress: (event: GestureResponderEvent) => void;
    disabled?: boolean;
    buttonStyle?: object;
    textStyle?: TextStyle;
    lightColor?: string,
    darkColor?: string,
    Icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
}

export default function Button({ title, size = 24, onPress, disabled = false, buttonStyle, textStyle, lightColor, darkColor, Icon, iconPosition = 'left'} : CustomButtonProps) {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                styles.button,
                { backgroundColor },
                disabled && styles.disabled,
                pressed && !disabled && styles.pressed,
                buttonStyle,
            ]}
        >
            <View style={styles.contentRow}>
                {Icon && iconPosition === 'left' && (
                    <Icon size={size} color={color} style={styles.icon} />
                )}
                {title && (
                    <Text style={[{ color }, styles.text, textStyle]}>
                        {title}
                    </Text>
                )}
                {Icon && iconPosition === 'right' && (
                    <Icon size={size} color={color} style={styles.icon} />
                )}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        //backgroundColor: '#1D4ED8', // blue-700
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center'
    },
    text: {
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