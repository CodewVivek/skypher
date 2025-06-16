// UserRegister.jsx
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import Alert from '@mui/material/Alert';

const UserRegister = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleGoogleSignIn = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                }
            });

            if (error) {
                console.error('Google sign in error:', error);
                setError(error.message);
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            setError('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-100 via-white to-blue-100 px-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Welcome to StartupHunt</h1>

                <div className="space-y-6">
                    <p className="text-center text-gray-600">
                        Sign in with your Google account to get started
                    </p>

                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >

                        Continue with Google
                    </button>

                    <div className="text-center text-gray-500 text-sm">
                        By continuing, you agree to our Terms of Service and Privacy Policy
                    </div>

                    {error && <Alert severity="error" className="mt-4">{error}</Alert>}
                    {success && <Alert severity="success" className="mt-4">{success}</Alert>}
                </div>
            </div>
        </div>
    );
};

export default UserRegister;
