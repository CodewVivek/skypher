import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const useAdmin = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAdminStatus();
    }, []);

    const checkAdminStatus = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                // Get user role from profiles table
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (error) {
                    console.error('Error fetching user role:', error);
                    setUserRole('user');
                    setIsAdmin(false);
                } else {
                    const role = profile?.role || 'user';
                    setUserRole(role);
                    setIsAdmin(role === 'admin');
                }
            } else {
                setUserRole('user');
                setIsAdmin(false);
            }
        } catch (error) {
            console.error('Error checking admin status:', error);
            setUserRole('user');
            setIsAdmin(false);
        } finally {
            setLoading(false);
        }
    };

    return { isAdmin, userRole, loading };
}; 