import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

interface AuthState {
    user: User | null;
    session: Session | null;
    profile: { username: string } | null;
    isLoading: boolean;
    error: string | null;

    initialize: () => Promise<void>;
    signIn: (email: string) => Promise<boolean>; // Magic Link for simplicity or we can add password
    signOut: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    session: null,
    isLoading: true,
    error: null,

    initialize: async () => {
        try {
            set({ isLoading: true });
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                set({ session, user: session.user });
            }

            supabase.auth.onAuthStateChange(async (_event, session) => {
                set({ session, user: session?.user ?? null });
            });

        } catch (e: any) {
            console.error("Auth Init Error", e);
        } finally {
            set({ isLoading: false });
        }
    },

    signIn: async (email: string) => {
        try {
            set({ isLoading: true, error: null });
            // Using Magic Link (OTP) for simplicity and pixel-art vibe ("Enter simple code")
            const { error } = await supabase.auth.signInWithOtp({ email });

            if (error) throw error;
            return true;
        } catch (e: any) {
            set({ error: e.message });
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null, session: null });
    },

    clearError: () => set({ error: null })
}));
