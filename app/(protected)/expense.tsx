import Card from '@/components/Card';
import FilterModal from '@/components/FilterModal';
import { ThemedView } from '@/components/ThemedView';
import Button from '@/components/ui/Button';
import { useTransactions } from '@/providers/TransactionProvider';
import { FilterType, Transaction } from '@/types/Transaction';
import { Filter, Plus } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';

/*
 * Instead of having edit and delete icons, hold down on an item with your finger to open up a larger view of the item where you can edit it or delete it
 *  - would look a lot cleaner and have smooth functionality
 */

export default function ExpenseScreen() {
    const { transactions, editTransaction, deleteTransaction } = useTransactions();
    const [filter, setFilter] = useState<FilterType>('ALL');
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [animatingTransactions, setAnimatingTransactions] = useState<string[]>([]);

    const toggleFilter = () => {
        setIsFilterVisible(prev => !prev);
    };

    // Memoize filtered transactions for better performance
    const filteredTransactions = useMemo(() => {
        return transactions.filter((txn) => {
            // Don't show income transactions
            if (txn.category === "INCOME") return false;

            // Filter by category
            if (["WANT", "NEED", "SAVING"].includes(filter)) {
                return txn.category === filter;
            }

            // Filter for THIS_MONTH
            if (filter === "THIS_MONTH") {
                const txnDate = new Date(txn.date);
                const now = new Date();
                return txnDate.getMonth() === now.getMonth() &&
                       txnDate.getFullYear() === now.getFullYear();
            }

            return true;
        }).reverse(); // Show newest first
    }, [transactions, filter]);

    const handleFilterSelect = (selectedFilter: FilterType) => {
        setFilter(selectedFilter)
        setIsFilterVisible(false);
    };

    const handleFilterClose = () => {
        setIsFilterVisible(false);
    };

    const handleAddTransaction = () => {
        console.log('Navigate to add transaction');
    };

    const handleEditTransaction = (transaction: Transaction) => {
        console.log('Edit transaction: ', transaction.id);
    };

    const handleDeleteTransaction = (transaction: Transaction) => {
        Alert.alert(
            'Delete Transaction',
            `Are you sure you want to delete "${transaction.description}"?`,
            [
                {text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const success = await deleteTransaction(transaction.id);
                        if (success) {
                            Alert.alert('Success', 'Transaction deleted successfully');
                        }
                    },
                },
            ]
        );
    };

    const renderTransaction = ({ item }: { item: Transaction }) => {
        return (
            <Card
                transaction={item}
                onEditPress={() => handleEditTransaction(item)}
                onDeletePress={() => handleDeleteTransaction(item)}
            />
        );
    };

    return (
        <View style={styles.container}>
            <ThemedView style={styles.content}>
                <FlatList
                    data={filteredTransactions}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderTransaction}
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={10}
                    windowSize={5}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <ThemedView style={styles.emptyText}>
                                No expenses found for the selected filter
                            </ThemedView>
                        </View>
                    )}
                />
            </ThemedView>

            <Button
                onPress={handleAddTransaction}
                buttonStyle={styles.addButton}
                Icon={Plus}
            />
            <Button
                onPress={toggleFilter}
                buttonStyle={styles.filterButton}
                Icon={Filter}
            />

            <FilterModal
                isVisible={isFilterVisible}
                onSelect={handleFilterSelect}
                onClose={handleFilterClose}
                currentFilter={filter}
            />
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
        flexDirection: 'column',
        flex: 1,
        overflow: 'hidden',
    },
    content: {
        flex: 1,
        flexGrow: 1,
        overflow: 'hidden',
    },
    listContainer: {
        padding: 20,
        paddingBottom: 100,
        paddingTop: 60,
        gap: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    emptyText: {
        fontSize: 16,
        opacity: 0.6,
        textAlign: 'center',
    },
    addButton: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 50,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    filterButton: {
        position: 'absolute',
        bottom: 100,
        left: 20,
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 50,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
});
