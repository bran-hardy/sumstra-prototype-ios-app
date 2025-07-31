import { AppConfig } from "@/constants";
import { useHaptic, useThemeColor } from "@/hooks";
import { BlurView } from "expo-blur";
import { LucideIcon } from "lucide-react-native";
import { StyleSheet, Text, TextStyle, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

type ButtonProps = {
    title?: string;
    size?: number;
    onPress: () => void;
    disabled?: boolean;
    buttonStyle?: object;
    textStyle?: TextStyle;
    lightColor?: string;
    darkColor?: string;
    Icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
    hapticFeedback?: boolean;
    scaleOnPress?: boolean;
    blurred?: boolean;
}

export default function Button({
        title,
        size = 24,
        onPress,
        disabled = false,
        buttonStyle,
        textStyle,
        lightColor,
        darkColor,
        Icon,
        iconPosition = 'left',
        hapticFeedback = true,
        scaleOnPress = true,
        blurred = false
    } : ButtonProps) {
    const { onTap } = useHaptic();
    const color = useThemeColor('text', { light: lightColor, dark: darkColor }, );
    const backgroundColor = useThemeColor('background', { light: lightColor, dark: darkColor });

    const tap = Gesture.Tap()
        .numberOfTaps(1)
        .onStart(() => {
            runOnJS(onTap)();
            runOnJS(onPress)();
        });

    return (
        <GestureDetector gesture={tap}>
            <View style={[
                    styles.button,
                    !blurred ? { backgroundColor } : null,
                    buttonStyle,
                    disabled && styles.disabled
                ]}>
                {blurred && (
                    <BlurView
                        tint="systemChromeMaterial"
                        intensity={100}
                        style={[styles.blurredBg]}
                    />
                )}
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
            </View>
        </GestureDetector>
    );
}

const styles = StyleSheet.create({
    button: {
        position: 'relative',
        padding: AppConfig.SPACING.md,
        borderRadius: AppConfig.BORDER_RADIUS.xxl,
        alignItems: 'center',
        overflow: 'hidden',
    },
    blurredBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    text: {
        fontWeight: '700',
        fontSize: AppConfig.FONT_SIZES.md,
    },
    disabled: {
        opacity: 0.5,
    },
    pressed: {
        opacity: 0.75,
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: AppConfig.SPACING.sm,
    },
    icon: {
        marginHorizontal: 0,
    }
});