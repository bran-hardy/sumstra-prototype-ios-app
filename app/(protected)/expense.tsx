import Card from '@/components/Card';
import FilterModal from '@/components/FilterModal';
import { ThemedView } from '@/components/ThemedView';
import Button from '@/components/ui/Button';
import { useTransactions } from '@/providers/TransactionProvider';
import { Filter, Plus } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

/*
 * Instead of having edit and delete icons, hold down on an item with your finger to open up a larger view of the item where you can edit it or delete it
 *  - would look a lot cleaner and have smooth functionality
 */

export default function ExpenseScreen() {
    const { transactions } = useTransactions();
    const [filter, setFilter] = useState('ALL');
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
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <Card
                            transaction={item}
                            onEditPress={() => { }}
                            onDeletePress={() => { }} />
                    )}
                    contentContainerStyle={{ padding: 20, paddingBottom: 100, paddingTop: 60, gap: 10 }}
                />
            </ThemedView>

            <Button onPress={() => { }} buttonStyle={styles.addButton} Icon={Plus} />
            <Button onPress={() => toggleFilter()} buttonStyle={styles.filterButton} Icon={Filter} />
            <FilterModal
                isVisible={isFilterVisible}
                onSelect={(filter) => setFilter(filter)}
                onClose={() => toggleFilter()}
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
});
