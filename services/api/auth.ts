import { supabase } from "@/lib/supabase";

export class AuthAPI {
    static async signIn(email: string, password: string) {
        return await supabase.auth.signInWithPassword({ email, password });
    }

    static async signUp(email: string, password: string) {
        return await supabase.auth.signUp({ email, password });
    }

    static async signOut() {
        return await supabase.auth.signOut();
    }

    static async getSession() {
        return await supabase.auth.getSession();
    }
}