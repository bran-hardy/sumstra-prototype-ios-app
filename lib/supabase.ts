import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://eqorimkcetgdfzkqtjwc.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxb3JpbWtjZXRnZGZ6a3F0andjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxNDIyMjUsImV4cCI6MjA2ODcxODIyNX0.G1B_Xw4LGLAnMtfSLavLh-VI_WjmS9TMZ3fiqNBeXl4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})