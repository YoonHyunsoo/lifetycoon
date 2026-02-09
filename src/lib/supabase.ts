import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Key is missing in .env');
}

// Safe Initialization
const url = supabaseUrl || 'https://placeholder.supabase.co';
const key = supabaseAnonKey || 'placeholder-key';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('🚨 Supabase Keys Missing! Check .env or Vercel Settings.');
}

export const supabase = createClient(url, key);

export const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: import.meta.env.VITE_SITE_URL
                ? `${import.meta.env.VITE_SITE_URL}/`
                : `${window.location.origin}/`, // Defaults to origin, but can be overridden for mobile testing
            queryParams: {
                access_type: 'offline', // Request refresh token
                prompt: 'consent',
            },
        },
    });

    if (error) {
        console.error('Google Auth Error:', error.message);
        throw error;
    }

    return data;
};
