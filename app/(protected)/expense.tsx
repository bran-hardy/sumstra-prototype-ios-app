import { ThemedText, ThemedView, TransactionList } from '@/components/layout';
import { AppConfig } from '@/constants';
import { useThemeColor, useTransaction } from '@/hooks';
import { FilterType, Transaction } from '@/types/transaction';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

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

    const primary = useThemeColor('primary');
    const background = useThemeColor('background');
    const textContast = useThemeColor('textContrast');


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

    const handleEditTransaction = (transaction: Transaction) => {
        console.log('Edit transaction: ', transaction.id);
    };

    const handleDeleteTransaction = (transaction: Transaction) => {
        Alert.alert(
            'Delete Transaction',
            `Are you sure you want to delete "${transaction.description}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
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

    return (
        <ThemedView style={[styles.container, { backgroundColor: primary, }]}>
            <View style={styles.headingSection}>
                <View style={styles.headingCol}>
                    <ThemedText style={[styles.headingText, { color: textContast }]}>Need</ThemedText>
                </View>
                <View style={styles.headingCol}>
                    <ThemedText style={[styles.headingText, { color: textContast }]}>Want</ThemedText>
                </View>
                <View style={styles.headingCol}>
                    <ThemedText style={[styles.headingText, { color: textContast }]}>Saving</ThemedText>
                </View>
            </View>
            <ThemedView style={styles.expenseList}>
                <TransactionList 
                    transactions={filteredTransactions}
                    onEdit={handleEditTransaction}
                    onDelete={handleDeleteTransaction}
                />

                <LinearGradient
                    colors={[
                        `${background}00`, // Transparent
                        `${background}80`, // 50% opacity
                        `${background}FF`, // Fully opaque
                    ]}
                    style={styles.gradientOverlay}
                    pointerEvents="none"
                />
            </ThemedView>
        </ThemedView>
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
        paddingTop: 80,
    },
    headingSection: {
        flexDirection: 'row',
        height: 170,
        padding: 20,
    },
    headingCol: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    headingText: {
        fontSize: AppConfig.FONT_SIZES.xxl,
        fontWeight: 700,
    },
    expenseList: {
        flex: 1,
        borderRadius: AppConfig.BORDER_RADIUS.xxl,
        paddingBottom: 50,
        position: 'relative',
    },
    gradientOverlay: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        height: 200,
    },
});
