import { ThemedText } from "@/components";
import { AppConfig, ValidationRules } from "@/constants";
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
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [emailError, setEmailError] = useState<string | undefined>(undefined);
    const [passwordError, setPasswordError] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (session) {
            router.replace('/(protected)');
        }
    }, [session]);

    async function signInWithEmail() {
        setLoading(true);

        validateEmail();
        validatePassword();

        if (!emailError && !passwordError) {
            AuthAPI.signIn(email, password);
        }

        setLoading(false);
    }

    function validateEmail() {
        if (!ValidationRules.EMAIL.test(email)) {
            setEmailError('You must enter a proper email address.');
        } else {
            setEmailError(undefined);
        }
    }

    function validatePassword() {
        if (ValidationRules.PASSWORD_MIN_LENGTH > password.length) {
            setPasswordError(`Password must be greater than ${ValidationRules.PASSWORD_MIN_LENGTH} characters`);
        } else {
            setPasswordError(undefined);
        }
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
                            label="Email"
                            placeholder="email@address.com"
                            value={email}
                            autoCapitalize="none"
                            error={emailError}
                            onChangeText={(text) => setEmail(text)}
                            keyboardType="email-address"
                            spellCheck={false}
                            onEndEditing={validateEmail}
                        />
                        <Input
                            label="Password"
                            placeholder="********"
                            value={password}
                            secureTextEntry={true}
                            error={passwordError}
                            onChangeText={(text) => setPassword(text)}
                            onEndEditing={validatePassword}
                        />
                    </View>
                    <Button
                        title="Log In"
                        disabled={loading}
                        onPress={() => signInWithEmail()}
                        buttonStyle={styles.loginButton}
                        textStyle={styles.loginText}
                    />
                    <View style={styles.signup}>
                        <ThemedText>New user?</ThemedText>
                        <Link href='/signup'>
                            <ThemedText style={styles.signupLink}>Sign Up</ThemedText>
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
        gap: AppConfig.SPACING.md,
    },
    logo: {
        marginBottom: AppConfig.SPACING.xxl,
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
        gap: AppConfig.SPACING.sm,
    },
    signupLink: {
        fontWeight: 700,
    }
})