import { Transaction } from "@/types/Transaction";
import { createContext, useContext, useEffect, useState } from "react";
import { getAllTransactions } from "../services/TransactionService";
import { useAuth } from "./AuthProvider";

interface TransactionContextType {
    transactions: Transaction[];
    loading: boolean;
    fetchTransactions: () => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { session } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.user?.id) {
            fetchTransactions();
        }
    }, [session]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const data = await getAllTransactions(session.user.id);
            setTransactions(data);
        } finally {
            setLoading(false);
        }
    }

    return (
        <TransactionContext.Provider
            value={{ transactions, loading, fetchTransactions }}
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