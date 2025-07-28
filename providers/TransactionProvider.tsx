import { Transaction } from "@/types/Transaction";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import {
    addTransaction as addTransactionService,
    deleteTransaction as deleteTransactionService,
    editTransaction as editTransactionService,
    getAllTransactions,
    TransactionError
} from "../services/TransactionService";
import { useAuth } from "./AuthProvider";

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

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

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
            const data = await getAllTransactions(session.user.id);
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
            const newTransaction = await addTransactionService({
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
            const updatedTransaction = await editTransactionService(id, updates);
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
            const updatedTransaction = await deleteTransactionService(id);
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

export const useTransactions = () => {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error('useTransactions must be used within an TransactionProvider');
    }

    return context;
}