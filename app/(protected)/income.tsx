import { Alert, StyleSheet, View } from 'react-native';

import { ThemedText, ThemedView, TransactionList } from '@/components/layout';
import { AppConfig } from '@/constants';
import { useThemeColor, useTransaction } from '@/hooks';
import { Transaction } from '@/types/transaction';
import { formatCurrency } from '@/utils';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';

/*

Functionality
    - Adding income
    - Edit income
    - Delete income

Visuals
    - Total income view
    - Line Graph of Income each month (see growth)

Slides
    - Top Half:  
        - Total Income
    - Slide 1:
        - Line Graph
    - Slide 2:
        - List view of Income from this month
    - Pop up:
        - Add & Edit income forms

*/

export default function IncomeScreen() {
    const { transactions, editTransaction, deleteTransaction } = useTransaction();

    const primary = useThemeColor('primary');
    const background = useThemeColor('background');
    const textContast = useThemeColor('textContrast');

    const incomeTransactions = useMemo(() => {
        return transactions.filter((txn) => {
            if (txn.category === "INCOME") {
                return true;
            }
        });
    }, [transactions]);

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

    const getTotal = (transactions: Transaction[]): number => {
        let total = 0;
        transactions.forEach(txn => {
            total = total + txn.amount;
        });
        return total;
    }

    return (
        <ThemedView style={[styles.container, { backgroundColor: primary, }]}>
            <View style={styles.headingSection}>
                <View style={styles.headingCol}>
                    <ThemedText style={[styles.totalMeta, { color: textContast }]}>Total</ThemedText>
                    <ThemedText style={[styles.total, { color: textContast }]}>{formatCurrency(getTotal(incomeTransactions))}</ThemedText>
                </View>
            </View>
            <ThemedView style={styles.expenseList}>
                <TransactionList
                    transactions={incomeTransactions}
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
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
    },
    totalMeta: {
        fontSize: AppConfig.FONT_SIZES.xl,
        fontWeight: 600,
    },
    total: {
        fontSize: 72,
        fontWeight: 700,
        lineHeight: 80,
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