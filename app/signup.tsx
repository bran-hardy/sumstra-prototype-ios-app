import { ThemedText } from "@/components";
import { AppConfig } from "@/constants";
import { useAuth } from "@/hooks";
import { AuthAPI } from "@/services/api";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Image, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Button, Input } from '../components/ui';

const logo = require('../assets/images/sumstra-prototype-logo.png');

export default function LoginScreen() {
    const router = useRouter();
    const { session } = useAuth();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (session) {
            router.replace('/(protected)');
        }
    }, [session]);
    
    async function signUpWithEmail() {
        setLoading(true);

        AuthAPI.signUp(email, password);

        setLoading(false);
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Image
                        source={logo}
                        style={styles.logo}
                    />
                    <View style={styles.inputContainer}>
                        <Input
                            label="Name"
                            placeholder="Ben Dover"
                            value={name}
                            autoCapitalize="none"
                            onChangeText={(text) => setName(text)}
                            inputStyle={styles.input}
                            labelStyle={styles.label}
                        />
                        <Input
                            label="Email"
                            placeholder="email@address.com"
                            value={email}
                            autoCapitalize="none"
                            onChangeText={(text) => setEmail(text)}
                            keyboardType="email-address"
                            inputStyle={styles.input}
                            labelStyle={styles.label}
                        />
                        <Input
                            label="Password"
                            placeholder="********"
                            value={password}
                            secureTextEntry={true}
                            onChangeText={(text) => setPassword(text)}
                            inputStyle={styles.input}
                            labelStyle={styles.label}
                        />
                    </View>
                    <Button
                        title="Sign Up"
                        disabled={loading}
                        onPress={() => signUpWithEmail()}
                        buttonStyle={styles.loginButton}
                        textStyle={styles.loginText}
                    />
                    <View style={styles.signup}>
                        <ThemedText>Already have an account?</ThemedText>
                        <Link href='/login' >
                            <ThemedText style={styles.signupLink}>Log in</ThemedText>
                        </Link>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('window').height,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: 'center',
        padding: AppConfig.SPACING.xl,
        gap: AppConfig.SPACING.md,
    },
    inputContainer: {
        flexDirection: "column",
        width: '100%',
        gap: AppConfig.SPACING.sm,
    },
    logo: {
        marginBottom: AppConfig.SPACING.xxl,
    },
    input: {
        fontSize: AppConfig.FONT_SIZES.md,
        borderRadius: AppConfig.BORDER_RADIUS.full,
        paddingHorizontal: AppConfig.SPACING.md,
        paddingVertical: AppConfig.SPACING.md,
        backgroundColor: '#202020',
        borderWidth: 0,
    },
    label: {
        color: "#FFF",
        fontSize: AppConfig.FONT_SIZES.md,
        paddingHorizontal: AppConfig.SPACING.md,
    },
    loginButton: {
        width: '100%',
        borderRadius: AppConfig.BORDER_RADIUS.full,
        backgroundColor: '#D80F07',
        boxShadow: '0 10px 20px -10px #58320A',
    },
    loginText: {
        fontWeight: 700,
    },
    signup: {
        flexDirection: 'row',
        gap: AppConfig.SPACING.xs,
    },
    signupLink: {
        fontWeight: 700,
    }
})