import { useCategoryColor } from "@/hooks/useCategoryColor";
import { Transaction } from "@/types/Transaction";
import { Edit3, Trash } from "lucide-react-native";
import { GestureResponderEvent, StyleSheet, View } from "react-native";
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
    } : CardProps) {
    
    const cardBackground = useCategoryColor(transaction.category);
    
    return (
        <View style={[styles.container, { backgroundColor: cardBackground }]}>
            <View style={styles.row}>
                <View style={styles.content}>
                    <View style={styles.metaContainer}>
                        <ThemedText style={styles.categoryText}>{transaction.category[0].toUpperCase() + transaction.category.slice(1).toLowerCase()}</ThemedText>
                        <ThemedText>{new Date(transaction.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                            })}</ThemedText>
                    </View>
                    <ThemedText style={styles.amount}>{'$' + transaction.amount.toFixed(2)}</ThemedText>
                </View>
                <Button size={18} Icon={Edit3} onPress={onEditPress} buttonStyle={styles.button} />
                <Button size={18} Icon={Trash} onPress={onDeletePress} buttonStyle={styles.button} />
            </View>
            <ThemedText style={styles.description}>{transaction.description}</ThemedText>
        </View>
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
        alignItems: 'flex-start',
        gap: 10,
    },
    content: {
        flexGrow: 1,
    },
    metaContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 10,
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
    amount: {
        fontSize: 32,
        lineHeight: 48,
        fontWeight: 600,
        paddingVertical: 4,
    },
    description: {
        
    },
});