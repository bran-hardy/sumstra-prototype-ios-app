import Card from '@/components/Card';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Button from '@/components/ui/Button';
import { useTransactions } from '@/providers/TransactionProvider';
import { Filter, Plus } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, Modal, StyleSheet, View } from 'react-native';

const expenses = [
    {
        id: '1',
        title: 'Groceries',
        amount: 78.5,
        category: 'need',
        date: '2025-07-24',
    },
    {
        id: '2',
        title: 'Netflix Subscription',
        amount: 15.99,
        category: 'want',
        date: '2025-07-22',
    },
    {
        id: '3',
        title: 'Gas',
        amount: 42.25,
        category: 'need',
        date: '2025-07-20',
    },
    // Add more dummy expenses...
];

type Filters = "ALL" | "WANT" | "NEED" | "SAVING" | "THIS_MONTH";

type CategoryType = "ALL" | "WANT" | "NEED" | "SAVING" | string;

export default function ExpenseScreen() {
    const { transactions } = useTransactions();
    const [filter, setFilter] = useState<Filters>('ALL');
    const [isFilterVisible, setIsFilterVisible] = useState(false);

    const toggleFilter = () => setIsFilterVisible(prev => !prev);

    // Filter transactions based on filter
    const filteredTransactions = transactions.filter((txn) => {
        if (txn.category === "INCOME") return false;

        // Filter by category
        if (["WANT", "NEED", "SAVING"].includes(filter)) {
            return txn.category === filter;
        }

        // Filter for THIS_MONTH
        if (filter === "THIS_MONTH") {
            const txnDate = new Date(txn.date);
            const now = new Date();
            return txnDate.getMonth() == now.getMonth() && txnDate.getFullYear() == now.getFullYear();
        }

        return true;
    });

    return (
        <View style={styles.container}>
            <ThemedView style={styles.content}>
                <FlatList
                    data={filteredTransactions}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Card
                            transaction={item}
                            onEditPress={() => { }}
                            onDeletePress={() => { }} />
                    )}
                    contentContainerStyle={{ padding: 20, paddingBottom: 100, paddingTop: 60, gap: 10 }}
                />
            </ThemedView>

            <Button onPress={toggleFilter} buttonStyle={styles.filterButton} Icon={Filter} />

            <Button onPress={() => { }} buttonStyle={styles.addButton} Icon={Plus} />

            <Modal visible={isFilterVisible} transparent animationType="slide">
                <ThemedView style={styles.modalOverlay}>
                    <ThemedView style={styles.modalContent}>
                        <ThemedText style={styles.modalTitle}>Filter Options</ThemedText>
                        <ThemedText>(Put your filter choices here)</ThemedText>
                        <Button title='Close' onPress={toggleFilter} buttonStyle={styles.modalClose} />
                    </ThemedView>
                </ThemedView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
    },
    content: {
        flex: 1,
        flexGrow: 1,
        gap: 16,
        overflow: 'hidden',
    },
    addButton: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        backgroundColor: '#000000',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 50,
        elevation: 4,
    },
    filterButton: {
        position: 'absolute',
        bottom: 100,
        left: 20,
        backgroundColor: '#000000',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 50,
        elevation: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        padding: 20,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    modalClose: {
        marginTop: 20,
        alignSelf: 'flex-end',
    },
});
