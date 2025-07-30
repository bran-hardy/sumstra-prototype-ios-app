import { TransactionFrom } from '@/components';
import { ThemedView } from '@/components/layout';
import { Card, FilterModal } from '@/components/transaction';
import { Button, Popup } from '@/components/ui';
import { useTransaction } from '@/hooks';
import { FilterType, Transaction } from '@/types/transaction';
import { Filter, Plus } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';

/*

Functionality
    - Adding expense
    - Edit expense
    - Delete expense

Visuals
    - Total expense view for each category (Want, Need, Saving)
    - Line Graph of Expenses over the month
        - See how much and when you spend money in certain areas

Slides
    - Top Half:  
        - Category progress
    - Slide 1:
        - Line Graph mentioned in visuals
    - Slide 2:
        - List view of Expenses from this month
    - Pop up:
        - Add & Edit expense forms

*/

export default function ExpenseScreen() {
    const { transactions, editTransaction, deleteTransaction } = useTransaction();
    const [filter, setFilter] = useState<FilterType>('ALL');
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [animatingTransactions, setAnimatingTransactions] = useState<string[]>([]);

    const [showEditForm, setShowEditForm] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);

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
            /*
            if (filter === "THIS_MONTH") {
                const txnDate = new Date(txn.date);
                const now = new Date();
                return txnDate.getMonth() === now.getMonth() &&
                       txnDate.getFullYear() === now.getFullYear();
            }
            */

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

    const handleAddPressForm = () => {
        setShowAddForm(true);
    }
    
    const handleCloseAddForm = () => {
        setShowAddForm(false);
    }

    const handleAddTransaction = () => {
        
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
                onEditPress={handleEditTransaction}
                onDeletePress={handleDeleteTransaction}
                onLongPress={() => console.log("Options...")}
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
                    maxToRenderPerBatch={10}
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
                onPress={handleAddPressForm}
                buttonStyle={styles.addButton}
                Icon={Plus}
                blurred={true}
            />
            <Button
                onPress={toggleFilter}
                buttonStyle={styles.filterButton}
                Icon={Filter}
                blurred={true}
            />

            <FilterModal
                isVisible={isFilterVisible}
                onSelect={handleFilterSelect}
                onClose={handleFilterClose}
                currentFilter={filter}
            />

            <Popup
                visible={showAddForm}
                onClose={handleCloseAddForm}
                animationType='scale'
                title='Add Transaction'
            >
                <TransactionFrom />
            </Popup>
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
        flex: 1,
    },
    content: {
        flex: 1,
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
        boxShadow: '0 10px 20px -10px rgba(0,0,0,0.3)',
    },
    filterButton: {
        position: 'absolute',
        bottom: 100,
        left: 20,
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 50,
        elevation: 4,
        boxShadow: '0 10px 20px -10px rgba(0,0,0,0.3)',
    },
});
