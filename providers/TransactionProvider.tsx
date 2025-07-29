import { Transaction } from "@/types/transaction";
import { createContext, useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "../hooks";
import {
    TransactionAPI,
    TransactionError
} from "../services/api";

interface TransactionContextType {
    transactions: Transaction[];
    loading: boolean;
    error: string | null;
    fetchTransactions: () => Promise<void>;
    addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<boolean>;
    editTransaction: (id: string, updates: Partial<Omit<Transaction, 'id' | 'user_id'>>) => Promise<boolean>;
    deleteTransaction: (id: string) => Promise<boolean>;
    clearError: () => void;
}

export const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { session } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const fetchTransactions = useCallback(async () => {
        if (!session?.user?.id) return;

        setLoading(true);
        setError(null);

        try {
            const data = await TransactionAPI.getAll(session.user.id);
            setTransactions(data);
        } catch (err) {
            const errorMessage = err instanceof TransactionError ? err.message : 'Failed to fetch transactions';
            setError(errorMessage);
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    }, [session?.user?.id]);

    const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id'>): Promise<boolean> => {
        if (!session?.user?.id) return false;

        setLoading(true);
        setError(null);

        try {
            const newTransaction = await TransactionAPI.create({
                ...transaction,
                user_id: session.user.id
            });
            setTransactions(prev => [newTransaction, ...prev]);
            return true;
        } catch (err) {
            const errorMessage = err instanceof TransactionError ? err.message : 'Failed to add transactions';
            setError(errorMessage);
            Alert.alert('Error', errorMessage);
            return false;
        }
    }, [session?.user?.id]);

    const editTransaction = useCallback(async (
        id: string,
        updates: Partial<Omit<Transaction, 'id' | 'user_id'>>
    ): Promise<boolean> => {
        setError(null);

        try {
            const updatedTransaction = await TransactionAPI.update(id, updates);
            setTransactions(prev => 
                prev.map(txn => txn.id === id ? updatedTransaction : txn)
            );
            return true;
        } catch (err) {
            const errorMessage = err instanceof TransactionError ? err.message : 'Failed to update transactions';
            setError(errorMessage);
            Alert.alert('Error', errorMessage);
            return false;
        }
    }, []);

    const deleteTransaction = useCallback(async (id: string): Promise<boolean> => {
        setError(null);

        try {
            const deleteTransaction = await TransactionAPI.delete(id);
            setTransactions(prev => prev.filter(txn => txn.id != id));
            return true;
        } catch (err) {
            const errorMessage = err instanceof TransactionError ? err.message : 'Failed to delete transactions';
            setError(errorMessage);
            Alert.alert('Error', errorMessage);
            return false;
        }
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    return (
        <TransactionContext.Provider
            value={{
                transactions,
                loading,
                error,
                fetchTransactions,
                addTransaction,
                editTransaction,
                deleteTransaction,
                clearError
            }}
        >
            {children}
        </TransactionContext.Provider>
    );
}