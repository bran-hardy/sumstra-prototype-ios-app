import { AppConfig, Category, ValidationRules } from "@/constants";
import { useAuth, useThemeColor, useTransaction } from "@/hooks";
import { NewTransaction, TransactionCategory } from "@/types/transaction";
import { useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Button, Input } from "../ui";

interface TranactionFormProps {
    onSubmit?: () => void;
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export default function TransactionForm({ onSubmit, onSuccess, onError }: TranactionFormProps) {
    const { session } = useAuth();
    const { addTransaction } = useTransaction(); 

    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<TransactionCategory>(Category.INCOME);
    const [loading, setLoading] = useState(false);

    const [amountError, setAmountError] = useState<string | undefined>(undefined);
    const [descriptionError, setDescriptionError] = useState<string | undefined>(undefined);

    const unselectedButtonTextColor = useThemeColor('text');

    function validateAmount() {
        const amountDecimal = parseFloat(amount);
        if (amountDecimal < ValidationRules.AMOUNT_MIN) {
            setAmountError(`Amount must be greater than 0`);
        } else if (amountDecimal > ValidationRules.AMOUNT_MAX) {
            setAmountError(`Amount must be less than ${ValidationRules.AMOUNT_MAX}`);
        } else {
            setAmountError(undefined);
        }
    }

    function validateDescription() {
        if (description.length > ValidationRules.TRANSACTION_DESCRIPTION_MAX_LENGTH) {
            setDescriptionError(`Description must be shorter than ${ValidationRules.TRANSACTION_DESCRIPTION_MAX_LENGTH} characters`);
        } else {
            setDescriptionError(undefined);
        }
    }

    function categoryButtonStyle(name: string) {
        return category === name ? styles.categorySelected : styles.categoryUnselected;
    }

    function categoryTextColor(name: string) {
        return category === name ? unselectedButtonTextColor : unselectedButtonTextColor + '88';
    }

    const handleSubmit = async () => {
        validateAmount()
        validateDescription()

        if (!session) {
            return;
        }

        if (amountError || descriptionError) {
            return;
        }

        const now = new Date();

        const transaction: NewTransaction = {
            description: description,
            amount: parseFloat(amount),
            date: now,
            category: category,
            user_id: session.user.id,
        }

        addTransaction(transaction);
        onSuccess?.();
    }

    return(
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Input
                        label="Amount"
                        placeholder="$0.00"
                        value={amount}
                        error={amountError}
                        inputMode="decimal"
                        autoCapitalize="none"
                        onChangeText={(text) => setAmount(text)}
                        onEndEditing={validateAmount}
                        keyboardType="decimal-pad"
                    />
                    <Input
                        label="Description"
                        placeholder="i.e. Rent, Groceries"
                        value={description}
                        error={descriptionError}
                        onChangeText={(text) => setDescription(text)}
                        onEndEditing={validateDescription}
                    />
                    <View style={styles.categoryContainer}>
                        <Button 
                            title="Income"
                            onPress={() => setCategory("INCOME")}
                            buttonStyle={ categoryButtonStyle(Category.INCOME) }
                            textStyle={ { color:categoryTextColor(Category.INCOME) } }
                        />
                        <Button
                            title="Want"
                            onPress={() => setCategory("WANT")}
                            buttonStyle={ categoryButtonStyle(Category.WANT) }
                            textStyle={ { color:categoryTextColor(Category.WANT) } }
                        />
                        <Button 
                            title="Need" 
                            onPress={() => setCategory("NEED")}
                            buttonStyle={ categoryButtonStyle(Category.NEED) }
                            textStyle={ { color:categoryTextColor(Category.NEED) } }
                        />
                        <Button 
                            title="Saving" 
                            onPress={() => setCategory("SAVING")}
                            buttonStyle={ categoryButtonStyle(Category.SAVING) }
                            textStyle={ { color:categoryTextColor(Category.SAVING) } }
                        />
                    </View>
                    <Button title="Add" disabled={loading} onPress={() => handleSubmit()} />
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: AppConfig.SPACING.sm
    },
    categoryContainer: {
        flexDirection: 'row',
        paddingBottom: AppConfig.SPACING.md,
    },
    categorySelected: {
        flexGrow: 1,
    },
    categoryUnselected: {
        flexGrow: 1,
        backgroundColor: 'transparent',
    },
    actionContainer: {

    }
});