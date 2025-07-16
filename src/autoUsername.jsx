import { supabase } from './supabaseClient';

/**
 * Ensures the logged-in user has a unique username. If not, generates and assigns one.
 * Call this after Google login.
 */
export async function ensureAutoUsername() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('username, full_name')
        .eq('id', user.id)
        .single();

    if (!profile) return;

    if (!profile.username) {
        // Generate a base username from full name
        let base = (profile.full_name || 'user').replace(/\s+/g, '').toLowerCase();
        let username = base;
        let suffix = Math.floor(Math.random() * 10000);

        // Check for uniqueness
        let { data: exists } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', username)
            .single();

        while (exists) {
            username = base + suffix;
            suffix = Math.floor(Math.random() * 10000);
            ({ data: exists } = await supabase
                .from('profiles')
                .select('id')
                .eq('username', username)
                .single());
        }

        // Save the username
        await supabase
            .from('profiles')
            .update({ username })
            .eq('id', user.id);
    }
} 