import { Transaction } from "@/types/transaction";
import { Dimensions } from "react-native";
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from "react-native-reanimated";
import Card from "./Card";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface AnimatedCardProps {
    transaction: Transaction;
    index: number;
    scrollY : SharedValue<number>;
    fadeHeight: number;
    onEditPress: (transaction: Transaction) => void;
    onDeletePress: (transaction: Transaction) => void;
};

export default function AnimatedCard ({ 
    transaction,
    index,
    scrollY,
    fadeHeight,
    onEditPress, 
    onDeletePress
}: AnimatedCardProps) {
    const ITEM_HEIGHT = 80;
    const START_POSITION = 20;

    const animatedStyle = useAnimatedStyle(() => {
        const itemTop = START_POSITION + (index * ITEM_HEIGHT);
        const itemBottom = itemTop + ITEM_HEIGHT;

        const scrollTop = scrollY.value;
        const containerHeight = SCREEN_HEIGHT - 250 - 80;
        const scrollBottom =scrollY.value + containerHeight;

        const fadeStart = scrollBottom - fadeHeight;
        const opacity = interpolate(
            itemBottom,
            [fadeStart, scrollBottom],
            [1, 0],
            Extrapolation.CLAMP
        );

        return {
            opacity,
        };
    });

    return (
        <Animated.View style={animatedStyle}>
            <Card
                transaction={transaction}
                onEditPress={() => onEditPress(transaction)}
                onDeletePress={() => onDeletePress(transaction)}
            />
        </Animated.View>
    );
};