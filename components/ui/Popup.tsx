import { AppConfig } from "@/constants";
import { BlurView } from "expo-blur";
import { X } from "lucide-react-native";
import React, { useEffect } from "react";
import { Dimensions, KeyboardAvoidingView, Modal, Platform, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";

const {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH
} = Dimensions.get('window');

export interface PopupProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    maxHeight?: number;
    showCloseButton?: boolean;
    dismissOnBackdrop?: boolean;
    animationType?: 'slide' | 'fade' | 'scale';
    backgroundColor?: string;
    backdropOpacity?: number;
}

const ANIMATION_CONFIG = {
    duration: AppConfig.ANIMATION_DURATION.slow,
    springConfig: {
        duration: AppConfig.ANIMATION_DURATION.slow,
        overshootClamping: false,
    },
    timingConfig: {
        duration: AppConfig.ANIMATION_DURATION.slow,
        easing: Easing.inOut(Easing.cubic),
    }
}

export default function Popup({
    visible,
    onClose,
    title,
    children,
    maxHeight = SCREEN_HEIGHT * 0.8,
    showCloseButton = true,
    dismissOnBackdrop = true,
    animationType = 'slide',
    backgroundColor = '#FFFFFF',
    backdropOpacity = 0.5,
}: PopupProps) {
    const backdropOpacityValue = useSharedValue(0);
    const translateY = useSharedValue(SCREEN_HEIGHT);
    const scale = useSharedValue(0.95);
    const opacity = useSharedValue(0);

    const showModal = () => {
        backdropOpacityValue.value = withTiming(backdropOpacity, { duration: ANIMATION_CONFIG.duration });

        switch (animationType) {
            case 'slide':
                translateY.value = withSpring(0, ANIMATION_CONFIG.timingConfig);
                break;
            case 'scale':
                scale.value = withTiming(1, ANIMATION_CONFIG.timingConfig);
                opacity.value = withTiming(1, ANIMATION_CONFIG.timingConfig);
                break;
            case 'fade':
                opacity.value = withTiming(1, ANIMATION_CONFIG.timingConfig);
                break;
        }
    }

    const hideModal = () => {
        backdropOpacityValue.value = withTiming(0, { duration: ANIMATION_CONFIG.duration });

        switch (animationType) {
            case 'slide':
                translateY.value = withSpring(SCREEN_HEIGHT, ANIMATION_CONFIG.timingConfig, (finished) => {
                    if (finished) {
                        runOnJS(onClose)();
                    }
                });
                break;
            case 'scale':
                scale.value = withTiming(0.95, ANIMATION_CONFIG.timingConfig);
                opacity.value = withTiming(0, ANIMATION_CONFIG.timingConfig, (finished) => {
                    if (finished) {
                        runOnJS(onClose)();
                    }
                });
                break;
            case 'fade':
                opacity.value = withTiming(0, ANIMATION_CONFIG.timingConfig, (finished) => {
                    if (finished) {
                        runOnJS(onClose)();
                    }
                });
                break;
        }
    }

    useEffect(() => {
        if (visible) {
            showModal();
        } else {
            scale.value = 0.95;
            opacity.value = 0;
            backdropOpacityValue.value = 0;
        }
    }, [visible]);

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: backdropOpacityValue.value,
    }));

    const slideStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const scaleStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    const fadeStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const getModalStyle = () => {
        switch (animationType) {
            case 'slide':
                return slideStyle;
            case 'scale':
                return scaleStyle;
            case 'fade':
                return fadeStyle;
            default:
                return {};
        }
    }

    const handleBackdropPress = () => {
        if (dismissOnBackdrop) {
            hideModal();
        }
    };

    const handleClose = () => {
        hideModal();
    }

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent
            statusBarTranslucent
            animationType="none"
        >
            <View style={styles.overlay}>
                <TouchableWithoutFeedback onPress={handleBackdropPress}>
                    <Animated.View style={[styles.backdrop, backdropStyle]} />
                </TouchableWithoutFeedback>

                <KeyboardAvoidingView
                    behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardAvoid}
                >
                    <Animated.View
                        style={[
                            styles.modal,
                            getModalStyle(),
                        ]}
                    >
                        <BlurView intensity={100} tint='systemUltraThinMaterialDark' style={styles.blur}>
                            {(title || showCloseButton) && (
                                <View style={styles.header}>
                                    {showCloseButton && (
                                        <TouchableWithoutFeedback onPress={handleClose}>
                                            <View style={styles.closeButton}>
                                                <X size={24} color="#FFFFFF" />
                                            </View>
                                        </TouchableWithoutFeedback>
                                    )}
                                </View>
                            )}

                            {animationType == 'slide' && (
                                <View style={styles.dragHandle} />
                            )}

                            <View style={styles.content}>
                                {children}
                            </View>
                        </BlurView>
                    </Animated.View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        padding: AppConfig.SPACING.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#00000000',
    },
    keyboardAvoid: {
        width: '100%',
        justifyContent: 'center',
    },
    modal: {
        paddingVertical: AppConfig.SPACING.xl,
        borderRadius: AppConfig.BORDER_RADIUS.xxl,
        elevation: 10,
    },
    blur: {
        borderRadius: AppConfig.BORDER_RADIUS.xxl,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
    },
    closeButton: {
        padding: 8,
        marginRight: -8,
    },
    dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 8,
        marginBottom: 8,
    },
    content: {
        padding: AppConfig.SPACING.md,
    },
});