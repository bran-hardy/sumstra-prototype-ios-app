import { supabase } from "@/lib/supabase";
import { Transaction } from "@/types/transaction";

export class TransactionError extends Error {
    constructor(message: string, public originalError?: any) {
        super(message);
        this.name = 'TransactionError';
    }
}

export class TransactionAPI {
    static async getAll(userId: string): Promise<Transaction[]> {
        try {
            const { data, error } = await supabase
                .from('transactions')
                .select('*')
                .eq('user_id', userId)
                .order('date', { ascending: false });

            if (error) {
                throw new TransactionError('Failed to fetch transactions', error);
            }

            return data || [];
        } catch (error) {
            console.error('Error fetching transactions:', error);
            throw error instanceof TransactionError ? error : new TransactionError('Unexpected error occurred');
        }
    }

    static async create(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
        try {
            const { data, error } = await supabase
                .from('transactions')
                .insert(transaction)
                .select()
                .single();
            
            if (error) {
                throw new TransactionError('Failed to add transaction', error);
            }

            if (!data) {
                throw new TransactionError('No data returned after adding transaction');
            }

            return data;
        } catch (error) {
            console.error('Error adding transaction:', error);
            throw error instanceof TransactionError ? error : new TransactionError('Unexpected error occurred');
        }
    }

    static async update(id: string, updates: Partial<Omit<Transaction, 'id' | 'user_id'>>): Promise<Transaction> {
        try {
            const { data, error } = await supabase
                .from('transactions')
                .update(updates)
                .eq('id', id)
                .select()
                .single();
            
            if (error) {
                throw new TransactionError('Failed to update transaction', error);
            }

            if (!data) {
                throw new TransactionError('Transaction not found or update failed');
            }

            return data;
        } catch (error) {
            console.error('Error updating transaction:', error);
            throw error instanceof TransactionError ? error : new TransactionError('Unexpected error occurred');
        }
    }

    static async delete(id: string): Promise<void> {
        try {
            const { error } = await supabase
                .from('transactions')
                .delete()
                .eq('id', id);
            
            if (error) {
                throw new TransactionError('Failed to delete transaction', error);
            }
        } catch (error) {
            console.error('Error deleting transaction:', error);
            throw error instanceof TransactionError ? error : new TransactionError('Unexpected error occurred');
        }
    }
}