export type ExpenseCategory = "WANT" | "NEED" | "SAVING" | "INCOME";

export interface Transaction {
    id: string;
    description: string;
    amount: number;
    category: ExpenseCategory;
    date: string;
    user_id: string;
    created_at?: string;
    updated_at?: string;
}

export type NewTransaction = Omit<Transaction, 'id' | 'created_at' | 'updated_at'>;

export type TransactionUpdate = Partial<Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

export type FilterType = 'ALL' | ExpenseCategory | 'THIS_MONTH';

export interface TransactionWithMeta extends Transaction {
    formattedDate: string;
    formattedAmount: string;
    isExpense: boolean;
    isThisMonth: boolean;
}

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

export const isExpenseCategory = (category: ExpenseCategory): boolean => {
    return category != 'INCOME';
};

export const isTransactionThisMonth = (dateString: string): boolean => {
    const txnDate = new Date(dateString);
    const now = new Date();
    return txnDate.getMonth() === now.getMonth() &&
           txnDate.getFullYear() === now.getFullYear();
};