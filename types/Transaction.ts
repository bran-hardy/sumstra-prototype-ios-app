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