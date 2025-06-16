import React, { useState, useEffect } from "react";
import { Telescope, CirclePlus } from 'lucide-react';
import { CircleUserRound } from 'lucide-react';
import { Link } from "react-router-dom";
import { supabase } from '../supabaseClient';

const Header = () => {
    const [user, setUser] = useState(null);

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

    return (
        <header className={`fixed top-0 left-0 right-0 bg-blue-400 text-black `}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
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

                        <Link to="/admin" className="text-white/90 hover:text-white transition-colors font-medium">
                            <button className="p-2 rounded-full hover:bg-white/20 transition-colors">
                                <CircleUserRound className="w-6 h-6 text-white" />
                            </button>
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;