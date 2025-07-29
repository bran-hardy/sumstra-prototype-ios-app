import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function Account({ session }: { session: Session }) {
    const [loading, setLoading] = useState(true);
    const [username, SetUsername] = useState('');
    
    useEffect(() => {
        if (session) getProfile()
    }, [session]);

    async function getProfile() {
        try {
            setLoading(true);
            if (!session?.user) throw new Error('No user on the session!');

            const { data, error, status } = await supabase
                .from('profiles')
                .select('name')
                .eq('id', session?.user.id)
                .single();
            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                SetUsername(data.name);
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    async function updateProfile({ username }: { username: string }) {
        try {
            setLoading(true);
            if (!session?.user) throw new Error("No nuser on the session!");

            const updates = {
                id: session?.user.id,
                name: username,
                updated_at: new Date(),
            }

            const { error } = await supabase.from('profiles').upsert(updates);

            if (error) {
                throw error
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <View style={[styles.verticallySpaced, styles.mt20]}>
                <Text>Email</Text>
                <TextInput value={session?.user?.email} editable={false} />
            </View>
            <View style={[styles.verticallySpaced, styles.mt20]}>
                <Text>Name</Text>
                <TextInput value={username} />
            </View>

            <View style={styles.verticallySpaced}>
                <Button 
                    title={ loading ? 'loading ...' : 'Update' }
                    onPress={() => updateProfile({ username })}
                    disabled={loading}
                />
            </View>

            <View style={styles.verticallySpaced}>
                <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        padding: 12,
    },
    verticallySpaced: {
        paddingTop: 4,
        paddingBottom: 4,
        alignSelf: 'stretch',
    },
    mt20: {
        marginTop: 20,
    }
})