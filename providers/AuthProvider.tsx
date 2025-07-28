import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

interface AuthContextType {
    session: any;
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
    refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshSession = useCallback(async () => {
        try {
            const { data: { session }, error } = await supabase.auth.refreshSession();

            if (error) {
                console.error('Error refreshing session:', error);
                return;
            }

            setSession(session);
        } catch (error) {
            console.error('Unexpected error refreshing session:', error);
        }
    }, []);

    const signOut = useCallback(async () => {
        try {
            setLoading(true);
            const { error } = await supabase.auth.signOut();

            if (error) {
                console.error('Error signing out:', error);
                return;
            }

            setSession(null);
        } catch (error) {
            console.error('Error during sign out:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let mounted = true;

        const fetchSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    console.error ('Error fetching session:', error);
                    return;
                }

                if (mounted) {
                    setSession(session);
                }
            } catch (error) {
                console.error('Unexpected error fetching session', error);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchSession();
        
        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth state changed:', event);

                if (mounted) {
                    setSession(session);
                    setLoading(false);
                }

                switch (event) {
                    case 'SIGNED_IN':
                        console.log('User signed in');
                        break;
                    case 'SIGNED_OUT':
                        console.log('User signed out');
                        break;
                    case 'TOKEN_REFRESHED':
                        console.log('Token refreshed');
                        break;
                    case 'USER_UPDATED':
                        console.log('User updated');
                        break;
                }
            }
        );

        return () => {
            mounted = false;
            subscription.unsubscribe();
        }
    }, []);

    const value: AuthContextType = {
        session,
        user: session?.user ?? null,
        loading,
        signOut,
        refreshSession
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}