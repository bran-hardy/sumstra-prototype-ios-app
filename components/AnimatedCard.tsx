import { AppConfig } from "@/constants/Colors";
import { Transaction } from "@/types/Transaction";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import Card from "./Card";


type AnimatedCardProps = {
    transaction: Transaction;
    onEditPress: (transaction: Transaction) => void;
    onDeletePress: (transaction: Transaction) => void;
    isVisible: boolean;
};

export default function AnimatedCard ({ transaction, onEditPress, onDeletePress, isVisible }: AnimatedCardProps) {
    const opacity = useRef(new Animated.Value(1)).current;
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (isVisible) {
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: AppConfig.ANIMATION_DURATION.normal,
                    useNativeDriver: true,
                }),
                Animated.spring(scale, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 100,
                    friction: 8,
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: AppConfig.ANIMATION_DURATION.normal,
                    useNativeDriver: true,
                }),
                Animated.timing(scale, {
                    toValue: 0.8,
                    duration: AppConfig.ANIMATION_DURATION.normal,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <Animated.View
            style={{
                opacity,
                transform: [{ scale }]
            }}
        >
            <Card
                transaction={transaction}
                onEditPress={() => onEditPress(transaction)}
                onDeletePress={() => onDeletePress(transaction)}
            />
        </Animated.View>
    );
};