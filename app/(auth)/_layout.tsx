import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { Slot, useRouter } from "expo-router";
import { useEffect, useState } from "react";

export default function AuthLayout() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<Session | null>(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    if (loading) return null;

    return <Slot />
}