import { AppConfig } from "@/constants/Config";
import { useHaptic, useThemeColor } from "@/hooks";
import { Transaction } from "@/types/transaction";
import { formatCurrency, formatDate } from "@/utils";
import { Edit3, Trash } from "lucide-react-native";
import React, { useCallback } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { interpolate, runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { ThemedText } from "../layout";

export type CardProps = {
    transaction: Transaction;
    onEditPress: (transaction: Transaction) => void;
    onDeletePress: (transaction: Transaction) => void;
    onLongPress?: (Transaction: Transaction) => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const ACTION_THRESHOLD = 120;

export default function Card({
    transaction,
    onEditPress,
    onDeletePress,
    onLongPress
}: CardProps) {
    const { triggerActionHaptic, onEdit, onDelete } = useHaptic();
    const iconColor = useThemeColor('text');
    const textColor = useThemeColor('textContrast');
    const bgColor = useThemeColor('primary');
    
    const triggered = useSharedValue(false);
    const translateX = useSharedValue(0);
    const actionOpacity = useSharedValue(0);

    const formattedAmount = formatCurrency(transaction.amount);
    const formattedDate = formatDate(transaction.date);
    const categoryDisplay = transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1).toLowerCase();

    const executeEdit = useCallback(() => {
        onEdit();
        onEditPress(transaction);
    }, [onEditPress, transaction]);

    const executeDelete = useCallback(() => {
        onDelete();
        onDeletePress(transaction);
    }, [onDeletePress, transaction]);

    const panGesture = Gesture.Pan()
        .activeOffsetX([-10, 10])
        .onUpdate((event) => {
            translateX.value = event.translationX;

            const absTranslateX = Math.abs(event.translationX);
            actionOpacity.value = interpolate(
                absTranslateX,
                [0, ACTION_THRESHOLD],
                [0, 1],
                'clamp'
            );

            if (absTranslateX > ACTION_THRESHOLD && !triggered.value) {
                runOnJS(triggerActionHaptic)('swipeThreshold');
                triggered.value = true;
            } else if (absTranslateX < ACTION_THRESHOLD) {
                triggered.value = false;
            }
        })
        .onEnd((event) => {
            const { translationX } = event;
            const absTranslateX = Math.abs(translationX);

            const shouldTriggerAction = absTranslateX > ACTION_THRESHOLD;

            if (shouldTriggerAction) {
                if (translationX > 0) {
                    runOnJS(executeEdit)();
                } else {
                    runOnJS(executeDelete)();
                }
            }

            translateX.value = withSpring(0, {
                duration: 300,
                dampingRatio: 0.8,
            });
            actionOpacity.value = withTiming(0, { duration: 200 });
            triggered.value = false;
        });

    const cardStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value / 4 }
        ],
    }));

    const editActionStyle = useAnimatedStyle(() => ({
        opacity: translateX.value > 0 ? actionOpacity.value : 0,
        transform: [
            {
                translateX: interpolate(
                    translateX.value,
                    [0, SCREEN_WIDTH],
                    [-40, 10],
                    'clamp'
                )
            },
            {
                scale: interpolate(
                    Math.abs(translateX.value),
                    [0, ACTION_THRESHOLD],
                    [0.4, 1],
                    'clamp'
                )
            }
        ]
    }));

    const deleteActionStyle = useAnimatedStyle(() => ({
        opacity: translateX.value < 0 ? actionOpacity.value : 0,
        transform: [
            {
                translateX: interpolate(
                    translateX.value,
                    [-SCREEN_WIDTH, 0],
                    [-10, 40],
                    'clamp'
                )
            },
            {
                scale: interpolate(
                    Math.abs(translateX.value),
                    [0, ACTION_THRESHOLD],
                    [0.4, 1],
                    'clamp'
                )
            }
        ]
    }));

    return (
        <View style={styles.container}>
            <Animated.View style={styles.background}>
                <Animated.View style={[styles.leftAction, editActionStyle]}>
                    <Edit3 size={24} color={iconColor} />
                </Animated.View>

                <Animated.View style={[styles.rightAction, deleteActionStyle]}>
                    <Trash size={24} color={iconColor} />
                </Animated.View>
            </Animated.View>

            <GestureDetector gesture={panGesture}>
                <Animated.View style={[styles.card, { backgroundColor: bgColor }, cardStyle]}>
                    <View style={styles.row}>
                        <View style={styles.content}>
                            <View style={styles.metaContainer}>
                                <ThemedText style={[styles.categoryText, , { color: textColor }]}>
                                    {categoryDisplay}
                                </ThemedText>
                                <ThemedText style={{ color: textColor }}>
                                    {formattedDate}
                                </ThemedText>
                            </View>
                            <ThemedText style={[styles.description, { color: textColor }]}>
                                {transaction.description}
                            </ThemedText>
                        </View>
                        <ThemedText style={[styles.amount, { color: textColor }]}>
                            {formattedAmount}
                        </ThemedText>
                    </View>
                </Animated.View>
            </GestureDetector>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    leftAction: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    rightAction: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
    },
    card: {
        paddingHorizontal: AppConfig.SPACING.sm,
        paddingVertical: AppConfig.SPACING.sm,
        borderRadius: AppConfig.BORDER_RADIUS.large,
        marginHorizontal: 0,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: AppConfig.SPACING.sm,
        marginVertical: AppConfig.SPACING.sm,
    },
    content: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    metaContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: AppConfig.SPACING.sm,
        marginBottom: AppConfig.SPACING.xs,
    },
    categoryText: {
        fontWeight: 600,
        fontStyle: 'italic',
        fontSize: AppConfig.FONT_SIZES.sm,
    },
    dateText: {
        fontSize: AppConfig.FONT_SIZES.sm,
        opacity: 0.7,
    },
    description: {
        fontSize: AppConfig.FONT_SIZES.xxl,
        fontWeight: 600,
    },
    amount: {
        fontSize: 32,
        lineHeight: 48,
        fontWeight: 700,
        textAlign: 'right',
    },
    detailContainer: {
        paddingVertical: AppConfig.SPACING.sm,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: AppConfig.SPACING.md,
        marginTop: AppConfig.SPACING.xs,
    },
});
