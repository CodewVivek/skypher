import React, { useState, useEffect } from "react";
import {
    Rocket, CirclePlus, CircleUserRound, Settings, LogOut, User, Menu, X, Video
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";
import NotificationBell from "./NotificationBell";
import LaunchDropdown from "../Components/LaunchDropdown";

const Header = () => {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const getUserInfo = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) return;
            setUser(user);

            if (user) {
                const { data: profile, error: profileError } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", user.id)
                    .single();

                if (!profileError && profile?.role) {
                    setUserRole(profile.role);
                }
            }
        };

        getUserInfo();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const newUser = session?.user ?? null;
            setUser(newUser);

            if (newUser) {
                supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", newUser.id)
                    .single()
                    .then(({ data, error }) => {
                        if (!error && data?.role) {
                            setUserRole(data.role);
                        } else {
                            setUserRole(null);
                        }
                    });
            } else {
                setUserRole(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handlepopover = (event) => {
        event.stopPropagation();
        setAnchorEl(prev => (prev ? null : event.currentTarget));
    };

    const handleClose = () => setAnchorEl(null);
    const open = Boolean(anchorEl);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (anchorEl && !event.target.closest(".user-dropdown")) {
                handleClose();
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [anchorEl]);

    const handleSignOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            toast.success("Signed out successfully");
            navigate("/");
            setMobileMenuOpen(false);
        } catch (error) {
            toast.error("Failed to sign out");
            console.error("Sign-out error:", error.message);
        }
    };

    const handleProfileClick = async () => {
        handleClose();
        if (user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', user.id)
                .single();
            if (profile && profile.username) {
                navigate(`/profile/${profile.username}`);
                setMobileMenuOpen(false);
            } else {
                toast.error('Profile not found');
            }
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 bg-white text-white z-50 ">
            <div className="max-w-7xl mx-auto px-4 h-16">
                <div className="flex justify-between items-center h-full">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="w-8 h-8  flex items-center justify-center">
                            <img src="/images/r6_circle.png" alt="l" />

                        </div>
                        <span className="text-xl font-bold tracking-wide">
                            <span className="text-black">Launch</span>
                            <span className="text-gray-800">IT</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <LaunchDropdown user={user} />
                        <Link to="/coming-soon" className="text-gray-800 hover:text-black font-medium flex items-center gap-2">
                            <Rocket className="w-4 h-4" />
                            Coming Soon
                        </Link>

                        {!user && (
                            <Link to="/launchpage" className="text-gray-800 hover:text-white font-medium">
                                Get Started
                            </Link>
                        )}

                        {userRole === "admin" && (
                            <Link to="/admin" className="text-gray-800 hover:text-white font-medium">Admin</Link>
                        )}

                        {user && <NotificationBell />}

                        {/* User Dropdown */}
                        <div className="user-dropdown relative">
                            <button className="p-2 rounded-full hover:bg-white/20" onClick={handlepopover}>
                                {user ? (
                                    <img
                                        src={user.user_metadata?.avatar_url || user.user_metadata?.picture || 'https://via.placeholder.com/32'}
                                        alt="profile"
                                        className="w-6 h-6 rounded-full"
                                    />
                                ) : (
                                    <CircleUserRound className="w-6 h-6 text-white" />
                                )}
                            </button>

                            {open && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                    {user ? (
                                        <>
                                            <div className="px-4 py-2 border-b border-gray-200">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={user.user_metadata?.avatar_url || "https://via.placeholder.com/32"}
                                                        alt="profile"
                                                        className="w-6 h-6 rounded-full"
                                                    />
                                                    <p className="text-sm font-semibold text-gray-700">
                                                        {user.user_metadata?.full_name || user.user_metadata?.name || "No Name"}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1 truncate max-w-[160px] block">{user.email}</p>
                                            </div>

                                            <div className="py-1">
                                                <button onClick={handleProfileClick}
                                                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                    <User className="w-4 h-4 mr-2" />
                                                    Profile
                                                </button>
                                                <button onClick={() => { handleClose(); navigate("/settings"); }}
                                                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                    <Settings className="w-4 h-4 mr-2" />
                                                    Settings
                                                </button>
                                                <button onClick={() => { handleClose(); handleSignOut(); }}
                                                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                                    <LogOut className="w-4 h-4 mr-2" />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="py-1">
                                            <button onClick={() => { handleClose(); navigate("/UserRegister"); }}
                                                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                <CircleUserRound className="w-4 h-4 mr-2" />
                                                Sign In
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-2">
                        <div className="user-dropdown relative">
                            <button className="p-2 rounded-full hover:bg-white/20" onClick={handlepopover}>
                                {user ? (
                                    <img
                                        src={user.user_metadata?.avatar_url || user.user_metadata?.picture || 'https://via.placeholder.com/32'}
                                        alt="profile"
                                        className="w-6 h-6 rounded-full"
                                    />
                                ) : (
                                    <CircleUserRound className="w-6 h-6 text-white" />
                                )}
                            </button>

                            {open && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                    {user ? (
                                        <>
                                            <div className="px-4 py-2 border-b border-gray-200">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={user.user_metadata?.avatar_url || "https://via.placeholder.com/32"}
                                                        alt="profile"
                                                        className="w-6 h-6 rounded-full"
                                                    />
                                                    <p className="text-sm font-semibold text-gray-700">
                                                        {user.user_metadata?.full_name || user.user_metadata?.name || "No Name"}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1 truncate max-w-[160px] block">{user.email}</p>
                                            </div>

                                            <div className="py-1">
                                                <button onClick={handleProfileClick}
                                                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                    <User className="w-4 h-4 mr-2" />
                                                    Profile
                                                </button>
                                                <button onClick={() => { handleClose(); navigate("/settings"); }}
                                                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                    <Settings className="w-4 h-4 mr-2" />
                                                    Settings
                                                </button>
                                                <button onClick={() => { handleClose(); handleSignOut(); }}
                                                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                                    <LogOut className="w-4 h-4 mr-2" />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="py-1">
                                            <button onClick={() => { handleClose(); navigate("/UserRegister"); }}
                                                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                <CircleUserRound className="w-4 h-4 mr-2" />
                                                Sign In
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-lg hover:bg-white/20 text-white"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {
                mobileMenuOpen && (
                    <div className="md:hidden bg-blue-400 border-t border-blue-300">
                        <div className="px-4 py-4 space-y-3">
                            <Link
                                to="/submit"
                                className="flex items-center space-x-2 text-gray-800 hover:text-white font-medium py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <CirclePlus className="w-5 h-5" />
                                <span>Submit Startup</span>
                            </Link>

                            {user && (
                                <Link
                                    to="/upload-pitch"
                                    className="flex items-center space-x-2 text-gray-800 hover:text-white font-medium py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Video className="w-5 h-5" />
                                    <span>Upload Pitch</span>
                                </Link>
                            )}

                            <Link
                                to="/coming-soon"
                                className="flex items-center space-x-2 text-gray-800 hover:text-white font-medium py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Rocket className="w-5 h-5" />
                                <span>Coming Soon</span>
                            </Link>

                            {!user && (
                                <Link
                                    to="/launchpage"
                                    className="block text-gray-800 hover:text-white font-medium py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Get Started
                                </Link>
                            )}

                            {userRole === "admin" && (
                                <Link
                                    to="/admin"
                                    className="block text-gray-800 hover:text-white font-medium py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Admin
                                </Link>
                            )}

                            {user && (
                                <div className="flex items-center space-x-2 text-gray-800 hover:text-white font-medium py-2">
                                    <NotificationBell />
                                    <span>Notifications</span>
                                </div>
                            )}
                        </div>
                    </div>
                )
            }
        </header >
    );
};

export default Header;