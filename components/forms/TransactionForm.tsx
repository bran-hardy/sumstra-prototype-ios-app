import { useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Button, Input } from "../ui";

export default function TransactionForm() {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);

    return(
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Input
                        label="Amount"
                        placeholder="0.00"
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
        
    },
    actionContainer: {

    }
});