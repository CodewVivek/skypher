import React, { useState, useEffect } from "react";
import { Telescope, CirclePlus, CircleUserRound, Settings, LogOut, User } from 'lucide-react';
import { Link } from "react-router-dom";
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Header = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const handlepopover = (event) => {
        event.stopPropagation();
        if (anchorEl) {
            setAnchorEl(null);
        } else {
            setAnchorEl(event.currentTarget);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (anchorEl && !event.target.closest('.user-dropdown')) {
                handleClose();
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [anchorEl]);

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const handleSignOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            toast.success('Signed out successfully');
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error.message);
            toast.error('Failed to sign out');
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 bg-blue-400 text-black z-50 h-16 mb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex justify-between items-center h-full">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <Telescope className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-light tracking-wide text-white group-hover:text-white/90">
                            Skypher
                        </span>
                    </Link>

                    <nav className="flex items-center space-x-8">
                        <Link to="/submit" className="text-white/90 hover:text-white transition-colors font-medium flex gap-1 items-center justify-center">
                            <CirclePlus />Submit
                        </Link>

                        <Link to="/UserRegister" className="text-white/90 hover:text-white transition-colors font-medium">
                            Get Started
                        </Link>

                        {user?.email === 'vivekmanikonda113@gmail.com' && (
                            <Link to="/admin" className="text-white/90 hover:text-white transition-colors font-medium">
                                Admin
                            </Link>
                        )}

                        <div className="text-white/90 hover:text-white transition-colors font-medium user-dropdown relative">
                            <button className="p-2 rounded-full hover:bg-white/20 transition-colors">
                                <CircleUserRound className="w-6 h-6 text-white" onClick={handlepopover} />
                            </button>
                            {open && (
                                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-lg border border-gray-100 py-1 z-50">
                                    {user ? (
                                        <>
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-900">Account</p>
                                                <p className="text-xs text-gray-500 truncate">{user.Displayname}</p>
                                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                            </div>
                                            <div className="py-1">
                                                <button
                                                    onClick={() => {
                                                        handleClose();
                                                        navigate('/profile');
                                                    }}
                                                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                >
                                                    <User className="w-4 h-4 mr-2" />
                                                    Profile
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        handleClose();
                                                        navigate('/settings');
                                                    }}
                                                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                >
                                                    <Settings className="w-4 h-4 mr-2" />
                                                    Settings
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        handleClose();
                                                        handleSignOut();
                                                    }}
                                                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4 mr-2" />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="py-1">
                                            <button
                                                onClick={() => {
                                                    handleClose();
                                                    navigate('/UserRegister');
                                                }}
                                                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <CircleUserRound className="w-4 h-4 mr-2" />
                                                Sign In
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;