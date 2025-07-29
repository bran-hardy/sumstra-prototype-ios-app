import { ExpenseCategory } from "@/types/transaction";

export const isExpenseCategory = (category: ExpenseCategory): boolean => {
    return category != 'INCOME';
};

export const isTransactionThisMonth = (dateString: string): boolean => {
    const txnDate = new Date(dateString);
    const now = new Date();
    return txnDate.getMonth() === now.getMonth() &&
           txnDate.getFullYear() === now.getFullYear();
};