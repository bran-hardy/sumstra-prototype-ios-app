import { AppConfig } from "@/constants/Config";
import { useCategoryColor } from "@/hooks/ui/useCategoryColor";
import { Transaction } from "@/types/transaction";
import { formatCurrency, formatDate } from "@/utils";
import * as Haptics from "expo-haptics";
import { Edit3, Trash } from "lucide-react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { AccessibilityInfo, Animated, Easing, GestureResponderEvent, Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "../layout";
import { Button } from "../ui";

export type CardProps = {
    transaction: Transaction;
    onEditPress: (transaction: Transaction) => void;
    onDeletePress: (transaction: Transaction) => void;
}

const ANIMATION_CONFIG = {
    SCALE_DURATION: 200,
    EXPAND_DURATION: 300,
    LONG_PRESS_DELAY: 300,
    SHRINK_SCALE: 0.98,
    EXPANDED_HEIGHT: 100,
};

export default function Card({
    transaction,
    onEditPress,
    onDeletePress
}: CardProps) {
    const [expanded, setExpanded] = useState(false);
    const bgColor = useCategoryColor(transaction.category);

    const scaleAnim = useRef(new Animated.Value(1)).current;
    const expandAnim = useRef(new Animated.Value(0)).current;
    const longPressTimout = useRef<NodeJS.Timeout | null>(null);

    const formattedAmount = useMemo(() => formatCurrency(transaction.amount), [transaction.amount]);
    const formattedDate = useMemo(() => formatDate(transaction.date), [transaction.date]);
    const categoryDisplay = useMemo(() =>
        transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1).toLowerCase(), [transaction.category]
    );

    const triggerShrink = useCallback(() => {
        Animated.timing(scaleAnim, {
            toValue: ANIMATION_CONFIG.SHRINK_SCALE,
            duration: ANIMATION_CONFIG.SCALE_DURATION,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
        }).start();
    }, [scaleAnim]);

    const triggerGrow = useCallback(() => {
        Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 100,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
        }).start();
    }, [scaleAnim]);

    const expandCard = useCallback(() => {
        const toValue = expanded ? 0 : 1;

        // Provide haptic feedback
        Haptics.selectionAsync();

        // Announce state change for accessibility
        AccessibilityInfo.announceForAccessibility(
            expanded ? 'Card Collapsed' : 'Card expanded, edit and delete options available'
        );

        Animated.timing(expandAnim, {
            toValue,
            duration: ANIMATION_CONFIG.EXPAND_DURATION,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
        }).start();

        setExpanded(!expanded);
    }, [expanded, expandAnim]);

    const collapseCard = useCallback(() => {
        Animated.timing(expandAnim, {
            toValue: 0,
            duration: ANIMATION_CONFIG.EXPAND_DURATION,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
        }).start(() => {
            setExpanded(false)
        });
    }, [expandAnim]);

    const handlePressIn = useCallback(() => {
        if (!expanded) {
            triggerShrink();

            longPressTimout.current = setTimeout(() => {
                expandCard();
                triggerGrow();
            }, ANIMATION_CONFIG.LONG_PRESS_DELAY);
        } else {
            collapseCard();
        }
    }, [expandAnim, triggerShrink, expandCard, triggerGrow, collapseCard]);

    const handlePressOut = useCallback(() => {
        triggerGrow();
        if (!expanded && longPressTimout.current) {
            clearTimeout(longPressTimout.current);
            longPressTimout.current = null;
        }
    }, [expanded, triggerGrow]);

    const handleEditPress = useCallback((event: GestureResponderEvent) => {
        event.stopPropagation();
        onEditPress(transaction);
        collapseCard();
    }, [onEditPress, transaction, collapseCard]);

    const handleDeletePress = useCallback((event: GestureResponderEvent) => {
        event.stopPropagation();
        onDeletePress(transaction);
        collapseCard();
    }, [onDeletePress, transaction, collapseCard]);

    React.useEffect(() => {
        return () => {
            if (longPressTimout.current) {
                clearTimeout(longPressTimout.current);
            }
        }
    }, []);

    const interpolatedHeight = expandAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, ANIMATION_CONFIG.EXPANDED_HEIGHT],
    });

    const interpolatedOpacity = expandAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    return (
        <Pressable 
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Transaction: ${transaction.description}, ${formattedAmount}, ${categoryDisplay}, ${formattedDate}`}
            accessibilityHint="Long press to show edit and delete options"
        >
            <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
                <View style={[styles.container, { backgroundColor: bgColor }]}>
                    <View style={styles.row}>
                        <View style={styles.content}>
                            <View style={styles.metaContainer}>
                                <ThemedText style={styles.categoryText}>
                                    {categoryDisplay}
                                </ThemedText>
                                <ThemedText>
                                    {formattedDate}
                                </ThemedText>
                            </View>
                            <ThemedText style={styles.description}>
                                {transaction.description}
                            </ThemedText>
                        </View>
                        <ThemedText style={styles.amount}>
                            {formattedAmount}
                        </ThemedText>
                    </View>
                    <Animated.View
                        style={{
                            height: interpolatedHeight,
                            opacity: interpolatedOpacity,
                            overflow: 'hidden',
                        }}>
                        <View style={styles.detailContainer}>
                            <View style={styles.actions}>
                                <Button 
                                    Icon={Edit3}
                                    onPress={handleEditPress}
                                    size={18}
                                    accessibilityLabel="Edit transaction"
                                />
                                <Button
                                    Icon={Trash}
                                    onPress={handleDeletePress}
                                    size={18}
                                    accessibilityLabel="Delete transaction"
                                />
                            </View>
                        </View>
                    </Animated.View>
                </View>
            </Animated.View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
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
    },
    content: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'space-between',
    },
    metaContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: AppConfig.SPACING.sm,
        marginBottom: AppConfig.SPACING.md,
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
        fontSize: AppConfig.FONT_SIZES.md,
    },
    amount: {
        fontSize: 32,
        lineHeight: 48,
        fontWeight: 600,
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