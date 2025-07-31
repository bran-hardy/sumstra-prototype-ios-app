import { AppConfig, Category } from "@/constants";
import { useThemeColor } from "@/hooks";
import { useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Button, Input } from "../ui";

export default function TransactionForm() {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(Category.INCOME);
    const [loading, setLoading] = useState(false);

    const unselectedButtonTextColor = useThemeColor('text');

    function categoryButtonStyle(name: string) {
        return category === name ? styles.categorySelected : styles.categoryUnselected;
    }

    function categoryTextColor(name: string) {
        return category === name ? unselectedButtonTextColor : unselectedButtonTextColor + '88';
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
                        autoCapitalize="none"
                        onChangeText={(text) => setAmount(text)}
                        keyboardType="email-address"
                    />
                    <Input
                        label="Description"
                        placeholder="i.e. Rent, Groceries"
                        value={description}
                        secureTextEntry={true}
                        onChangeText={(text) => setDescription(text)}
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
                    <View style={styles.actionContainer}>
                        <Button title="Add" disabled={loading} onPress={() => {}} />
                    </View>
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