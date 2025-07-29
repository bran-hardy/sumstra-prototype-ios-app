import { useAuth } from "@/hooks";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Dimensions, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Button, Input } from '../components/ui';
import { supabase } from '../lib/supabase';

export default function LoginScreen() {
    const router = useRouter();
    const { session } = useAuth();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (session) {
            router.replace('/(protected)');
        }
    }, [session])

    async function signInWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) Alert.alert(error.message);
        setLoading(false);
    }

    async function signUpWithEmail() {
        setLoading(true);
        const {
            data: { session },
            error,
        } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) Alert.alert(error.message);
        if (!session) Alert.alert('Please check your inbox for email verification!');
        setLoading(false);
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Input
                        label="Email"
                        placeholder="email@address.com"
                        value={email}
                        autoCapitalize="none"
                        onChangeText={(text) => setEmail(text)}
                        keyboardType="email-address"
                    />
                    <Input
                        label="Password"
                        placeholder="Password"
                        value={password}
                        secureTextEntry={true}
                        onChangeText={(text) => setPassword(text)}
                    />
                    <View style={[styles.verticallySpaced, styles.mt20, styles.flexRow]}>
                        <Button title="Sign in" disabled={loading} onPress={() => signInWithEmail()} buttonStyle={styles.flexGrow} />
                        <Button title="Sign Up" disabled={loading} onPress={() => signUpWithEmail()} buttonStyle={styles.flexGrow} />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('window').height,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 32,
        gap: 20,
    },
    verticallySpaced: {
        paddingTop: 4,
        paddingBottom: 4,
        alignSelf: 'stretch',
    },
    mt20: {
        marginTop: 20,
    },
    button: {
        backgroundColor: '#527bff',
        borderRadius: 10,
    },
    flexRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 20,
        marginBottom: 60,
    },
    flexGrow: {
        flexGrow: 1,
    }
})