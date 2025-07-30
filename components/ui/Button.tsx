import { AppConfig } from "@/constants";
import { useHaptic, useThemeColor } from "@/hooks";
import { BlurView } from "expo-blur";
import { LucideIcon } from "lucide-react-native";
import { StyleSheet, Text, TextStyle, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

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
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

    const scale = useSharedValue(1);

    const tapGesture = Gesture.Tap()
        .numberOfTaps(1)
        .maxDuration(250)
        .onBegin(() => {
            if (disabled) return;

            if (scaleOnPress) {
                scale.value = withSpring(0.95, {
                    duration: AppConfig.ANIMATION_DURATION.fast,
                    dampingRatio: 0.8,
                });
            }
        })
        .onFinalize((event) => {
            if (disabled) return;

            if (scaleOnPress) {
                scale.value = withSpring(1, {
                    duration: AppConfig.ANIMATION_DURATION.normal,
                    dampingRatio: 0.8,
                });
            }

            if (event.state === 5) {
                runOnJS(onTap)();
                runOnJS(onPress)();
            }
        });
    
        const animationStyle = useAnimatedStyle(() => ({
            transform: [{ scale: scale.value }]
        }));

    return (
        <GestureDetector gesture={Gesture.Exclusive(tapGesture)}>
            <Animated.View style={[
                    styles.button,
                    !blurred ? { backgroundColor } : null,
                    buttonStyle,
                    disabled && styles.disabled,
                    animationStyle
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
            </Animated.View>
        </GestureDetector>
    );
}

const styles = StyleSheet.create({
    button: {
        position: 'relative',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 5,
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
        fontWeight: '600',
        fontSize: 16,
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
        gap: 8,
    },
    icon: {
        marginHorizontal: 0,
    }
});