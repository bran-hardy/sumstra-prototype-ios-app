import { supabase } from "@/lib/supabase";
import { Alert } from "react-native";

export class AuthAPI {
    static async signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        
        if (error) Alert.alert(error.message);
        
        return data;
    }

    static async signUp(email: string, password: string) {
        const { data: { session }, error } = await supabase.auth.signUp({ email, password });

        if (error) Alert.alert(error.message);
        if (!session) Alert.alert('Please check your inbox for email verification!');

        return session;
    }

    static async signOut() {
        return await supabase.auth.signOut();
    }

    static async getSession() {
        return await supabase.auth.getSession();
    }
}