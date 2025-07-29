import { TransactionContext } from "@/providers/TransactionProvider";
import { useContext } from "react";

export const useTransaction = () => {
    const context = useContext(TransactionContext);

    if (!context) {
        throw new Error('useTransactions must be used with a TransactionProvider');
    }

    return context;
}