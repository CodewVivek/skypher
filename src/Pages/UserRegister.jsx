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
                    redirectTo: `${window.location.origin}/`,
                    queryParams: {
                        access_type: 'offline',

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
        <div className="min-h-screen flex items-center justify-center bg-white  px-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-transform duration-300">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-2">
                        Welcome to Launch It
                    </h1>
                    <p className="text-gray-600 text-lg">
                        DECODE LIMITLESS GOWRTH
                    </p>
                </div>

                <div className="space-y-6">
                    <p className="text-center text-gray-600 text-lg">
                        Sign in with your Google account to get started
                    </p>

                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 px-6 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        <span className="text-lg font-medium">Continue with Google</span>
                    </button>

                    <div className="text-center text-gray-500 text-sm space-y-2">
                        <p>By continuing, you agree to our</p>
                        <div className="space-x-2">
                            <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>
                            <span>and</span>
                            <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
                        </div>
                    </div>

                    {error && (
                        <Alert
                            severity="error"
                            className="mt-4 rounded-lg"
                            sx={{
                                '& .MuiAlert-icon': { color: 'white' },
                                backgroundColor: '#FEE2E2',
                                color: '#991B1B'
                            }}
                        >
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert
                            severity="success"
                            className="mt-4 rounded-lg"
                            sx={{
                                '& .MuiAlert-icon': { color: 'white' },
                                backgroundColor: '#DCFCE7',
                                color: '#166534'
                            }}
                        >
                            {success}
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserRegister;
