import React, { useState, useEffect } from "react";
import {
    Rocket,
    CirclePlus,
    CircleUserRound,
    Settings,
    LogOut,
    User,
    Menu,
    X,
} from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import NotificationBell from "./NotificationBell";
import { Snackbar, Alert } from "@mui/material";

const Header = () => {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [profile, setProfile] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "error",
    });
    const navigate = useNavigate();

    useEffect(() => {
        const getUserInfo = async () => {
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser();
            if (error) return;
            setUser(user);
            if (user) {
                const { data: profileData, error: profileError } = await supabase
                    .from("profiles")
                    .select("full_name, role")
                    .eq("id", user.id)
                    .single();

                if (!profileError && profileData) {
                    setProfile(profileData);
                    if (profileData.role) setUserRole(profileData.role);
                }
            }
        };
        getUserInfo();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            const newUser = session?.user ?? null;
            setUser(newUser);

            if (newUser) {
                supabase
                    .from("profiles")
                    .select("full_name, role")
                    .eq("id", newUser.id)
                    .single()
                    .then(({ data, error }) => {
                        if (!error && data) {
                            setProfile(data);
                            if (data.role) setUserRole(data.role);
                        } else {
                            setProfile(null);
                            setUserRole(null);
                        }
                    });
            } else {
                setProfile(null);
                setUserRole(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handlepopover = (event) => {
        event.stopPropagation();
        setAnchorEl((prev) => (prev ? null : event.currentTarget));
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
            setUser(null);
            setProfile(null);
            setIsDropdownOpen(false);
            navigate("/");
        } catch (error) {
            console.error("Error signing out:", error);

            setSnackbar({
                open: true,
                message: "Error signing out",
                severity: "error",
            });
        }
    };

    const handleProfileClick = async () => {
        handleClose();

        if (user) {
            const { data: userProfile } = await supabase
                .from("profiles")
                .select("username")
                .eq("id", user.id)
                .single();

            if (userProfile && userProfile.username) {
                navigate(`/profile/${userProfile.username}`);
                setMobileMenuOpen(false);
            } else {
                setSnackbar({
                    open: true,
                    message: "Profile not found",
                    severity: "error",
                });
            }
        }
    };

    return (
        <>
            <header className="
  fixed top-0 left-0 right-0
  bg-blue-500/60 dark:bg-gray-900/60
  backdrop-blur-md
  border-b border-blue-400 dark:border-gray-800
  z-50 shadow transition-colors duration-300
">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 h-16">
                    <div className="flex justify-between items-center h-full">
                        <Link to="/" className="flex items-center space-x-2 group min-w-0">
                            <img
                                src="/images/r6.png"
                                alt="LaunchIT Logo"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <span className="text-lg sm:text-xl font-bold tracking-wide truncate">
                                <span className="text-black dark:text-white">Launch</span>
                                <span className="text-gray-800 dark:text-gray-200">IT</span>
                            </span>
                        </Link>
                        <nav className="hidden md:flex items-center space-x-4 sm:space-x-6">
                            <Link
                                to="/submit"
                                className="text-white/90 hover:text-white font-medium flex items-center gap-2"
                            >
                                <CirclePlus className="w-4 h-4" />
                                Submit
                            </Link>
                            {user && (
                                <div className="flex items-center gap-4">
                                    <NotificationBell />
                                    <Link
                                        to="/upload-pitch"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-full font-semibold shadow hover:bg-blue-700 transition"
                                    >

                                        Add Pitch
                                    </Link>
                                </div>
                            )}

                            {userRole === "admin" && (
                                <Link
                                    to="/admin"
                                    className="text-white/90 hover:text-white font-medium"
                                >
                                    Admin
                                </Link>
                            )}
                            <DarkModeToggle />
                            <div className="user-dropdown relative">
                                <button
                                    className="p-2 rounded-full hover:bg-white/20"
                                    onClick={handlepopover}
                                >
                                    {user ? (
                                        <img
                                            src={
                                                user.user_metadata?.avatar_url ||
                                                user.user_metadata?.picture ||
                                                "https://via.placeholder.com/32"
                                            }
                                            alt="profile"
                                            className="w-6 h-6 rounded-full"
                                        />
                                    ) : (
                                        <CircleUserRound className="w-6 h-6 text-white" />
                                    )}
                                </button>
                                {open && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                                        {user ? (
                                            <>
                                                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={
                                                                user.user_metadata?.avatar_url ||
                                                                "https://via.placeholder.com/32"
                                                            }
                                                            alt="profile"
                                                            className="w-6 h-6 rounded-full"
                                                        />
                                                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                                            {profile?.full_name ||
                                                                user.user_metadata?.full_name ||
                                                                user.user_metadata?.name ||
                                                                "No Name"}
                                                        </p>
                                                    </div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate max-w-[160px] block">
                                                        {user.email}
                                                    </p>
                                                </div>
                                                <div className="py-1">
                                                    <button
                                                        onClick={handleProfileClick}
                                                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                    >

                                                        <User className="w-4 h-4 mr-2" />
                                                        Profile
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleClose();
                                                            navigate("/settings");
                                                        }}
                                                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                    >

                                                        <Settings className="w-4 h-4 mr-2" /> Settings
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleClose();
                                                            handleSignOut();
                                                        }}
                                                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    >

                                                        <LogOut className="w-4 h-4 mr-2" /> Sign Out
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="py-1">

                                                <button
                                                    onClick={() => {
                                                        handleClose();
                                                        navigate("/UserRegister");
                                                    }}
                                                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                >

                                                    <CircleUserRound className="w-4 h-4 mr-2" /> Sign
                                                    In
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </nav>
                        <div className="md:hidden flex items-center space-x-2">
                            <DarkModeToggle />
                            <div className="user-dropdown relative">
                                <button
                                    className="p-2 rounded-full hover:bg-white/20"
                                    onClick={handlepopover}
                                >
                                    {user ? (
                                        <img
                                            src={
                                                user.user_metadata?.avatar_url ||
                                                user.user_metadata?.picture ||
                                                "https://via.placeholder.com/32"
                                            }
                                            alt="profile"
                                            className="w-6 h-6 rounded-full"
                                        />
                                    ) : (
                                        <CircleUserRound className="w-6 h-6 text-white" />
                                    )}
                                </button>
                                {open && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">

                                        {user ? (
                                            <>

                                                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">

                                                    <div className="flex items-center gap-3">

                                                        <img
                                                            src={
                                                                user.user_metadata?.avatar_url ||
                                                                "https://via.placeholder.com/32"
                                                            }
                                                            alt="profile"
                                                            className="w-6 h-6 rounded-full"
                                                        />
                                                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">

                                                            {profile?.full_name ||
                                                                user.user_metadata?.full_name ||
                                                                user.user_metadata?.name ||
                                                                "No Name"}
                                                        </p>
                                                    </div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate max-w-[160px] block">

                                                        {user.email}
                                                    </p>
                                                </div>
                                                <div className="py-1">

                                                    <button
                                                        onClick={handleProfileClick}
                                                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                    >

                                                        <User className="w-4 h-4 mr-2" /> Profile
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleClose();
                                                            navigate("/settings");
                                                        }}
                                                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                    >

                                                        <Settings className="w-4 h-4 mr-2" /> Settings
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleClose();
                                                            handleSignOut();
                                                        }}
                                                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    >

                                                        <LogOut className="w-4 h-4 mr-2" /> Sign Out
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="py-1">

                                                <button
                                                    onClick={() => {
                                                        handleClose();
                                                        navigate("/UserRegister");
                                                    }}
                                                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                >

                                                    <CircleUserRound className="w-4 h-4 mr-2" /> Sign
                                                    In
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

                                {mobileMenuOpen ? (
                                    <X className="w-6 h-6" />
                                ) : (
                                    <Menu className="w-6 h-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-blue-400 dark:bg-gray-800 border-t border-blue-300 dark:border-gray-700">

                        <div className="px-2 py-4 space-y-2">

                            <Link
                                to="/submit"
                                className="flex items-center space-x-2 text-white/90 hover:text-white font-medium py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >

                                <CirclePlus className="w-5 h-5" />
                                <span>Submit Startup</span>
                            </Link>
                            {!user && (
                                <Link
                                    to="/launchpage"
                                    className="block text-white/90 hover:text-white font-medium py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >

                                    Get Started
                                </Link>
                            )}
                            {user && (
                                <Link
                                    to="/upload-pitch"
                                    className="block text-white/90 hover:text-white font-medium py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >

                                    Add Pitch
                                </Link>
                            )}
                            {userRole === "admin" && (
                                <Link
                                    to="/admin"
                                    className="block text-white/90 hover:text-white font-medium py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >

                                    Admin
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </header>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() =>
                    setSnackbar({
                        ...snackbar,
                        open: false,
                    })
                }
            >

                <Alert
                    onClose={() =>
                        setSnackbar({
                            ...snackbar,
                            open: false,
                        })
                    }
                    severity={snackbar.severity}
                    sx={{
                        width: "100%",
                    }}
                >

                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default Header;
