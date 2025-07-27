import { supabase } from "@/lib/supabase";
import { Transaction } from "@/types/Transaction";
import { Alert } from "react-native";


export const getAllTransactions = async (
    userId: string
):Promise<Transaction[]> => {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId);

    if (error) Alert.alert(error.message);
    return (data ?? []) as Transaction[];
}

export const addTransaction = async (
    transaction: Omit<Transaction, 'id'>
): Promise<Transaction | null> => {
    const { data, error } = await supabase
        .from('transactions')
        .insert(transaction)
        .select()
        .single(); 
    
    if (error) Alert.alert(error.message);
    return data as Transaction;
}

export const editTransaction = async (
    id: string,
    updates: Partial<Omit<Transaction, 'id' | 'user_id'>>
): Promise<Transaction | null> => {
    const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    
    if (error) Alert.alert(error.message);

    return data as Transaction;
}

export const deleteTransaction = async (
    id: string
): Promise<boolean> => {
    const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
    
    if (error) Alert.alert(error.message);
    return true;
}