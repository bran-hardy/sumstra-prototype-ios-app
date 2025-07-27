export type ExpenseCategory = "WANT" | "NEED" | "SAVING" | "INCOME";

export interface Transaction {
    id: string;
    description: string;
    amount: number;
    category: ExpenseCategory;
    date: string;
    user_id: string;
}