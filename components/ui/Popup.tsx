import { AppConfig } from "@/constants";
import { X } from "lucide-react-native";
import React, { useEffect } from "react";
import { Dimensions, KeyboardAvoidingView, Modal, Platform, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "../layout";

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
        dampingRatio: 0.8,
    },
    timingConfig: {
        duration: 300,
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
    const insets = useSafeAreaInsets();

    const backdropOpacityValue = useSharedValue(0);
    const translateY = useSharedValue(SCREEN_HEIGHT);
    const scale = useSharedValue(0.8);
    const opacity = useSharedValue(0);

    const showModal = () => {
        backdropOpacityValue.value = withTiming(backdropOpacity, { duration: ANIMATION_CONFIG.duration });

        switch (animationType) {
            case 'slide':
                translateY.value = withSpring(0, ANIMATION_CONFIG.springConfig);
                break;
            case 'scale':
                scale.value = withSpring(1, ANIMATION_CONFIG.springConfig);
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
                translateY.value = withSpring(SCREEN_HEIGHT, ANIMATION_CONFIG.springConfig, (finished) => {
                    if (finished) {
                        runOnJS(onClose)();
                    }
                });
                break;
            case 'scale':
                scale.value = withSpring(0.8, ANIMATION_CONFIG.springConfig);
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
            const timer = setTimeout(() => {
                showModal();
            }, 50);

            return () => clearTimeout(timer);
        } else {
            translateY.value = SCREEN_HEIGHT;
            scale.value = 0.8;
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
                            {
                                backgroundColor,
                                maxHeight: maxHeight + insets.bottom,
                                paddingBottom: 200,
                            },
                            getModalStyle(),
                        ]}
                    >
                        {(title || showCloseButton) && (
                            <View style={styles.header}>
                                <View style={styles.titleContainer}>
                                    <ThemedText style={styles.title}>{title}</ThemedText>
                                </View>
                                {showCloseButton && (
                                    <TouchableWithoutFeedback onPress={handleClose}>
                                        <View style={styles.closeButton}>
                                            <X size={24} color="#666" />
                                        </View>
                                    </TouchableWithoutFeedback>
                                )}
                            </View>
                        )}

                        {animationType == 'slide' && (
                            <View style={styles.dragHandle} />
                        )}

                        <ScrollView
                            style={styles.content}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            {children}
                        </ScrollView>
                    </Animated.View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000000',
    },
    keyboardAvoid: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modal: {
        flex: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
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
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 20,
    },
});