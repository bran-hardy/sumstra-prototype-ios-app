import { ThemedView } from '@/components/layout';
import { Transaction } from '@/types/transaction';
import { StyleSheet, View } from 'react-native';
import Animated, { FadingTransition, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { Card } from '../transaction';

interface TransactionListProps {
    transactions: Transaction[];
    onEdit: (transaction: Transaction) => void;
    onDelete: (transaction: Transaction) => void;
};

export default function TransactionList({
    transactions,
    onEdit,
    onDelete
}: TransactionListProps) {
    const scrollY = useSharedValue(0);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    const handleEditPress = (transaction: Transaction) => onEdit(transaction);
    const handleDeletePress = (transaction: Transaction) => onDelete(transaction);

    const renderTransaction = ({ item }: { item: Transaction; }) => {
        return (
            <Card
                transaction={item}
                onEditPress={handleEditPress}
                onDeletePress={handleDeletePress}
            />
        );
    };

    const renderEmptyComponent = () => {
        return (
            <View style={styles.emptyContainer}>
                <ThemedView style={styles.emptyText}>
                    No expenses found for the selected filter
                </ThemedView>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Animated.FlatList
                data={transactions}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={renderTransaction}
                ListEmptyComponent={renderEmptyComponent}
                maxToRenderPerBatch={10}
                contentContainerStyle={styles.listContainer}
                itemLayoutAnimation={FadingTransition}
                onScroll={scrollHandler}
            />
        </View>
    );
}

/*
 Incase I need this
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

*/

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContainer: {
        paddingTop: 20,
        paddingHorizontal: 20,
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
});
