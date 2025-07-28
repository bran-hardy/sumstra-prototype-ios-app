import { useCategoryColor } from "@/hooks/useCategoryColor";
import { Transaction } from "@/types/Transaction";
import * as Haptics from "expo-haptics";
import { Edit3, Trash } from "lucide-react-native";
import { useRef, useState } from "react";
import { Animated, Easing, GestureResponderEvent, Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import Button from "./ui/Button";

type CardProps = {
    transaction: Transaction;
    onEditPress: (event: GestureResponderEvent) => void;
    onDeletePress: (event: GestureResponderEvent) => void;
}

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

    const triggerShrink = () => {
        Animated.timing(scaleAnim, {
            toValue: 0.98,
            duration: 200,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
        }).start();
    }

    const triggerGrow = () => {
        Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 100,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
        }).start();
    }

    const expandCard = () => {
        const toValue = expanded ? 0 : 1;
        Haptics.selectionAsync();

        Animated.timing(expandAnim, {
            toValue,
            duration: 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
        }).start();

        setExpanded(!expanded);
    };

    const collapseCard = () => {
        Animated.timing(expandAnim, {
            toValue: 0,
            duration: 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
        }).start(() => setExpanded(false));

    }

    const handlePressIn = () => {
        if (!expanded) {
            triggerShrink();

            longPressTimout.current = setTimeout(() => {
                expandCard();
                triggerGrow();
            }, 400);
        } else {
            collapseCard();
        }
    };

    const handlePressOut = () => {
        triggerGrow();
        if (!expanded && longPressTimout.current) {
            clearTimeout(longPressTimout.current);
            longPressTimout.current = null;
        }
    }

    const interpolatedHeight = expandAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 100],
    });

    const interpolatedOpacity = expandAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    return (
        <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
            <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
                <View style={[styles.container, { backgroundColor: bgColor }]}>
                    <View style={styles.row}>
                        <View style={styles.content}>
                            <View style={styles.metaContainer}>
                                <ThemedText style={styles.categoryText}>{transaction.category[0].toUpperCase() + transaction.category.slice(1).toLowerCase()}</ThemedText>
                                <ThemedText>{new Date(transaction.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                })}</ThemedText>
                            </View>
                            <ThemedText style={styles.description}>{transaction.description}</ThemedText>
                        </View>
                        <ThemedText style={styles.amount}>{'$' + transaction.amount.toFixed(2)}</ThemedText>
                    </View>
                    <Animated.View
                        style={{
                            height: interpolatedHeight,
                            opacity: interpolatedOpacity,
                            overflow: 'hidden',
                            marginTop: 0,
                        }}>
                        <View style={styles.detailContainer}>
                            <View style={styles.actions}>
                                <Button Icon={Edit3} onPress={onEditPress} size={18} />
                                <Button Icon={Trash} onPress={onDeletePress} size={18} />
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
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 15,
        marginHorizontal: 0,
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'space-between',
    },
    metaContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
    },
    categoryText: {
        fontWeight: 600,
        fontStyle: 'italic',
    },
    button: {
        backgroundColor: 'transparent',
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginTop: -5,
        flexGrow: 0,
    },
    description: {
        fontSize: 16,
    },
    amount: {
        fontSize: 36,
        lineHeight: 54,
        fontWeight: 600,
    },
    detailContainer: {
        paddingVertical: 10,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginTop: 8,
    }
});